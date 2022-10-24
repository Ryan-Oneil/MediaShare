import mongoose from "mongoose";
import {
  IPendingFile,
  ISharedLink,
  pendingFileUploadSchema,
  SharedLinkSchema,
} from "./SharedLink";
import { UploadedItem } from "@/features/gallery/types/UploadTypes";

interface IQuota {
  max: number;
  usedTotal: number;
  videoUsed: number;
  imageUsed: number;
  documentUsed: number;
}

interface IUser {
  _id: string;
  externalId: string;
  storage: IQuota;
  medias: Array<UploadedItem>;
  sharedLinks: Array<ISharedLink>;
  pendingFileUploads: Array<IPendingFile>;
  maxSharedLength: number;
}

const QuotaSchema = new mongoose.Schema<IQuota>(
  {
    max: {
      type: Number,
      min: 0,
      // 2GB in bytes
      default: 2147483648,
    },
    usedTotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    videoUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    imageUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    documentUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const mediaSchema = new mongoose.Schema<UploadedItem>({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toHexString(),
  },
  url: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  added: {
    type: Date,
    required: true,
  },
});

const UserSchema = new mongoose.Schema<IUser>({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toHexString(),
  },
  externalId: {
    type: String,
    required: [true, "Please provide the externalId of the user"],
    immutable: true,
  },
  storage: {
    type: QuotaSchema,
    default: () => ({}),
  },
  medias: {
    type: [mediaSchema],
    default: () => [],
  },
  sharedLinks: {
    type: [SharedLinkSchema],
    default: () => [],
  },
  pendingFileUploads: {
    type: [pendingFileUploadSchema],
    default: () => [],
  },
  maxSharedLength: {
    type: Number,
    default: 7,
  },
});

export default (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
