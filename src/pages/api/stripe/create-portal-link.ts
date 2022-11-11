import { NextApiRequest, NextApiResponse } from "next";
import { getParsedJWT, withRequestAuth } from "@/lib/firebase/wrapperUtils";
import { stripe } from "@/lib/stripe/server";
import { getHostedURL } from "@/utils/helpers";
import { getOrCreateStripeCustomerId } from "@/lib/services/userService";

const handleGetCall = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getParsedJWT(req.cookies.jwt);
  const stripeCustomerId = await getOrCreateStripeCustomerId(
    user.uid,
    user.email || ""
  );

  try {
    const { url } = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${getHostedURL()}/dashboard`,
    });

    return res.status(200).json(url);
  } catch (err: any) {
    console.log(err);
    res.status(500).json(err);
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return handleGetCall(req, res);
  }
  res.setHeader("Allow", "GET");
  return res.status(405).end();
};

export default withRequestAuth(handler);
