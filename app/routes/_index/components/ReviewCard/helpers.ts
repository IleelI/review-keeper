export const getFormattedDate = (date: Date) =>
  Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);

export const getValidDate = (timestamp: string | number) => {
  const date = new Date(timestamp);
  return isNaN(date.getTime()) ? null : date;
};
