import { faker } from "@faker-js/faker";
import { json, type LoaderFunctionArgs } from "@remix-run/node";

import { getReviewsForGrid } from "~/.server/data/reviews";
import { env } from "~/.server/utils/env";
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

const isDevMode = env().NODE_ENV === "development";

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

  isDevMode &&
    (await new Promise((resolve) => {
      setTimeout(() => resolve({}), faker.number.int({ min: 250, max: 2000 }));
    }));

  return json({
    items,
    totalItems,
  });
};
