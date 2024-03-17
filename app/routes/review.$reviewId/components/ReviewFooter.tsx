import { twJoin } from "tailwind-merge";

import type { Review } from "~/.server/data/review";

type ReviewFooterProps = Pick<Exclude<Review, null>, "rating" | "ratingScale">;
const ReviewFooter = ({ rating, ratingScale }: ReviewFooterProps) => {
  const ratingPercentage =
    rating && ratingScale ? Math.round((rating / ratingScale) * 100) : null;

  return (
    <footer className="grid grid-cols-1 justify-between gap-4 lg:grid-cols-2">
      <section className="flex items-center justify-between gap-6 lg:flex-col">
        <p className="font-medium text-neutral-800 dark:text-neutral-200">
          Reactions
        </p>

        <div className="flex items-center gap-4">No reactions yet</div>
      </section>

      {ratingPercentage ? (
        <section className="flex items-center justify-between gap-6 lg:flex-col">
          <p className="font-medium text-neutral-800 dark:text-neutral-200">
            Rating
          </p>
          <p className={twJoin("flex items-baseline gap-1 tracking-tight")}>
            {rating} out of {ratingScale}{" "}
            <span
              className={twJoin(
                "font-medium",
                ratingPercentage < 50
                  ? "text-red-700 dark:text-red-300"
                  : ratingPercentage < 75
                    ? "text-orange-600 dark:text-orange-400"
                    : ratingPercentage <= 100 &&
                      "text-green-600 dark:text-green-400",
              )}
            >
              ({ratingPercentage}%)
            </span>
          </p>
        </section>
      ) : null}
    </footer>
  );
};

export default ReviewFooter;
