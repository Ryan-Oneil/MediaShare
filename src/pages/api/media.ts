import type { NextApiRequest, NextApiResponse } from "next";
import { getUserIdFromJWT, withRequestAuth } from "@/lib/firebase/wrapperUtils";
import { getUploadUrl, uploadMedia } from "@/lib/services/galleryService";
import { checkUserStorage } from "@/lib/services/userService";

const handlePostCall = async (req: NextApiRequest, res: NextApiResponse) => {
  const uid = await getUserIdFromJWT(req.cookies.jwt);
  let urls: string[] = [];
  let totalSize = 0;

  for (const { name, size } of req.body) {
    if (!name || !size) {
      return res.status(400).json({ error: "Missing name or size" });
    }
    totalSize += size;

    const url = await getUploadUrl(name, size);
    urls.push(url);
  }

  if (await checkUserStorage(uid, totalSize)) {
    return res.status(200).json(urls);
  }
  return res.status(400).json("Not enough storage space");
};

const handlePutCall = async (req: NextApiRequest, res: NextApiResponse) => {
  const uid = await getUserIdFromJWT(req.headers.authorization);
  const { url, mediaSize, mediaType, id } = req.body;

  try {
    await uploadMedia(uid, url, mediaSize, mediaType, id);

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
