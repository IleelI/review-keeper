import type {
  ReviewReactions as ReviewReactionsType,
  Review as ReviewType,
} from "~/.server/data/review";
import type { AppUser } from "~/.server/data/user";

import ReviewActions from "./ReviewActions";
import ReviewAuthor from "./ReviewAuthor";
import ReviewCategory from "./ReviewCategory";
import ReviewDates from "./ReviewDates";
import ReviewRating from "./ReviewRating";
import ReviewReactions from "./ReviewReactions";
import ReviewTitle from "./ReviewTitle";

interface ReviewPros {
  isAuthor: boolean;
  reactions: ReviewReactionsType;
  review: ReviewType;
  user: AppUser | null;
}
const Review = ({ isAuthor, reactions, review, user }: ReviewPros) => {
  const { author, category, content, rating, ratingScale, title } = review;
  const createdAtDate = new Date(review.createdAt);
  const updatedAtDate = new Date(review.updatedAt);

  return (
    <article className="flex flex-col gap-10 lg:gap-12">
      <header className="flex flex-col gap-6">
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center sm:gap-4">
          <ReviewDates
            createdAtDate={createdAtDate}
            updatedAtDate={updatedAtDate}
          />
          {isAuthor ? <ReviewActions reviewId={review.id} /> : null}
        </section>

        <ReviewTitle title={title} />
        <ReviewAuthor author={author} />
        <ReviewCategory category={category} />
      </header>

      <section
        className="tiptap"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <hr className="w-full text-neutral-300 dark:text-neutral-700" />

      <footer className="grid grid-cols-1 justify-between gap-4 lg:grid-cols-2">
        <ReviewReactions
          reactions={reactions}
          reviewId={review.id}
          user={user}
        />
        <ReviewRating rating={rating} ratingScale={ratingScale} />
      </footer>
    </article>
  );
};

export default Review;
