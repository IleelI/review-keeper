import { json, type LoaderFunctionArgs } from "@remix-run/node";

import {
  getReviewCategories,
  type ReviewCategory,
} from "~/.server/data/review";
import { getReviewsForGrid } from "~/.server/data/reviews";
import {
  reviewSortKeySchema,
  reviewSortOrderSchema,
  type ReviewSort,
} from "~/schema/review.schema";

const uncategorisedOption: ReviewCategory = {
  id: "uncategorised",
  name: "Uncategorised",
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page-size")) || 10;

  const sortKey = reviewSortKeySchema.safeParse(searchParams.get("sort-key"));
  const sortOrder = reviewSortOrderSchema.safeParse(
    searchParams.get("sort-order"),
  );
  const sort: ReviewSort = {
    key: sortKey.success ? sortKey.data : "date",
    order: sortOrder.success ? sortOrder.data : "desc",
  };

  const { items, totalItems } = await getReviewsForGrid(page, pageSize, sort);
  const reviewCategories = await getReviewCategories();

  return json({
    items,
    reviewCategories: [uncategorisedOption, ...reviewCategories],
    totalItems,
  });
};
