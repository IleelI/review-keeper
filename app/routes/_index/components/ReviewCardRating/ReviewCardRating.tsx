import { twJoin } from "tailwind-merge";

interface ReviewRatingProps {
  rating: number;
  ratingScale: number;
}
const ReviewRating = ({ rating, ratingScale }: ReviewRatingProps) => {
  const ratingPercentage = Math.round((rating / ratingScale) * 100);
  const formattedRating = Intl.NumberFormat("en-US", {
    style: "percent",
  }).format(rating / ratingScale);

  return (
    <p className="break-all text-sm font-light text-neutral-600 dark:text-neutral-400">
      Rating:{" "}
      <span
        className={twJoin([
          "font-semibold transition duration-300",
          ratingPercentage < 40
            ? "group-hover:text-red-600 dark:group-hover:text-red-400"
            : ratingPercentage < 80
              ? "group-hover:text-orange-600 dark:group-hover:text-orange-400"
              : ratingPercentage <= 100 &&
                "group-hover:text-green-600 dark:group-hover:text-green-400",
        ])}
      >
        {formattedRating}
      </span>
    </p>
  );
};

export default ReviewRating;
