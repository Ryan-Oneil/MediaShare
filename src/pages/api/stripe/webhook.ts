// Stripe requires the raw body to construct the event.
import { Readable } from "stream";
import { NextApiRequest, NextApiResponse } from "next";
import { withRequestAuth } from "@/lib/firebase/wrapperUtils";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import { handleSubscriptionChange } from "@/lib/services/userService";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

const handlePostCall = async (req: NextApiRequest, res: NextApiResponse) => {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          await handleSubscriptionChange(
            subscription.customer as string,
            subscription.id
          );
          break;
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            await handleSubscriptionChange(
              checkoutSession.customer as string,
              subscriptionId as string
            );
          }
          break;
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send('Webhook error: "Webhook handler failed. View logs."');
    }
  }

  res.json({ received: true });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    return handlePostCall(req, res);
  }
  res.setHeader("Allow", "POST");
  return res.status(405).end();
};

export default handler;
