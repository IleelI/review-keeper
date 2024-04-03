import { NavLink } from "@remix-run/react";

import type { ReviewForGrid } from "~/.server/data/reviews";

import ReviewCardAuthor from "./ReviewCardAuthor";
import ReviewCardCategory from "./ReviewCardCategory";
import ReviewCardDates from "./ReviewCardDates";
import ReviewRating from "./ReviewCardRating";
import ReviewCardTitle from "./ReviewCardTitle";
import ReviewReactionCount from "./ReviewReactionCount";

type ReviewCardProps = ReviewForGrid;
const ReviewCard = ({
  author,
  category,
  createdAt,
  id,
  rating,
  ratingScale,
  reactionCount,
  title,
  updatedAt,
}: ReviewCardProps) => {
  return (
    <NavLink to={`/review/${id}`}>
      <li className="group grid h-full w-full grid-cols-1 grid-rows-[1fr_auto] gap-8 rounded-lg border border-transparent bg-white p-4 shadow transition  hover:border-primary-700 dark:bg-neutral-800 dark:hover:border-primary-300">
        <header className="flex flex-col gap-1">
          <ReviewCardTitle title={title} />
          <ReviewCardDates createdAt={createdAt} updatedAt={updatedAt} />
          <ReviewCardAuthor author={author} />
          <ReviewReactionCount reactionCount={reactionCount} />
        </header>

        <footer className=" flex flex-wrap justify-between gap-4">
          <ReviewCardCategory category={category} />
          {rating && ratingScale ? (
            <ReviewRating rating={rating} ratingScale={ratingScale} />
          ) : null}
        </footer>
      </li>
    </NavLink>
  );
};

export default ReviewCard;
