import { getFormattedDate } from "~/utils/date";

interface ReviewCardDatesProps {
  createdAt: string;
  updatedAt: string;
}
const ReviewCardDates = ({ createdAt, updatedAt }: ReviewCardDatesProps) => {
  const createdAtDate = new Date(createdAt);
  const updatedAtDate = new Date(updatedAt);
  const wasUpdated = createdAtDate.getTime() !== updatedAtDate.getTime();

  return (
    <p className="flex flex-col gap-0.5 text-xs text-neutral-600 dark:text-neutral-400">
      <span>Published: {getFormattedDate(createdAtDate)}</span>
      {wasUpdated ? (
        <span>Edited {getFormattedDate(updatedAtDate)}</span>
      ) : null}
    </p>
  );
};

export default ReviewCardDates;
