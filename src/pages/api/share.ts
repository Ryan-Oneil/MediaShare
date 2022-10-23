import { NextApiRequest, NextApiResponse } from "next";
import { getUserIdFromJWT, withRequestAuth } from "@/lib/firebase/wrapperUtils";
import {
  addFilesToLink,
  createShareLink,
} from "@/lib/services/fileshareService";
import { z } from "zod";

export const createShareLinkSchema = z.object({
  title: z.string().trim().max(60).default("Untitled"),
  files: z.array(
    z.object({
      name: z.string().trim().min(1),
      size: z.number().positive().min(1),
      added: z.date().default(new Date()),
      linkId: z.string().default(""),
    })
  ),
});

const s3UploadSchema = z.object({
  size: z.number().positive().min(1),
  contentType: z.string().trim().min(1),
  originalFileName: z.string().trim().min(1),
  url: z.string().trim().min(1),
  id: z.string().trim().min(1),
  linkid: z.string().trim().min(1),
});

const handlePostCall = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const uid = await getUserIdFromJWT(req.cookies.jwt);
    const { files, title } = createShareLinkSchema.parse(req.body);

    const sharedLink = await createShareLink(uid, files, title);

    return res.status(200).json(sharedLink);
  } catch (error) {
    return res.status(400).send(error);
  }
};

const handlePutCall = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const uid = await getUserIdFromJWT(req.headers.authorization);
    const { originalFileName, url, id, contentType, size, linkid } =
      s3UploadSchema.parse(req.body);

    addFilesToLink(uid, linkid, [
      {
        name: originalFileName,
        url,
        _id: id,
        contentType,
        added: new Date(),
        size,
      },
    ]);
    return res.status(200).end();
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PUT") {
    return handlePutCall(req, res);
  }

  if (req.method === "POST") {
    return handlePostCall(req, res);
  }

  return res.status(405).end();
};

export default withRequestAuth(handler);
