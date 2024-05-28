import { useFetcher } from "@remix-run/react";
import lodash from "lodash";
import { useState, useMemo, type ChangeEvent, useCallback } from "react";

import { apiRoutes } from "~/routes/api/utils";

import type { loader } from "../../../api.review-categories/route";

const { debounce } = lodash;
const CATEGORY_FETCHER_KEY = "category-filter";
const DEBOUNCE_DELAY = 500;

const useCategoryFilter = () => {
  const categoryFetcher = useFetcher<typeof loader>({
    key: CATEGORY_FETCHER_KEY,
  });
  const [isCategoryComboboxOpen, setIsCategoryComboboxOpen] = useState(false);
  const [categoryQuery, setCategoryQuery] = useState("");

  const categories = useMemo(
    () => categoryFetcher.data?.categories ?? [],
    [categoryFetcher.data?.categories],
  );

  const handleCategoryChange = (authors: string[], authorId: string) =>
    authors.includes(authorId)
      ? authors.filter((id) => id !== authorId)
      : [...authors, authorId];

  const handleCategoryComboboxOpen = (open: boolean) => {
    setIsCategoryComboboxOpen(open);
    open && setCategoryQuery("");
    open &&
      categoryFetcher.submit(
        {},
        {
          action: apiRoutes.reviewCategories,
          fetcherKey: CATEGORY_FETCHER_KEY,
          method: "GET",
          navigate: false,
        },
      );
  };

  const handleCategoryQuery = useCallback(
    (categoryQuery: string) => {
      categoryFetcher.submit(
        { category: categoryQuery },
        {
          action: apiRoutes.reviewCategories,
          fetcherKey: CATEGORY_FETCHER_KEY,
          method: "GET",
          navigate: false,
        },
      );
    },
    [categoryFetcher],
  );
  const handleCategoryQueryDebounced = useMemo(
    () => debounce(handleCategoryQuery, DEBOUNCE_DELAY),
    [handleCategoryQuery],
  );

  const handleCategoryComboboxSearch = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setCategoryQuery(value);
    handleCategoryQueryDebounced(value);
  };

  return {
    categories,
    categoriesCount: categoryFetcher.data?.categoriesCount ?? 0,
    categoryQuery,
    handleCategoryChange,
    handleCategoryComboboxOpen,
    handleCategoryComboboxSearch,
    isCategoryComboboxOpen,
    isLoadingCategories: categoryFetcher.state === "loading",
  };
};

export { useCategoryFilter };
