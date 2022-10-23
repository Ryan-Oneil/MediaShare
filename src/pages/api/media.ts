import type { NextApiRequest, NextApiResponse } from "next";
import { getUserIdFromJWT, withRequestAuth } from "@/lib/firebase/wrapperUtils";
import { generateUploadUrls, uploadMedia } from "@/lib/services/galleryService";
import { z } from "zod";

const uploadMediaSchema = z.array(
  z.object({
    name: z.string().trim().min(1),
    size: z.number().positive().min(1),
  })
);

const uploadedMediaScheme = z.object({
  id: z.string().trim().min(1),
  url: z.string().trim().min(1),
  contentType: z.string().trim().min(1),
  size: z.number().positive().min(1),
});

const handlePostCall = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const uid = await getUserIdFromJWT(req.cookies.jwt);
    const medias = uploadMediaSchema.parse(req.body);

    const urls = await generateUploadUrls(uid, medias);

    return res.status(200).json(urls);
  } catch (error) {
    return res.status(400).send(error);
  }
};

const handlePutCall = async (req: NextApiRequest, res: NextApiResponse) => {
  const uid = await getUserIdFromJWT(req.headers.authorization);

  try {
    const { url, size, contentType, id } = uploadedMediaScheme.parse(req.body);
    await uploadMedia(uid, url, size, contentType, id);

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
