import { useSearchParams } from "@remix-run/react";
import { useMemo, useCallback } from "react";

import { PAGE_SEARCH_PARAM } from "~/components/molecules/Pagination";
import {
  reviewSortKeySchema,
  type ReviewSortKey,
  reviewSortOrderSchema,
  type ReviewSortOrder,
} from "~/schema/review.schema";

const SORT_KEY_SEARCH_PARAM = "sort-key";
const SORT_ORDER_SEARCH_PARAM = "sort-order";
const SORT_OPTIONS_SEPARATOR = "&";

interface SortOption {
  name: string;
  value: string;
}

const sortKeys = {
  date: "date",
  rating: "rating",
  reactions: "reactions",
};

const sortOrders = {
  desc: "desc",
  asc: "asc",
};

export const sortOptions: SortOption[] = [
  {
    name: "Date: Newest to Oldest",
    value: `${sortKeys.date}${SORT_OPTIONS_SEPARATOR}${sortOrders.desc}`,
  },
  {
    name: "Date: Oldest to Newest",
    value: `${sortKeys.date}${SORT_OPTIONS_SEPARATOR}${sortOrders.asc}`,
  },
  {
    name: "Rating: Highest to Lowest",
    value: `${sortKeys.rating}${SORT_OPTIONS_SEPARATOR}${sortOrders.desc}`,
  },
  {
    name: "Rating: Lowest to Highest",
    value: `${sortKeys.rating}${SORT_OPTIONS_SEPARATOR}${sortOrders.asc}`,
  },
  {
    name: "Reactions: Highest to Lowest",
    value: `${sortKeys.reactions}${SORT_OPTIONS_SEPARATOR}${sortOrders.desc}`,
  },
  {
    name: "Reactions: Lowest to Highest",
    value: `${sortKeys.reactions}${SORT_OPTIONS_SEPARATOR}${sortOrders.asc}`,
  },
];

export const useSortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [sortKey, sortOrder] = useMemo(() => {
    const sortKeyParam = reviewSortKeySchema.safeParse(
      searchParams.get(SORT_KEY_SEARCH_PARAM),
    );
    const sortKey: ReviewSortKey = sortKeyParam.success
      ? sortKeyParam.data
      : "date";

    const sortOrderParam = reviewSortOrderSchema.safeParse(
      searchParams.get(SORT_ORDER_SEARCH_PARAM),
    );
    const sortOrder: ReviewSortOrder = sortOrderParam.success
      ? sortOrderParam.data
      : "desc";
    return [sortKey, sortOrder];
  }, [searchParams]);

  const sortOption = `${sortKey}${SORT_OPTIONS_SEPARATOR}${sortOrder}`;

  const handleSortOptionChange = useCallback(
    (value: string) => {
      const [key, order] = value.split(SORT_OPTIONS_SEPARATOR);
      const params = new URLSearchParams(searchParams);

      params.set(SORT_KEY_SEARCH_PARAM, key);
      params.set(SORT_ORDER_SEARCH_PARAM, order);
      params.delete(PAGE_SEARCH_PARAM);

      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  return {
    handleSortOptionChange,
    sortOption,
  };
};
