import mongoose from "mongoose";
import { sharedLinkSchema } from "./SharedLink";

const QuotaSchema = new mongoose.Schema({
  max: {
    type: Number,
    required: [true, "Please provide the max storage quota"],
  },
  usedTotal: {
    type: Number,
    default: 0,
  },
  videoUsed: {
    type: Number,
    default: 0,
  },
  imageUsed: {
    type: Number,
    default: 0,
  },
  documentUsed: {
    type: Number,
    default: 0,
  },
});

const mediaSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toHexString(),
  },
  url: {
    type: String,
    required: true,
  },
});

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toHexString(),
  },
  externalId: {
    type: String,
    required: [true, "Please provide the externalId of the user"],
    immutable: true,
  },
  storage: QuotaSchema,
  medias: [mediaSchema],
  sharedLinks: [sharedLinkSchema],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
