export const getValidDate = (timestamp: string | number) => {
  const date = new Date(timestamp);
  return isNaN(date.getTime()) ? null : date;
};

const LOCALE = "en-US";

export const getFormattedDateWithTime = (date: Date) =>
  Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);

export const getFormattedDate = (date: Date) =>
  Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
