import { S3Client } from "@aws-sdk/client-s3";

let s3: S3Client;

export const getS3Client = () => {
  if (!s3) {
    s3 = new S3Client({
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.S3_SECRET_KEY as string,
      },
    });
  }
  return s3;
};
