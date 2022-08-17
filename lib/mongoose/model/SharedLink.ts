import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toHexString(),
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
});

export const sharedLinkSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toHexString(),
  },
  size: {
    type: Number,
    required: true,
  },
  uploaded: {
    type: Date,
    default: Date.now,
  },
  files: [fileSchema],
});

export default mongoose.models.SharedLink ||
  mongoose.model("SharedLink", sharedLinkSchema);
