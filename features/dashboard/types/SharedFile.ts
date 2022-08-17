export type SharedFile = {
  id: string;
  type: string;
  name: string;
  size: number;
};

export type SharedLink = {
  id: string;
  files: [SharedFile];
  size: number;
  uploaded: string;
};
