import dbConnect from "../mongoose";
import User from "../mongoose/model/User";

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
