import { twJoin } from "tailwind-merge";

import type { Review } from "~/.server/data/review";

type ReviewFooterProps = Pick<Exclude<Review, null>, "rating" | "ratingScale">;
const ReviewFooter = ({ rating, ratingScale }: ReviewFooterProps) => {
  const ratingPercentage =
    rating && ratingScale ? Math.round((rating / ratingScale) * 100) : null;

  return (
    <footer className="grid grid-cols-1 justify-between gap-4 lg:grid-cols-2">
      <section className="flex items-center justify-between gap-4 lg:flex-col">
        <p>Reactions</p>
        <div className="flex items-center gap-4 font-medium text-neutral-900 lg:text-lg dark:text-neutral-100">
          No reactions yet
        </div>
      </section>

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
    </footer>
  );
};

export default ReviewFooter;
