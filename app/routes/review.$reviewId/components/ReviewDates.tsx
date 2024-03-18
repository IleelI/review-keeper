import { getFormattedDate } from "~/utils/date";

interface ReviewDatesProps {
  createdAtDate: Date;
  updatedAtDate: Date | null;
}
const ReviewDates = ({ createdAtDate, updatedAtDate }: ReviewDatesProps) => {
  const wasEdited = createdAtDate.getTime() !== updatedAtDate?.getTime();

  return (
    <p className="flex flex-col gap-0.5 text-sm font-light text-neutral-600 dark:text-neutral-400">
      Published {getFormattedDate(createdAtDate)}
      {updatedAtDate && wasEdited ? (
        <span className="text-xs">
          (Edited {getFormattedDate(updatedAtDate)})
        </span>
      ) : null}
    </p>
  );
};

export default ReviewDates;
