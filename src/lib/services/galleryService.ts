import dbConnect from "@/lib/mongoose";
import User from "@/lib/mongoose/model/User";
import { getS3Client } from "@/lib/amazon/S3Client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const uploadMedia = async (
  uploaderUid: string,
  mediaUrl: string,
  mediaSize: number,
  contentType: string
) => {
  await dbConnect();

  const user = await User.findOne({ externalId: uploaderUid }, "medias").exec();
  user.medias.push({
    url: mediaUrl,
  });

  return user.save();
};

export const getUploadUrl = async (mediaName: string) => {
  const uploadParams = {
    Bucket: process.env.S3_MEDIA_BUCKET,
    Key: mediaName,
  };

  const s3Client = getS3Client();
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
