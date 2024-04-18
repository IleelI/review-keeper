export const PAGE_SEARCH_PARAM = "page";
export const PAGE_SIZE_SEARCH_PARAM = "page-size";

export const FIRST_PAGE = 1;
export const PAGE_SIZE = 10;

export const getVisiblePages = (
  page: number,
  totalPages: number,
  visiblePages = 3,
) => {
  const pageDivider = null;

  if (totalPages < visiblePages || totalPages < 2 * visiblePages) {
    return Array(totalPages)
      .fill(null)
      .map((_, index) => index + 1);
  } else if (page < visiblePages || page > totalPages - visiblePages) {
    const firstPages = Array(visiblePages)
      .fill(null)
      .map((_, index) => index + 1);

    const lastPages = Array(visiblePages)
      .fill(null)
      .map((_, index) => totalPages + index + 1 - visiblePages);

    return [...firstPages, pageDivider, ...lastPages];
  } else {
    const offset = Math.floor(visiblePages / 2);

    const centralPages = Array(visiblePages)
      .fill(null)
      .map((_, index) => page + index - offset);
    console.log(centralPages);

    return [1, pageDivider, ...centralPages, pageDivider, totalPages];
  }
};
