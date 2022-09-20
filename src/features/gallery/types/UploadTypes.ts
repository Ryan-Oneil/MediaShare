export type UploadItem = {
  src: string;
  progress: number;
  file: File;
  status: UploadStatus;
};

export enum UploadStatus {
  UPLOADING,
  UPLOADED,
  FAILED,
}
