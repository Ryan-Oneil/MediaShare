export type TMedia = {
  id: string;
  filename: string;
  type: MediaType;
  added: Date;
  url: string;
  size: number;
};

export enum MediaType {
  IMAGE,
  VIDEO,
}
