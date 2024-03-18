import Link from "~/components/atoms/Link";

interface ReviewEditHeaderProps {
  reviewId: string;
}
const ReviewEditHeader = ({ reviewId }: ReviewEditHeaderProps) => {
  return (
    <header className="flex items-baseline justify-between gap-4">
      <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
        Edit review
      </h2>
      <Link size="sm" to={`/review/${reviewId}`} variant="button">
        See review
      </Link>
    </header>
  );
};

export default ReviewEditHeader;
