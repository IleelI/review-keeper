import { twJoin } from "tailwind-merge";

interface ReviewRatingProps {
  rating: number | null;
  ratingScale: number | null;
}
const ReviewRating = ({ rating, ratingScale }: ReviewRatingProps) => {
  const ratingPercentage =
    rating && ratingScale ? Math.round((rating / ratingScale) * 100) : null;

  return (
    <section className="flex items-center justify-between gap-4 lg:flex-col">
      <p>Rating</p>
      <p
        className={twJoin(
          "flex items-baseline gap-1 font-medium tracking-tight text-neutral-900 lg:text-lg dark:text-neutral-100",
        )}
      >
        {ratingPercentage ? (
          <>
            {rating} out of {ratingScale}{" "}
            <span
              className={
                ratingPercentage < 50
                  ? "text-red-700 dark:text-red-300"
                  : ratingPercentage < 75
                    ? "text-orange-600 dark:text-orange-400"
                    : ratingPercentage <= 100
                      ? "text-green-600 dark:text-green-400"
                      : ""
              }
            >
              ({ratingPercentage}%)
            </span>
          </>
        ) : (
          "This review has no rating."
        )}
      </p>
    </section>
  );
};

export default ReviewRating;
