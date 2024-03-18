import MainLayout from "~/components/layouts/MainLayout";

import ReviewActions from "./components/ReviewActions";
import ReviewAuthor from "./components/ReviewAuthor";
import ReviewCategory from "./components/ReviewCategory";
import ReviewDates from "./components/ReviewDates";
import ReviewRating from "./components/ReviewRating";
import ReviewReactions from "./components/ReviewReactions";
import ReviewTitle from "./components/ReviewTitle";
import useReviewPage from "./hooks/useReviewPage";
import { action } from "./server/action";
import { loader } from "./server/loader";

export { action, loader };

const ReviewPage = () => {
  const {
    isAuthor,
    createdAtDate,
    review: { author, category, content, rating, ratingScale, title },
    reviewId,
    updatedAtDate,
  } = useReviewPage();

  return (
    <MainLayout>
      <article className="flex flex-col gap-10 lg:gap-12">
        <header className="flex flex-col gap-6">
          {createdAtDate || isAuthor ? (
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center sm:gap-4">
              {createdAtDate ? (
                <ReviewDates
                  createdAtDate={createdAtDate}
                  updatedAtDate={updatedAtDate}
                />
              ) : null}
              {isAuthor ? <ReviewActions reviewId={reviewId} /> : null}
            </section>
          ) : null}
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
          <ReviewReactions />
          <ReviewRating rating={rating} ratingScale={ratingScale} />
        </footer>
      </article>
    </MainLayout>
  );
};

export default ReviewPage;
