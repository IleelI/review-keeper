import { twJoin } from "tailwind-merge";

interface ReviewRatingProps {
  rating: number | null;
  ratingScale: number | null;
}
const ReviewRating = ({ rating, ratingScale }: ReviewRatingProps) => {
  const hasRating = rating && ratingScale;
  const formattedRating = hasRating
    ? Intl.NumberFormat("en-US", {
        style: "percent",
      }).format(rating / ratingScale)
    : null;

  return (
    <p className="break-all text-sm font-light text-neutral-600 dark:text-neutral-400">
      Rating:{" "}
      <span
        className={twJoin(
          "font-semibold transition",
          hasRating && getRatingStyles(rating, ratingScale),
        )}
      >
        {formattedRating ?? "None"}
      </span>
    </p>
  );
};

const getRatingStyles = (rating: number, ratingScale: number) => {
  const ratingPercentage = Math.round((rating / ratingScale) * 100);

  switch (true) {
    case ratingPercentage < 40:
      return "group-hover:text-red-600 dark:group-hover:text-red-400";
    case ratingPercentage < 80:
      return "group-hover:text-blue-600 dark:group-hover:text-blue-400";
    case ratingPercentage <= 100:
      return "group-hover:text-green-600 dark:group-hover:text-green-400";
    default:
      return "group-hover:text-neutral-600 dark:group-hover:text-neutral-400";
  }
};

export default ReviewRating;
