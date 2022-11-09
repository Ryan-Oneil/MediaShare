import { NextApiRequest, NextApiResponse } from "next";
import { getParsedJWT, withRequestAuth } from "@/lib/firebase/wrapperUtils";
import { stripe } from "@/lib/stripe/server";
import { getHostedURL } from "@/utils/helpers";

const handlePostCall = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getParsedJWT(req.cookies.jwt);
  const { planId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      customer: user.uuid,
      customer_email: user.email,
      line_items: [
        {
          price: planId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: `${getHostedURL()}/dashboard`,
      cancel_url: `${getHostedURL()}/`,
    });

    return res.status(200).json(session.id);
  } catch (err: any) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    return handlePostCall(req, res);
  }
  res.setHeader("Allow", "POST");
  return res.status(405).end();
};

export default withRequestAuth(handler);
