import { S3Client } from "@aws-sdk/client-s3";

let s3Proxy: S3Client;
let s3: S3Client;

export const getProxyS3Client = () => {
  if (!s3Proxy) {
    s3Proxy = new S3Client({
      region: process.env.S3_REGION,
      endpoint: process.env.S3_PROXY_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.S3_SECRET_KEY as string,
      },
    });
  }
  return s3Proxy;
};

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
