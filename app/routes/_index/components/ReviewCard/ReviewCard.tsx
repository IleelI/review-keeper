import { NavLink } from "@remix-run/react";

import type { ReviewForGrid } from "~/.server/data/reviews";
import { getFormattedDate, getValidDate } from "~/utils/date";

import ReviewRating from "../ReviewCardRating/ReviewCardRating";

type ReviewCardProps = ReviewForGrid;
const ReviewCard = ({
  author,
  category,
  createdAt,
  id,
  rating,
  ratingScale,
  title,
  updatedAt,
}: ReviewCardProps) => {
  const createdAtDate = getValidDate(createdAt);
  const updatedAtDate = getValidDate(updatedAt);
  const wasUpdated = createdAtDate?.getTime() !== updatedAtDate?.getTime();

  return (
    <NavLink to={`/review/${id}`}>
      <li className="group grid h-full w-full grid-cols-1 grid-rows-[1fr_auto] gap-8 rounded-lg border border-transparent bg-white p-4 shadow transition duration-300 hover:border-primary-700 dark:bg-neutral-800 dark:hover:border-primary-300">
        <header className="flex flex-col gap-2">
          <h2 className="line-clamp-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            {title}
          </h2>

          <section>
            {createdAtDate ? (
              <p className=" text-sm text-neutral-600 dark:text-neutral-400">
                Published: {getFormattedDate(createdAtDate)}
              </p>
            ) : null}
            {updatedAtDate && wasUpdated ? (
              <p className=" text-sm text-neutral-600 dark:text-neutral-400">
                Updated: {getFormattedDate(updatedAtDate)}
              </p>
            ) : null}
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              By: <span className="font-medium">{author.username}</span>
            </p>
          </section>
        </header>

        <footer className=" flex flex-wrap justify-between gap-4">
          <p className="line-clamp-1 w-max max-w-40 rounded bg-neutral-800 px-2.5 py-0.5 text-xs font-medium leading-normal tracking-wide text-neutral-200 dark:bg-neutral-200 dark:text-neutral-800">
            {category?.name ?? "Uncategorized"}
          </p>

          {rating && ratingScale ? (
            <ReviewRating rating={rating} ratingScale={ratingScale} />
          ) : null}
        </footer>
      </li>
    </NavLink>
  );
};

export default ReviewCard;
