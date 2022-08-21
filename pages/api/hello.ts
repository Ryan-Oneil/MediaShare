// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { withRequestAuth } from "@/lib/firebase/wrapperUtils";

type Data = {
  name: string;
};

const handler = (req: NextApiRequest, res: NextApiResponse<Data>) => {
  return res.status(200).json({ name: "John Doe" });
};

export default withRequestAuth(handler);
