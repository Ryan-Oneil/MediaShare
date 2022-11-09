import mongoose from "mongoose";
import {
  pendingFileUploadSchema,
  SharedLinkSchema,
} from "@/lib/mongoose/model/SharedLink";
import { Stripe } from "stripe";

export interface IPricePlan {
  _id: string;
  features: string[];
  name: string;
  price: string;
  disabled: boolean;
  highlight: boolean;
}

const PlanSchema = new mongoose.Schema<IPricePlan>({
  _id: {
    type: String,
    required: [true, "Please provide the id of the plan from stripe"],
    immutable: true,
  },
  features: {
    type: [String],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  highlight: {
    type: Boolean,
    default: false,
  },
});

export default (mongoose.models.Plan as mongoose.Model<IPricePlan>) ||
  mongoose.model<IPricePlan>("Plan", PlanSchema);
