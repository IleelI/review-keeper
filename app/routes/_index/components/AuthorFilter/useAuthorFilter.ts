import { useFetcher } from "@remix-run/react";
import lodash from "lodash";
import { useState, useMemo, type ChangeEvent, useCallback } from "react";

import { apiRoutes } from "~/routes/api/utils";

import { type loader } from "../../../api.authors/route";

const { debounce } = lodash;

const AUTHORS_FETCHER_KEY = "author-filter";
const DEBOUNCE_DELAY = 500;

const useAuthorFilter = () => {
  const authorsFetcher = useFetcher<typeof loader>({
    key: AUTHORS_FETCHER_KEY,
  });
  const [isAuthorComboboxOpen, setIsAuthorComboboxOpen] = useState(false);
  const [authorQuery, setAuthorQuery] = useState("");

  const authors = useMemo(
    () => authorsFetcher.data?.authors ?? [],
    [authorsFetcher.data],
  );

  const handleAuthorChange = (authors: string[], authorId: string) =>
    authors.includes(authorId)
      ? authors.filter((id) => id !== authorId)
      : [...authors, authorId];

  const handleAuthorComboboxOpen = (open: boolean) => {
    setIsAuthorComboboxOpen(open);
    open && setAuthorQuery("");
    open &&
      authorsFetcher.submit(
        {},
        {
          action: apiRoutes.authors,
          method: "GET",
          fetcherKey: AUTHORS_FETCHER_KEY,
          navigate: false,
        },
      );
  };

  const handleAuthorQuery = useCallback(
    (authorQuery: string) => {
      authorsFetcher.submit(
        { author: authorQuery },
        {
          action: apiRoutes.authors,
          method: "GET",
          fetcherKey: AUTHORS_FETCHER_KEY,
          navigate: false,
        },
      );
    },
    [authorsFetcher],
  );

  const handleAuthorQueryDebounced = useMemo(
    () => debounce(handleAuthorQuery, DEBOUNCE_DELAY),
    [handleAuthorQuery],
  );

  const handleAuthorComboboxSearch = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setAuthorQuery(value);
    handleAuthorQueryDebounced(value);
  };

  return {
    authors,
    authorsCount: authorsFetcher.data?.authorsCount ?? 0,
    authorQuery,
    handleAuthorChange,
    handleAuthorComboboxOpen,
    handleAuthorComboboxSearch,
    isAuthorComboboxOpen,
    isLoadingAuthors: authorsFetcher.state === "loading",
  };
};

export { useAuthorFilter };
