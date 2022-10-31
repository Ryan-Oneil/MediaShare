import dbConnect from "@/lib/mongoose";
import User from "@/lib/mongoose/model/User";
import { deleteS3Files, getS3SignedUrl } from "@/lib/amazon/S3Client";
import { hasSufficientStorage } from "@/lib/services/userService";

const getMediaSize = (contentType: string, size: number) => {
  const storage = {
    videoUsed: 0,
    imageUsed: 0,
  };

  if (contentType.startsWith("video")) {
    storage.videoUsed = size;
  } else if (contentType.startsWith("image")) {
    storage.imageUsed = size;
  }
  return storage;
};

export const uploadMedia = async (
  uploaderUid: string,
  mediaUrl: string,
  mediaSize: number,
  contentType: string,
  id: string
) => {
  await dbConnect();

  const storage = getMediaSize(contentType, mediaSize);

  return User.findOneAndUpdate(
    { externalId: uploaderUid },
    {
      $push: {
        medias: {
          $each: [
            {
              _id: id,
              url: mediaUrl,
              size: mediaSize,
              contentType: contentType,
              date: new Date(),
            },
          ],
          $position: 0,
        },
      },
      $inc: {
        "storage.usedTotal": mediaSize,
        "storage.videoUsed": storage.videoUsed,
        "storage.imageUsed": storage.imageUsed,
      },
    }
  ).exec();
};

export const generateUploadUrls = async (
  userId: string,
  medias: Array<{ name: string; size: number }>
) => {
  const totalSize = medias.reduce((acc, curr) => acc + curr.size, 0);

  if (!(await hasSufficientStorage(userId, totalSize))) {
    throw new Error("Insufficient storage");
  }

  return Promise.all(
    medias.map(async (media) => {
      return getS3SignedUrl(
        media.name,
        process.env.S3_MEDIA_BUCKET as string,

        media.size
      );
    })
  );
};

export const deleteMedia = async (uploaderUid: string, mediaId: string) => {
  const { medias, storage } = await User.findOne(
    { externalId: uploaderUid },
    { medias: { $elemMatch: { _id: mediaId } }, storage: 1 }
  )
    .orFail(() => new Error("Media not found"))
    .lean()
    .exec();

  const { size, contentType } = medias[0];

  const mediaSize = getMediaSize(contentType, size);

  return deleteS3Files(
    [{ Key: mediaId }],
    process.env.S3_MEDIA_BUCKET as string
  )
    .then(() => {
      return User.findOneAndUpdate(
        { externalId: uploaderUid },
        {
          $pull: { medias: { _id: mediaId } },
          $set: {
            "storage.usedTotal": Math.max(storage.usedTotal - size, 0),
            "storage.videoUsed": Math.max(
              storage.videoUsed - mediaSize.videoUsed,
              0
            ),
            "storage.imageUsed": Math.max(
              storage.imageUsed - mediaSize.imageUsed,
              0
            ),
          },
        }
      )
        .exec()
        .catch((err) => console.log("Error occurred", err));
    })
    .catch((err) => console.log(err));
};
