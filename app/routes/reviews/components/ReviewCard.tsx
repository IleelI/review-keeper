import type { ReviewForGrid } from "~/.server/data/reviews";
import Link from "~/components/atoms/Link";

import ReviewCardRating from "./ReviewCardRating";

type ReviewCardProps = ReviewForGrid;
const ReviewCard = ({
  author,
  category,
  id,
  rating,
  ratingScale,
  title,
}: ReviewCardProps) => {
  return (
    <li className="group flex flex-col gap-4 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 px-6 py-4 transition duration-300 focus-within:border-primary-700 hover:border-primary-700 dark:border-neutral-700 dark:bg-neutral-800 dark:focus-within:border-primary-300 dark:hover:border-primary-300">
      <div className="flex flex-[2] flex-col justify-between gap-2">
        <h3 className="line-clamp-2 text-xl font-medium text-neutral-950 transition-colors duration-300 group-focus-within:text-primary-700 group-hover:text-primary-700 dark:text-neutral-50 dark:group-focus-within:text-primary-300 dark:group-hover:text-primary-300">
          {title}
        </h3>

        <section>
          {author.username ? (
            <p className="flex items-baseline justify-between gap-4">
              <span className="font-medium">Author:</span>
              <span>{author.username}</span>
            </p>
          ) : null}

          {category ? (
            <p className="flex items-baseline justify-between gap-4">
              <span className="font-medium">Category:</span>
              <span>{category.name}</span>
            </p>
          ) : null}

          {rating && ratingScale ? (
            <ReviewCardRating rating={rating} ratingScale={ratingScale} />
          ) : null}
        </section>
      </div>

      <Link
        className="ml-auto text-lg outline-offset-4"
        decoration="underline"
        to={`/review/${id}`}
        variant="muted"
      >
        Read more
      </Link>
    </li>
  );
};

export default ReviewCard;
