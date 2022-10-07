export type SharedFile = {
  id: string;
  type: string;
  name: string;
  size: number;
};

export type SharedLink = {
  id: string;
  files: Array<SharedFile>;
  title: string;
  size: number;
  uploaded: string;
  expires: string;
};
