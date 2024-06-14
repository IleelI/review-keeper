import type { ReviewForGrid } from "~/.server/data/reviews";
import type { AppUser } from "~/.server/data/user";
import Link from "~/components/atoms/Link";
import ReviewCard from "~/routes/_index/components/ReviewCard";

interface RecentReviewsProps {
  reviews: ReviewForGrid[];
  user: AppUser;
}
const RecentReviews = ({ reviews, user }: RecentReviewsProps) => {
  return (
    <article className="flex flex-col gap-4 lg:col-start-2 lg:col-end-3">
      <header className="flex justify-between gap-4">
        <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
          Recent reviews
        </h2>
        <Link size="sm" to={`/?author=${user.username}`}>
          See all
        </Link>
      </header>
      {reviews.length ? (
        <ul className="grid auto-rows-[minmax(120px,1fr)] grid-cols-1 gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white p-6 shadow dark:bg-neutral-800">
          <h2 className="">No reviews yet</h2>
          <p className="">
            Create your first, <Link to="/review/new">here!</Link>
          </p>
        </div>
      )}
    </article>
  );
};

export { RecentReviews };
