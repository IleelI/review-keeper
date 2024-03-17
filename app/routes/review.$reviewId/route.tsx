import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "sonner";

import MainLayout from "~/components/layouts/MainLayout";

import ReviewFooter from "./components/ReviewFooter";
import ReviewHeader from "./components/ReviewHeader";
import { action } from "./server/action";
import { loader } from "./server/loader";

export { action, loader };

const ReviewPage = () => {
  const {
    isAuthor,
    review: {
      author,
      category,
      content,
      createdAt,
      rating,
      ratingScale,
      title,
      updatedAt,
    },
    reviewId,
  } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>({ key: `review-${reviewId}` });

  useEffect(() => {
    if (!fetcher.data || fetcher.state !== "idle") return;
    const { message, status } = fetcher.data;
    switch (status) {
      case "error": {
        toast.error(message);
        return;
      }
      default:
        return;
    }
  }, [fetcher.data, fetcher.state]);

  return (
    <MainLayout>
      <article className="flex flex-col gap-10 lg:gap-12">
        <ReviewHeader
          author={author}
          category={category}
          createdAt={createdAt}
          isAuthor={isAuthor}
          reviewId={reviewId}
          title={title}
          updatedAt={updatedAt}
        />

        <section
          className="tiptap"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        <hr className="w-full text-neutral-300 dark:text-neutral-700" />

        <ReviewFooter rating={rating} ratingScale={ratingScale} />
      </article>
    </MainLayout>
  );
};

export default ReviewPage;
