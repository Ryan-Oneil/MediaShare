import { TMedia } from "../../gallery/types/TMedia";
import { SharedLink } from "./SharedFile";

export type DashboardUser = {
  externalId: string;
  storage: Storage;
  medias: [TMedia];
  sharedLinks: [SharedLink];
};

type Storage = {
  max: number;
  usedTotal: number;
  imageUsed: number;
  videoUsed: number;
  documentUsed: number;
};
