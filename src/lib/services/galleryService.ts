import dbConnect from "@/lib/mongoose";
import User from "@/lib/mongoose/model/User";
import { getProxyS3Client, getS3Client } from "@/lib/amazon/S3Client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

export const uploadMedia = async (
  uploaderUid: string,
  mediaUrl: string,
  mediaSize: number,
  contentType: string,
  id: string
) => {
  await dbConnect();

  return User.findOneAndUpdate(
    { externalId: uploaderUid },
    {
      $push: {
        medias: {
          _id: id,
          url: mediaUrl,
          size: mediaSize,
          contentType: contentType,
          date: new Date(),
        },
      },
    }
  ).exec();
};

export const getUploadUrl = async (mediaName: string) => {
  const uploadParams = {
    Bucket: process.env.S3_MEDIA_BUCKET,
    Key: mediaName,
  };

  const s3Client = getProxyS3Client();
  const date = new Date();

  const signedURl = await getSignedUrl(
    s3Client,
    new PutObjectCommand(uploadParams),
    {
      expiresIn: 3600,
      signingDate: date,
    }
  );
  return signedURl + "&date=" + date.toISOString();
};

export const deleteMedia = (uploaderUid: string, mediaId: string) => {
  const deleteParams = {
    Bucket: process.env.S3_MEDIA_BUCKET,
    Key: mediaId,
  };
  const s3Client = getS3Client();

  return s3Client
    .send(new DeleteObjectCommand(deleteParams))
    .then(() => {
      return User.findOneAndUpdate(
        { externalId: uploaderUid },
        { $pull: { medias: { _id: mediaId } } }
      )
        .exec()
        .catch((err) => console.log("Error occurred", err));
    })
    .catch((err) => console.log(err));
};
