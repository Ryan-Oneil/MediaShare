import { IMedia } from "../../gallery/types/IMedia";
import { SharedLink } from "./SharedFile";

export type DashboardUser = {
  externalId: string;
  storage: Storage;
  medias: [IMedia];
  sharedLinks: [SharedLink];
};

export type Storage = {
  max: number;
  usedTotal: number;
  imageUsed: number;
  videoUsed: number;
  documentUsed: number;
};
