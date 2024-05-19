import { json, type LoaderFunctionArgs } from "@remix-run/node";

import type { ReviewCategory } from "~/.server/data/review";
import {
  getReviewAuthorFilter,
  getReviewCategoriesFilter,
  getReviewsForGrid,
} from "~/.server/data/reviews";
import {
  PAGE_SEARCH_PARAM,
  PAGE_SIZE_SEARCH_PARAM,
} from "~/components/molecules/Pagination";
import {
  reviewSortKeySchema,
  reviewSortOrderSchema,
  type ReviewSort,
} from "~/schema/review.schema";

import {
  backendFiltersSchema,
  type FiltersSchema,
} from "./schema/filters.schema";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);

  const page = Number(searchParams.get(PAGE_SEARCH_PARAM)) || 1;
  const pageSize = Number(searchParams.get(PAGE_SIZE_SEARCH_PARAM)) || 10;

  const sortKey = reviewSortKeySchema.safeParse(searchParams.get("sort-key"));
  const sortOrder = reviewSortOrderSchema.safeParse(
    searchParams.get("sort-order"),
  );
  const sort: ReviewSort = {
    key: sortKey.success ? sortKey.data : "date",
    order: sortOrder.success ? sortOrder.data : "desc",
  };

  const filtersData = backendFiltersSchema.safeParse(
    Object.fromEntries(searchParams),
  );
  const filters: FiltersSchema = {
    author: filtersData.data?.author?.length
      ? filtersData.data.author.split(";")
      : [],
    category: filtersData.data?.category?.length
      ? filtersData.data.category.split(";")
      : [],
    rating: filtersData.data?.rating,
    reactions: filtersData.data?.reactions,
  };

  const { items, totalItems } = await getReviewsForGrid(
    page,
    pageSize,
    sort,
    filters,
  );
  const reviewCategories = await getCategories();

  const reviewAuthors = await getReviewAuthorFilter();

  return json({
    items,
    reviewAuthors,
    reviewCategories,
    totalItems,
  });
};

const getCategories = async (): Promise<ReviewCategory[]> => {
  const reviewCategories = await getReviewCategoriesFilter();

  const uncategorisedOption: ReviewCategory = {
    id: "uncategorised",
    name: "Uncategorised",
  };

  return [uncategorisedOption, ...reviewCategories];
};
