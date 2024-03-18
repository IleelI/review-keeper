import type { Review } from "~/.server/data/review";
import Link from "~/components/atoms/Link";

type ReviewCategoryProps = Pick<Review, "category">;
const ReviewCategory = ({ category }: ReviewCategoryProps) => {
  return (
    <Link
      className="w-max rounded bg-neutral-900 px-5 py-1.5 text-sm leading-none text-neutral-100 transition  hover:bg-neutral-700 focus-visible:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300 dark:focus-visible:bg-neutral-300"
      size="custom"
      to="/"
      variant="custom"
    >
      {category?.name ?? "Uncategorized"}
    </Link>
  );
};

export default ReviewCategory;
