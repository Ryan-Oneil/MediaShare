import { NextApiRequest, NextApiResponse } from "next";
import { getUserIdFromJWT, withRequestAuth } from "@/lib/firebase/wrapperUtils";
import { getUserById } from "@/lib/services/userService";

const handleGetCall = async (req: NextApiRequest, res: NextApiResponse) => {
  const uid = await getUserIdFromJWT(req.cookies.jwt);
  const { subscription } = await getUserById(uid, "subscription");

  if (subscription) {
    return res.status(200).json(subscription.planId);
  }
  return res.status(200).json("none");
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return handleGetCall(req, res);
  }
  res.setHeader("Allow", "GET");
  return res.status(405).end();
};

export default withRequestAuth(handler);
