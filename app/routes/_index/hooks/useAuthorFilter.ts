import { useState, useMemo, type ChangeEvent } from "react";

import type { ReviewAuthor } from "~/.server/data/reviews";

const useAuthorFilter = (
  activeAuthorFilter: string[],
  reviewAuthors: ReviewAuthor[],
) => {
  const [authorQuery, setAuthorQuery] = useState("");
  const [isAuthorComboboxOpen, setIsAuthorComboboxOpen] = useState(false);

  const { filteredAuthors, selectedAuthors } = useMemo(() => {
    const filteredAuthors = reviewAuthors
      .filter(({ username }) =>
        username.toLowerCase().includes(authorQuery.toLowerCase()),
      )
      .slice(0, 10);

    const selectedAuthors = reviewAuthors
      .filter(({ id }) => activeAuthorFilter.includes(id))
      .map(({ username }) => username)
      .join(", ");

    return { filteredAuthors, selectedAuthors };
  }, [activeAuthorFilter, authorQuery, reviewAuthors]);

  const handleAuthorChange = (authors: string[], authorId: string) =>
    authors.includes(authorId)
      ? authors.filter((id) => id !== authorId)
      : [...authors, authorId];

  const handleAuthorComboboxOpen = (open: boolean) => {
    setIsAuthorComboboxOpen(open);
    open && setAuthorQuery("");
  };

  const handleAuthorComboboxSearch = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setAuthorQuery(value);
  };

  return {
    authorQuery,
    filteredAuthors,
    handleAuthorChange,
    handleAuthorComboboxOpen,
    handleAuthorComboboxSearch,
    isAuthorComboboxOpen,
    selectedAuthors,
  };
};

export { useAuthorFilter };
