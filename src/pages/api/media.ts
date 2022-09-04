import type { NextApiRequest, NextApiResponse } from "next";
import { getUserIdFromJWT, withRequestAuth } from "@/lib/firebase/wrapperUtils";
import { getUploadUrl, uploadMedia } from "@/lib/services/galleryService";

const handlePostCall = async (req: NextApiRequest, res: NextApiResponse) => {
  let urls: string[] = [];

  for (const mediaName of req.body) {
    const url = await getUploadUrl(mediaName);
    urls.push(url);
  }

  return res.status(200).json(urls);
};

const handlePutCall = async (req: NextApiRequest, res: NextApiResponse) => {
  const uid = await getUserIdFromJWT(req.headers.authorization);
  const { url, mediaSize, mediaType } = req.body;

  try {
    await uploadMedia(uid, url, mediaSize, mediaType);

    return res.status(200).end();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error uploading media" });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    return handlePostCall(req, res);
  }

  if (req.method === "PUT") {
    return handlePutCall(req, res);
  }
  return res.status(405).end();
};

export default withRequestAuth(handler);
