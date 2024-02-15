import { twJoin } from "tailwind-merge";

type RatingStatus = "excellent" | "good" | "medicore" | "bad" | "terrible";

const getRatingStatus = (ratingPercentage: number): RatingStatus => {
  switch (true) {
    case ratingPercentage > 90: {
      return "excellent";
    }
    case ratingPercentage > 75: {
      return "good";
    }
    case ratingPercentage > 50: {
      return "medicore";
    }
    case ratingPercentage > 25: {
      return "bad";
    }
    default: {
      return "terrible";
    }
  }
};

interface ReviewCardRatingProps {
  rating: number;
  ratingScale: number;
}
const ReviewCardRating = ({ rating, ratingScale }: ReviewCardRatingProps) => {
  const ratingText = `${rating} out of ${ratingScale}`;
  const ratingPercentageValue = Math.round((rating / ratingScale) * 100);
  const ratingPercentage = Intl.NumberFormat("en-US", {
    style: "percent",
  }).format(rating / ratingScale);

  const ratingStatus = getRatingStatus(ratingPercentageValue);

  return (
    <p className="flex items-baseline justify-between gap-4">
      <span className="font-medium">Rating:</span>
      <span className="flex items-baseline gap-1">
        <span className="font-light text-neutral-700 dark:text-neutral-300">
          {ratingText}
        </span>
        <span
          className={twJoin([
            "text-sm text-neutral-600 dark:text-neutral-400",
            ratingStatus === "excellent" &&
              "text-green-700 dark:text-green-300",
            ratingStatus === "good" && "text-blue-700 dark:text-blue-300",
            ratingStatus === "medicore" &&
              "text-neutral-700 dark:text-neutral-300",
            ratingStatus === "bad" && "text-orange-700 dark:text-orange-300",
            ratingStatus === "terrible" && "text-red-700 dark:text-red-300",
          ])}
        >
          ({ratingPercentage})
        </span>
      </span>
    </p>
  );
};
export default ReviewCardRating;
