import type { NextApiRequest, NextApiResponse } from "next";
import { getUserIdFromJWT, withRequestAuth } from "@/lib/firebase/wrapperUtils";
import { getUploadUrl, uploadMedia } from "@/lib/services/galleryService";

type Data = {
  url: string;
};

const handleGetCall = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const presignedUrl = await getUploadUrl(req.body.mediaName);

  return res.status(200).json({ url: presignedUrl });
};

const handlePutCall = async (req: NextApiRequest, res: NextApiResponse) => {
  const uid = await getUserIdFromJWT(req.cookies.jwt);
  const { url, mediaSize, mediaType } = req.body;

  try {
    await uploadMedia(uid, url, mediaSize, mediaType);
    return res.status(200).end();
  } catch (err) {
    return res.status(500).json({ error: "Error uploading media" });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === "GET") {
    return handleGetCall(req, res);
  }

  if (req.method === "PUT") {
    return handlePutCall(req, res);
  }
  return res.status(405).end();
};

// export default withRequestAuth(handler);
export default handler;
