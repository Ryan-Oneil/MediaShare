import { IMedia } from "../../gallery/types/IMedia";
import { ISharedLink } from "@/lib/mongoose/model/SharedLink";
import { IPricePlan } from "@/lib/mongoose/model/PricePlan";

export type DashboardUser = {
  externalId: string;
  storage: Storage;
  medias: [IMedia];
  sharedLinks: [ISharedLink];
  plan: IPricePlan;
};

export type Storage = {
  max: number;
  usedTotal: number;
  imageUsed: number;
  videoUsed: number;
  documentUsed: number;
};
