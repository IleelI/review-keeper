import { useState, useMemo, type ChangeEvent } from "react";

import type { ReviewCategory } from "~/.server/data/review";

const useCategoryFilter = (
  activeCategoryFilter: string[],
  reviewCategories: ReviewCategory[],
) => {
  const [categoryQuery, setCategoryQuery] = useState("");
  const [isCategoryComboboxOpen, setIsCategoryComboboxOpen] = useState(false);

  const { filteredCategories, selectedCategories } = useMemo(() => {
    const filteredCategories = reviewCategories
      .filter(({ name }) =>
        name.toLowerCase().includes(categoryQuery.toLowerCase()),
      )
      .slice(0, 10);

    const selectedCategories = reviewCategories
      .filter(({ id }) => activeCategoryFilter.includes(id))
      .map(({ name }) => name)
      .join(", ");

    return { filteredCategories, selectedCategories };
  }, [activeCategoryFilter, categoryQuery, reviewCategories]);

  const handleCategoryChange = (authors: string[], authorId: string) =>
    authors.includes(authorId)
      ? authors.filter((id) => id !== authorId)
      : [...authors, authorId];

  const handleCategoryComboboxOpen = (open: boolean) => {
    setIsCategoryComboboxOpen(open);
    open && setCategoryQuery("");
  };

  const handleCategoryComboboxSearch = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setCategoryQuery(value);
  };

  return {
    categoryQuery,
    filteredCategories,
    handleCategoryChange,
    handleCategoryComboboxOpen,
    handleCategoryComboboxSearch,
    isCategoryComboboxOpen,
    selectedCategories,
  };
};

export { useCategoryFilter };
