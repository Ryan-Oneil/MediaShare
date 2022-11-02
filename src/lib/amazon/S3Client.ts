import {
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ObjectIdentifier } from "@aws-sdk/client-s3/dist-types/models/models_0";
import { PutObjectCommandInput } from "@aws-sdk/client-s3/dist-types/commands/PutObjectCommand";

let s3Proxy: S3Client;
let s3: S3Client;

const getProxyS3Client = () => {
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

const getS3Client = () => {
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

export const getS3SignedUrl = async (
  key: string,
  bucket: string,
  fileSize: number,
  metadata?: { [key: string]: string }
) => {
  const uploadParams: PutObjectCommandInput = {
    Bucket: bucket,
    Key: key,
    ContentLength: fileSize,
  };

  if (metadata) {
    uploadParams.Metadata = metadata;
  }

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

export const deleteS3Files = async (
  keys: ObjectIdentifier[],
  bucket: string
) => {
  if (keys.length === 0) {
    return;
  }
  const s3Client = getS3Client();

  const deleteParams = {
    Bucket: bucket,
    Delete: {
      Objects: keys,
    },
  };

  return s3Client.send(new DeleteObjectsCommand(deleteParams));
};
