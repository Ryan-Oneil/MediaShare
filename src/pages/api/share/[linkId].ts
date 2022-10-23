import { NextApiRequest, NextApiResponse } from "next";
import { getUserIdFromJWT, withRequestAuth } from "@/lib/firebase/wrapperUtils";
import {
  addPendingFilesToLink,
  deleteSharedLink,
} from "@/lib/services/fileshareService";
import { createShareLinkSchema } from "../share";

const handleDeleteCall = async (req: NextApiRequest, res: NextApiResponse) => {
  const uid = await getUserIdFromJWT(req.cookies.jwt);
  const { linkId } = req.query as { linkId: string };

  try {
    await deleteSharedLink(uid, linkId);

    return res.status(200).end();
  } catch (err: any) {
    return res.status(500).json(err.message);
  }
};

const handlePostCall = async (req: NextApiRequest, res: NextApiResponse) => {
  const uid = await getUserIdFromJWT(req.cookies.jwt);
  const { linkId } = req.query as { linkId: string };
  const { files, title } = createShareLinkSchema.parse(req.body);

  try {
    const urls = await addPendingFilesToLink(uid, linkId, files, title);

    return res.status(200).json(urls);
  } catch (err: any) {
    console.log(err);
    return res.status(500).json(err.message);
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "DELETE") {
    return handleDeleteCall(req, res);
  }
  if (req.method === "POST") {
    return handlePostCall(req, res);
  }
  return res.status(405).end();
};

export default withRequestAuth(handler);
