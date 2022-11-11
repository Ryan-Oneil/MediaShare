import mongoose from "mongoose";

export interface IPricePlan {
  _id: string;
  features: string[];
  name: string;
  price: string;
  disabled: boolean;
  highlight: boolean;
  allowedQuota: number;
  allowedSharedLength: number;
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
  allowedQuota: {
    type: Number,
    required: true,
  },
  allowedSharedLength: {
    type: Number,
    required: true,
  },
});

export default (mongoose.models.Plan as mongoose.Model<IPricePlan>) ||
  mongoose.model<IPricePlan>("Plan", PlanSchema);
