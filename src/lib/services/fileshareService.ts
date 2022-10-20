import User from "@/lib/mongoose/model/User";
import { UUID } from "bson";
import dbConnect from "../mongoose";
import { hasSufficientStorage } from "@/lib/services/userService";
import { getProxyS3Client, getS3Client } from "@/lib/amazon/S3Client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { UploadedItem } from "@/features/gallery/types/UploadTypes";
import { IPendingFile } from "@/lib/mongoose/model/SharedLink";

const getUploadUrl = async (name: string, size: number, linkId: string) => {
  const uploadParams = {
    Bucket: process.env.S3_FILE_BUCKET,
    Key: name,
    ContentLength: size,
    Metadata: {
      "link-id": linkId,
    },
  };

  const s3Client = getProxyS3Client();
  const date = new Date();

  const signedURl = await getSignedUrl(
    s3Client,
    new PutObjectCommand(uploadParams),
    {
      expiresIn: 3600,
      signingDate: date,
      signableHeaders: new Set<string>(["host", "content-length"]),
    }
  );
  return signedURl + "&date=" + date.toISOString();
};

const getPendingUploadSize = async (userUid: string) => {
  await dbConnect();

  const { pendingFileUploads } = await User.findOne(
    { externalId: userUid },
    { pendingUploads: 1 }
  )
    .orFail(() => new Error("User not found"))
    .exec();

  return pendingFileUploads.reduce((acc: number, curr) => acc + curr.size, 0);
};

const savePendingUpload = async (
  userUid: string,
  files: Array<IPendingFile>
) => {
  await dbConnect();

  return User.findOneAndUpdate(
    { externalId: userUid },
    {
      $push: {
        pendingFileUploads: {
          $each: files,
        },
      },
    }
  ).exec();
};

export const createShareLink = async (
  uploaderUid: string,
  files: Array<IPendingFile>,
  title: string
) => {
  const totalSize = files.reduce((total, file) => total + file.size, 0);

  if (!(await hasSufficientStorage(uploaderUid, totalSize))) {
    throw new Error("Insufficient storage");
  }
  const linkId = new UUID().toString();
  files.forEach((file) => {
    file.linkId = linkId;
  });

  const uploadUrls = await Promise.all(
    files.map(async (file) => {
      return {
        name: file.name,
        url: await getUploadUrl(file.name, file.size, linkId),
      };
    })
  );

  await User.findOneAndUpdate(
    { externalId: uploaderUid },
    {
      $push: {
        sharedLinks: {
          _id: linkId,
          size: totalSize,
          title,
          files: [],
        },
        pendingFileUploads: {
          $each: files,
        },
      },
    }
  ).exec();

  return {
    linkId,
    size: totalSize,
    uploadUrls,
  };
};

export const addPendingFilesToLink = async (
  uploaderUid: string,
  linkId: string,
  files: Array<IPendingFile>
) => {
  const totalSize = files.reduce((total, file) => total + file.size, 0);
  const pendingUploadSize = await getPendingUploadSize(uploaderUid);

  if (
    !(await hasSufficientStorage(uploaderUid, totalSize + pendingUploadSize))
  ) {
    throw new Error("Insufficient storage");
  }

  const uploadUrls = await Promise.all(
    files.map((file) => getUploadUrl(file.name, file.size, linkId))
  );

  await savePendingUpload(uploaderUid, files);

  return uploadUrls;
};

const getPendingFilesByName = async (
  userUid: string,
  linkId: string,
  uploadNames: Array<string>
) => {
  const pendingFiles = await User.findOne(
    {
      externalId: userUid,
    },
    {
      pendingFileUploads: {
        $elemMatch: {
          linkId: linkId,
          name: { $in: uploadNames },
        },
      },
    }
  )
    .orFail(() => new Error("No pending files found for this shared link"))
    .lean()
    .exec();

  return pendingFiles.pendingFileUploads;
};

export const addFilesToLink = async (
  uploaderUid: string,
  linkId: string,
  files: Array<UploadedItem>
) => {
  await dbConnect();
  const uploadNames = files.map((file) => file.name);

  const pendingFileUploads = await getPendingFilesByName(
    uploaderUid,
    linkId,
    uploadNames
  );

  // TODO: delete files from cloud storage if not in pending uploads
  const uploadedFiles = pendingFileUploads.map((pendingUpload) => {
    const file = files.find(
      (file) => file.name === pendingUpload.name
    ) as UploadedItem;

    return {
      _id: file._id,
      name: pendingUpload.name,
      size: pendingUpload.size,
      url: file.url,
      contentType: file.contentType,
    };
  });

  const totalSize = uploadedFiles.reduce(
    (total: number, file: any) => total + file.size,
    0
  );

  return User.findOneAndUpdate(
    { externalId: uploaderUid, "sharedLinks._id": linkId },
    {
      $inc: {
        "sharedLinks.$.size": totalSize,
        "storage.usedTotal": totalSize,
        "storage.documentUsed": totalSize,
      },
      $addToSet: {
        "sharedLinks.$.files": {
          $each: uploadedFiles,
        },
      },
      $pull: {
        pendingFileUploads: {
          name: {
            $in: uploadNames,
          },
          linkId,
        },
      },
    }
  ).exec();
};

const deleteS3Files = (files: Array<UploadedItem>) => {
  const s3Client = getS3Client();

  const deleteParams = {
    Bucket: process.env.S3_FILE_BUCKET,
    Delete: {
      Objects: files.map((file) => ({ Key: file._id })),
    },
  };

  return s3Client.send(new DeleteObjectsCommand(deleteParams));
};

export const deleteSharedLink = async (userUid: string, linkId: string) => {
  await dbConnect();
  const { sharedLinks } = await User.findOne(
    { externalId: userUid, "sharedLinks._id": linkId },
    { "sharedLinks.$": 1 }
  )
    .orFail(() => new Error("Link not found"))
    .lean()
    .exec();

  const linkSize = sharedLinks[0].size;
  deleteS3Files(sharedLinks[0].files);

  return User.findOneAndUpdate(
    { externalId: userUid, "sharedLinks._id": linkId },
    {
      $inc: {
        "storage.usedTotal": -linkSize,
        "storage.documentUsed": -linkSize,
      },
      $pull: {
        sharedLinks: {
          _id: linkId,
        },
      },
    }
  ).exec();
};

// get shared link by link id without user id
export const getSharedLink = async (linkId: string) => {
  await dbConnect();

  const { sharedLinks } = await User.findOne(
    { "sharedLinks._id": linkId },
    { "sharedLinks.$": 1 }
  )
    .orFail(() => new Error("Link not found"))
    .lean()
    .exec();

  return sharedLinks[0];
};
