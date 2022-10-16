import mongoose from "mongoose";
import { UploadedItem } from "@/features/gallery/types/UploadTypes";

export interface ISharedLink {
  _id: string;
  title: string;
  size: number;
  uploaded: Date;
  expires: Date;
  files: Array<UploadedItem>;
}

export interface IPendingFile {
  fileName: string;
  linkId: string;
  added: Date;
  size: number;
}

export const fileSchema = new mongoose.Schema<UploadedItem>({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toHexString(),
  },
  filename: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
});

export const pendingFileUploadSchema = new mongoose.Schema<IPendingFile>({
  fileName: {
    type: String,
    required: true,
  },
  linkId: {
    type: String,
    required: true,
  },
  added: {
    type: Date,
    default: Date.now,
  },
  size: {
    type: Number,
    required: true,
  },
});

export const SharedLinkSchema = new mongoose.Schema<ISharedLink>({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toHexString(),
  },
  title: {
    type: String,
    default: "Untitled",
  },
  size: {
    type: Number,
    required: true,
  },
  uploaded: {
    type: Date,
    default: Date.now,
  },
  expires: {
    type: Date,
    required: true,
  },
  files: [fileSchema],
});

export default mongoose.models.SharedLink ||
  mongoose.model("SharedLink", SharedLinkSchema);
