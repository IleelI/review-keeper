import type { Review } from "~/.server/data/review";

type ReviewCardCategoryProps = Pick<Review, "category">;
const ReviewCardCategory = ({ category }: ReviewCardCategoryProps) => (
  <p className="line-clamp-1 w-max max-w-40 rounded bg-neutral-800 px-2.5 py-0.5 text-xs font-medium leading-normal tracking-wide text-neutral-200 dark:bg-neutral-200 dark:text-neutral-800">
    {category?.name ?? "Uncategorized"}
  </p>
);

export default ReviewCardCategory;
