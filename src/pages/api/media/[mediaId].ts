import { NextApiRequest, NextApiResponse } from "next";
import { getUserIdFromJWT, withRequestAuth } from "@/lib/firebase/wrapperUtils";
import { deleteMedia } from "@/lib/services/galleryService";

const handleDeleteCall = async (req: NextApiRequest, res: NextApiResponse) => {
  const uid = await getUserIdFromJWT(req.cookies.jwt);
  const { mediaId } = req.query as { mediaId: string };

  try {
    await deleteMedia(uid, mediaId);

    return res.status(200).end();
  } catch (err: any) {
    return res.status(500).json(err.message);
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "DELETE") {
    return handleDeleteCall(req, res);
  }
  return res.status(405).end();
};

export default withRequestAuth(handler);
