export type TMedia = {
  _id: string;
  filename: string;
  contentType: string;
  added: Date;
  url: string;
  size: number;
};

export enum MediaType {
  IMAGE,
  VIDEO,
}
