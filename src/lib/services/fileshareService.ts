import User from "@/lib/mongoose/model/User";
import { UUID } from "bson";
import dbConnect from "../mongoose";
import { hasSufficientStorage } from "@/lib/services/userService";
import { getProxyS3Client, getS3Client } from "@/lib/amazon/S3Client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { UploadedItem } from "@/features/gallery/types/UploadTypes";
import { IPendingFile, ISharedLink } from "@/lib/mongoose/model/SharedLink";

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

  if (!pendingFileUploads) {
    return 0;
  }

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

const generateUploadUrl = (files: Array<IPendingFile>, linkId: string) => {
  return files.map(async (file) => {
    return {
      name: file.name,
      url: await getUploadUrl(file.name, file.size, linkId),
    };
  });
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

  const uploadUrls = await Promise.all(generateUploadUrl(files, linkId));

  const { maxSharedLength } = await User.findOne(
    { externalId: uploaderUid },
    { maxSharedLength: 1 }
  )
    .orFail(() => new Error("User not found"))
    .lean()
    .exec();

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + maxSharedLength);

  await User.findOneAndUpdate(
    { externalId: uploaderUid },
    {
      $push: {
        sharedLinks: {
          $each: [
            {
              _id: linkId,
              size: totalSize,
              title,
              files: [],
              expires: expiryDate,
            },
          ],
          $position: 0,
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
  files: Array<IPendingFile>,
  title: string
) => {
  const totalSize = files.reduce((total, file) => total + file.size, 0);
  const pendingUploadSize = await getPendingUploadSize(uploaderUid);

  if (
    !(await hasSufficientStorage(uploaderUid, totalSize + pendingUploadSize))
  ) {
    throw new Error("Insufficient storage");
  }

  const uploadUrls = await Promise.all(generateUploadUrl(files, linkId));

  if (title) {
    User.findOneAndUpdate(
      { externalId: uploaderUid, "sharedLinks._id": linkId },
      {
        $set: {
          "sharedLinks.$.title": title,
        },
      }
    ).exec();
  }
  files.forEach((file) => {
    file.linkId = linkId;
  });
  await savePendingUpload(uploaderUid, files);

  return {
    linkId,
    size: totalSize,
    uploadUrls,
  };
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

  //deletes uploaded files that were not found in pending uploads
  const filesToDelete = files.filter(
    (file) =>
      !pendingFileUploads.find((pendingFile) => pendingFile.name === file.name)
  );
  deleteS3Files(filesToDelete);

  const uploadedFiles = pendingFileUploads.map((pendingUpload) => {
    const file = files.find(
      (uploadedFile) => uploadedFile.name === pendingUpload.name
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
  if (files.length === 0) {
    return;
  }
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

const deleteSharedLinks = (
  expiredLinks: Array<ISharedLink>,
  userUid: string
) => {
  const expiredLinkIds = expiredLinks.map((link) => link._id);
  const expiredLinkSize = expiredLinks.reduce(
    (total: number, link) => total + link.size,
    0
  );

  deleteS3Files(expiredLinks.flatMap((link) => link.files));

  return User.findOneAndUpdate(
    { externalId: userUid },
    {
      $inc: {
        "storage.usedTotal": -expiredLinkSize,
        "storage.documentUsed": -expiredLinkSize,
      },
      $pull: {
        sharedLinks: {
          _id: {
            $in: expiredLinkIds,
          },
        },
      },
    }
  ).exec();
};

export const getSharedLink = async (linkId: string) => {
  await dbConnect();

  const { sharedLinks } = await User.findOne(
    { "sharedLinks._id": linkId },
    { "sharedLinks.$": 1 }
  )
    .orFail(() => new Error("Link not found"))
    .exec();

  const sharedLink = sharedLinks[0];

  if (isLinkExpired(sharedLink)) {
    User.findOne({ "sharedLinks._id": linkId }, { externalId: 1 })
      .lean()
      .orFail(
        () =>
          new Error(
            "Link or user not found when attempting to delete expired link"
          )
      )
      .exec()
      .then(({ externalId }) => {
        deleteSharedLinks([sharedLink], externalId);
      });

    throw new Error("This link has expired");
  }
  return sharedLink;
};

export const isLinkExpired = (link: ISharedLink) => {
  const expiryDate = link.expires;

  return expiryDate && expiryDate < new Date();
};

export const deleteUsersExpiredSharedLinks = async (userUid: string) => {
  await dbConnect();

  const { sharedLinks } = await User.findOne(
    { externalId: userUid },
    { sharedLinks: 1 }
  )
    .orFail(() => new Error("User not found"))
    .lean()
    .exec();

  const expiredLinks = sharedLinks.filter((link) => {
    return isLinkExpired(link);
  });

  if (expiredLinks.length > 0) {
    deleteSharedLinks(expiredLinks, userUid);
  }
};

export const deleteFileFromLink = async (userUid: string, fileId: string) => {
  await dbConnect();
  const { sharedLinks } = await User.findOne(
    { externalId: userUid, "sharedLinks.files._id": fileId },
    { "sharedLinks.$": 1 }
  )
    .orFail(() => new Error("Link not found"))
    .lean()
    .exec();

  const link = sharedLinks[0];
  const fileToDelete = link.files.find((file) => file._id === fileId);

  if (!fileToDelete) {
    throw new Error("File not found");
  }

  deleteS3Files([fileToDelete]);

  return User.findOneAndUpdate(
    { externalId: userUid, "sharedLinks._id": link._id },
    {
      $inc: {
        "sharedLinks.$.size": -fileToDelete.size,
        "storage.usedTotal": -fileToDelete.size,
        "storage.documentUsed": -fileToDelete.size,
      },
      $pull: {
        "sharedLinks.$.files": {
          _id: fileId,
        },
      },
    }
  ).exec();
};
