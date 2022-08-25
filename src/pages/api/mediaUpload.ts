// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { withRequestAuth } from "@/lib/firebase/wrapperUtils";
import { getS3Client } from "@/lib/amazon/S3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type Data = {
  url: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === "GET") {
    const s3Client = getS3Client();
    const date = new Date();

    const uploadParams = {
      Bucket: process.env.S3_MEDIA_BUCKET,
      Key: req.body.name,
    };
    const signedURl = await getSignedUrl(
      s3Client,
      new PutObjectCommand(uploadParams),
      {
        expiresIn: 86400,
        signingDate: date,
      }
    );
    return res
      .status(200)
      .json({ url: signedURl + "&date=" + date.toISOString() });
  }
  return res.status(200).end();
};

// export default withRequestAuth(handler);
export default handler;
