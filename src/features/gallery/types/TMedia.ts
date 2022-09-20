export type TMedia = {
  _id: string;
  filename: string;
  type: string;
  added: Date;
  url: string;
  size: number;
};

export enum MediaType {
  IMAGE,
  VIDEO,
}
