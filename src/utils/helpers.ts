export const displayBytesInReadableForm = (bytes: number) => {
  if (bytes === 0 || bytes < 0) {
    return "0 Bytes";
  }

  const k = 1024;
  let dm = 2 < 0 ? 0 : 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
