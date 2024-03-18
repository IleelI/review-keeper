import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "sonner";

import type { action } from "../server/action";
import type { loader } from "../server/loader";

const useReviewPage = () => {
  const { isAuthor, review } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>({ key: `review-${review.id}` });

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

  return { isAuthor, review };
};

export default useReviewPage;
