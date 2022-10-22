export type UploadItem = {
  src: string;
  progress: number;
  file: File;
  status: UploadStatus;
};

export type UploadedItem = {
  _id: string;
  contentType: string;
  added: Date;
  size: number;
  name: string;
  url: string;
};

export enum UploadStatus {
  UPLOADING,
  UPLOADED,
  FAILED,
  PENDING,
}
