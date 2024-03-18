import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "sonner";

import { getValidDate } from "~/utils/date";

import type { action } from "../server/action";
import type { loader } from "../server/loader";

const useReviewPage = () => {
  const { isAuthor, review, reviewId } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>({ key: `review-${reviewId}` });

  const createdAtDate = getValidDate(review.createdAt);
  const updatedAtDate = getValidDate(review.updatedAt);

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

  return {
    isAuthor,
    createdAtDate,
    review,
    reviewId,
    updatedAtDate,
  };
};

export default useReviewPage;
