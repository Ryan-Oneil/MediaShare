import { IMedia } from "../../gallery/types/IMedia";
import { ISharedLink } from "@/lib/mongoose/model/SharedLink";

export type DashboardUser = {
  externalId: string;
  storage: Storage;
  medias: [IMedia];
  sharedLinks: [ISharedLink];
};

export type Storage = {
  max: number;
  usedTotal: number;
  imageUsed: number;
  videoUsed: number;
  documentUsed: number;
};
