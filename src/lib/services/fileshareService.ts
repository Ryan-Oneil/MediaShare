import User from "@/lib/mongoose/model/User";
import { UUID } from "bson";
import dbConnect from "../mongoose";
import { hasSufficientStorage } from "@/lib/services/userService";
import { getProxyS3Client } from "@/lib/amazon/S3Client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { UploadedItem } from "@/features/gallery/types/UploadTypes";
import { IPendingFile } from "@/lib/mongoose/model/SharedLink";

const getUploadUrl = async (fileName: string, size: number, linkId: string) => {
  const uploadParams = {
    Bucket: process.env.S3_FILE_BUCKET,
    Key: fileName,
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
        fileName: file.fileName,
        url: await getUploadUrl(file.fileName, file.size, linkId),
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
    files.map((file) => getUploadUrl(file.fileName, file.size, linkId))
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
          fileName: { $in: uploadNames },
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
  const uploadNames = files.map((file) => file.filename);

  const pendingFileUploads = await getPendingFilesByName(
    uploaderUid,
    linkId,
    uploadNames
  );

  // TODO: delete files from cloud storage if not in pending uploads
  const uploadedFiles = pendingFileUploads.map((pendingUpload) => {
    const file = files.find(
      (file) => file.filename === pendingUpload.fileName
    ) as UploadedItem;

    return {
      filename: pendingUpload.fileName,
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
          fileName: {
            $in: uploadNames,
          },
          linkId,
        },
      },
    }
  ).exec();
};
