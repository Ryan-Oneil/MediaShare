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

export const formatDateToUTC = (date: Date) => {
  return `${date.getUTCFullYear()}-${
    date.getUTCMonth() + 1
  }-${date.getUTCDate()}`;
};

export const getDaysTillDate = (date: Date) => {
  const today = new Date();
  const diff = date.getTime() - today.getTime();
  const days = diff / (1000 * 3600 * 24);

  if (days < 1) {
    return `${getHoursTillDate(date)} hours`;
  }

  return `${Math.ceil(days)} days`;
};

export const getHoursTillDate = (date: Date) => {
  const today = new Date();
  const diff = date.getTime() - today.getTime();
  const hours = Math.ceil(diff / (1000 * 3600));

  if (hours <= 1) {
    return "Soon";
  }

  return Math.ceil(diff / (1000 * 3600));
};
