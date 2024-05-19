import { useSearchParams } from "@remix-run/react";
import { useCallback, useMemo } from "react";

import {
  PAGE_SEARCH_PARAM,
  FIRST_PAGE,
  PAGE_SIZE_SEARCH_PARAM,
  PAGE_SIZE,
  getVisiblePages,
} from "./helpers";

export function usePagination(totalItems: number, visiblePages?: number) {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = Number(searchParams.get(PAGE_SEARCH_PARAM));
  const page = isNaN(pageParam) || pageParam <= 0 ? FIRST_PAGE : pageParam;

  const pageSizeParam = Number(searchParams.get(PAGE_SIZE_SEARCH_PARAM));
  const pageSize =
    isNaN(pageSizeParam) || pageSizeParam <= 0 ? PAGE_SIZE : pageSizeParam;

  const totalPages = Math.ceil(totalItems / pageSize);

  const isNextPageAvailable = page < totalPages;
  const isPreviousPageAvailable = page > 1;

  const handleGoToNextPage = useCallback(() => {
    if (!isNextPageAvailable) return;
    const params = new URLSearchParams(searchParams);
    params.set(PAGE_SEARCH_PARAM, String(page + 1));
    setSearchParams(params, { preventScrollReset: true });
  }, [isNextPageAvailable, page, searchParams, setSearchParams]);

  const handleGoToPreviousPage = useCallback(() => {
    if (!isPreviousPageAvailable) return;
    const params = new URLSearchParams(searchParams);

    if (page - 1 === FIRST_PAGE) {
      params.delete(PAGE_SEARCH_PARAM);
    } else {
      params.set(PAGE_SEARCH_PARAM, String(page - 1));
    }
    setSearchParams(params, { preventScrollReset: true });
  }, [isPreviousPageAvailable, page, searchParams, setSearchParams]);

  const handleGoToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);

      if (page === FIRST_PAGE) {
        params.delete(PAGE_SEARCH_PARAM);
      } else {
        params.set(PAGE_SEARCH_PARAM, String(page));
      }
      setSearchParams(params, { preventScrollReset: true });
    },
    [searchParams, setSearchParams],
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      if (pageSize <= 0) return;
      const params = new URLSearchParams(searchParams);
      params.set(PAGE_SIZE_SEARCH_PARAM, String(pageSize));
      params.delete(PAGE_SEARCH_PARAM);
      setSearchParams(params, { preventScrollReset: true });
    },
    [searchParams, setSearchParams],
  );

  const pages = useMemo(
    () => getVisiblePages(page, totalPages, visiblePages),
    [page, totalPages, visiblePages],
  );

  return {
    handleGoToNextPage,
    handleGoToPage,
    handleGoToPreviousPage,
    handlePageSizeChange,
    isNextPageAvailable,
    isPreviousPageAvailable,
    page,
    pages,
    pageSize,
    totalPages,
  };
}
