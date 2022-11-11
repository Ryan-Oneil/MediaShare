import dbConnect from "../mongoose";
import User, { ISubscription } from "../mongoose/model/User";
import { stripe } from "@/lib/stripe/server";
import PricePlan from "@/lib/mongoose/model/PricePlan";

export const getUserById = async (userUid: string, fieldQuery: string) => {
  await dbConnect();

  let user = await User.findOne({ externalId: userUid }, fieldQuery)
    .lean()
    .exec();

  if (!user) {
    user = await createUser(userUid);
  }
  return user;
};

export const createUser = async (userUid: string) => {
  await dbConnect();

  const user = {
    externalId: userUid,
    storage: {
      usedTotal: 0,
      videoUsed: 0,
      imageUsed: 0,
      documentUsed: 0,
    },
    medias: [],
    sharedLinks: [],
  };
  return User.create(user);
};

export const hasSufficientStorage = async (
  userUid: string,
  mediaSize: number
) => {
  await dbConnect();

  const { storage } = await User.findOne(
    { externalId: userUid },
    { storage: 1 }
  )
    .orFail(() => new Error("User not found"))
    .exec();

  return storage.usedTotal + mediaSize <= storage.max;
};

const createStripeCustomer = async (userUid: string, email: string) => {
  const customer = await stripe.customers.create({
    metadata: {
      firebaseUID: userUid,
    },
    email,
  });

  await User.findOneAndUpdate(
    { externalId: userUid },
    { stripeCustomerId: customer.id }
  ).exec();

  return customer.id;
};

export const getOrCreateStripeCustomerId = async (
  userUid: string,
  email: string
) => {
  await dbConnect();

  const { stripeCustomerId } = await User.findOne(
    { externalId: userUid },
    { stripeCustomerId: 1 }
  )
    .orFail(() => new Error("User not found"))
    .exec();

  if (!stripeCustomerId) {
    return createStripeCustomer(userUid, email);
  }
  return stripeCustomerId;
};

export const updateUserQuotaFromStripe = async (
  stripeCustomerId: string,
  planId: string
) => {
  const { allowedQuota, allowedSharedLength } = await PricePlan.findOne({
    _id: planId,
  })
    .orFail(() => new Error("Plan not found"))
    .lean()
    .exec();

  return User.findOneAndUpdate(
    { stripeCustomerId: stripeCustomerId },
    {
      "storage.max": allowedQuota,
      maxSharedLength: allowedSharedLength,
    }
  ).exec();
};

const updateSubscription = async (
  stripeCustomerId: string,
  subscription: ISubscription | null
) => {
  return User.findOneAndUpdate(
    { stripeCustomerId: stripeCustomerId },
    {
      subscription: subscription,
    }
  ).exec();
};

export const handleSubscriptionChange = async (
  stripCustomerId: string,
  subscriptionId: string
) => {
  await dbConnect();

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const planId = subscription.items.data[0].price.id;

  if (subscription.status === "active") {
    await updateUserQuotaFromStripe(stripCustomerId, planId);
  } else if (subscription.status === "canceled") {
    await updateUserQuotaFromStripe(stripCustomerId, "none");

    return updateSubscription(stripCustomerId, null);
  }
  return updateSubscription(stripCustomerId, {
    id: subscription.id,
    status: subscription.status,
    created: subscription.created,
    current_period_start: subscription.current_period_start,
    current_period_end: subscription.current_period_end,
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: subscription.canceled_at,
    ended_at: subscription.ended_at,
    planId: planId,
  });
};

export const getSubscriptionPlan = async (planId: string = "none") => {
  await dbConnect();

  return PricePlan.findOne({
    _id: planId,
  })
    .orFail(() => new Error("Plan not found"))
    .lean()
    .exec();
};
