import { NextApiRequest, NextApiResponse } from "next";
import { getUserIdFromJWT, withRequestAuth } from "@/lib/firebase/wrapperUtils";
import {
  addFilesToLink,
  createShareLink,
} from "@/lib/services/fileshareService";

const handlePostCall = async (req: NextApiRequest, res: NextApiResponse) => {
  const uid = await getUserIdFromJWT(req.cookies.jwt);
  const { files, title } = req.body;

  const sharedLink = await createShareLink(uid, files, title);

  return res.status(200).json(sharedLink);
};

const handlePutCall = async (req: NextApiRequest, res: NextApiResponse) => {
  const uid = await getUserIdFromJWT(req.headers.authorization);
  const { originalFileName, url, id, contentType, size, linkid } = req.body;

  // delete file if functions fails
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
