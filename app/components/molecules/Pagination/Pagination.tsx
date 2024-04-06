import { NavArrowLeft, NavArrowRight } from "iconoir-react";
import {
  createContext,
  useCallback,
  useContext,
  type ComponentPropsWithoutRef,
  type PropsWithChildren,
  type ReactElement,
  type FocusEvent as ReactFoucsEvent,
} from "react";
import { twJoin, twMerge } from "tailwind-merge";

import type { usePagination } from "./usePagination";

type PaginationState = ReturnType<typeof usePagination>;

type PaginationContext = PaginationState;
const paginationContext = createContext<PaginationContext | undefined>(
  undefined,
);

type PaginationProps = PropsWithChildren<PaginationState>;
const Pagination = ({ children, ...paginationState }: PaginationProps) => (
  <paginationContext.Provider value={paginationState}>
    {children}
  </paginationContext.Provider>
);
const usePaginationContext = () => {
  const context = useContext(paginationContext);

  if (!context) {
    throw new Error("usePaginationContext must be used within its provider.");
  }
  return context;
};

type ContentProps = ComponentPropsWithoutRef<"nav">;
const Content = ({ children, className, ...props }: ContentProps) => {
  return (
    <nav className={twMerge("mx-auto flex gap-8", className)} {...props}>
      {children}
    </nav>
  );
};

interface PageProps {
  page: number;
}
const Page = ({ page }: PageProps) => {
  const { page: currentPage, handleGoToPage } = usePaginationContext();

  const isCurrentPage = page === currentPage;

  const handlePageClick = useCallback(
    () => handleGoToPage(page),
    [handleGoToPage, page],
  );

  return (
    <li>
      <button
        className={twJoin(
          "flex aspect-square w-6 items-center justify-center leading-none transition duration-300 enabled:hover:text-primary-700 dark:enabled:hover:text-primary-300",
          isCurrentPage && "font-bold text-primary-700 dark:text-primary-300",
        )}
        onClick={handlePageClick}
        type="button"
      >
        {page}
      </button>
    </li>
  );
};

interface PageDividerProps {
  divider?: ReactElement | string;
}
const PageDivider = ({ divider = "..." }: PageDividerProps) => (
  <li className="select-none">{divider}</li>
);

const PreviousPage = () => {
  const { handleGoToPreviousPage, isPreviousPageAvailable } =
    usePaginationContext();
  return (
    <button
      className="transition duration-300 enabled:hover:text-primary-700 disabled:opacity-40 dark:enabled:hover:text-primary-300"
      disabled={!isPreviousPageAvailable}
      type="button"
      onClick={handleGoToPreviousPage}
    >
      <NavArrowLeft className="h-6 w-6" strokeWidth={2} />
    </button>
  );
};

const NextPage = () => {
  const { handleGoToNextPage, isNextPageAvailable } = usePaginationContext();

  return (
    <button
      className="transition duration-300 enabled:hover:text-primary-700 disabled:opacity-40 dark:enabled:hover:text-primary-300"
      disabled={!isNextPageAvailable}
      type="button"
      onClick={handleGoToNextPage}
    >
      <NavArrowRight className="h-6 w-6" strokeWidth={2} />
    </button>
  );
};

type PagesProps = Omit<ComponentPropsWithoutRef<"ul">, "children">;
const Pages = ({ className, ...props }: PagesProps) => {
  const { pages } = usePaginationContext();

  return (
    <ul
      className={twMerge(
        "flex gap-4 rounded-lg bg-white p-4 py-3 shadow dark:bg-neutral-800",
        className,
      )}
      {...props}
    >
      <PreviousPage />

      {pages.map((page, index) =>
        page === null ? (
          <PageDivider key={`divider-${index}`} />
        ) : (
          <Page key={page} page={page} />
        ),
      )}

      <NextPage />
    </ul>
  );
};

const PageSizeInput = () => {
  const { handlePageSizeChange, pageSize } = usePaginationContext();

  const handlePageSizeInputBlur = useCallback(
    ({ target: { value } }: ReactFoucsEvent<HTMLInputElement, Element>) => {
      const parsedNumber = Number(value);
      isNaN(parsedNumber) ? null : handlePageSizeChange(parsedNumber);
    },
    [handlePageSizeChange],
  );

  return (
    <div className="flex items-center gap-2 rounded-lg bg-white p-4 py-3 font-semibold shadow dark:bg-neutral-800">
      Page size:
      <input
        className="h-6 w-8 rounded border border-neutral-300 bg-transparent text-center text-sm outline-1 dark:border-neutral-700"
        defaultValue={pageSize}
        inputMode="numeric"
        onBlur={handlePageSizeInputBlur}
      />
    </div>
  );
};

const PageInput = () => {
  const { handleGoToPage, page, totalPages } = usePaginationContext();

  const handlePageInputBlur = useCallback(
    ({ target: { value } }: ReactFoucsEvent<HTMLInputElement, Element>) => {
      const parsedNumber = Number(value);
      isNaN(parsedNumber) ? null : handleGoToPage(parsedNumber);
    },
    [handleGoToPage],
  );

  return (
    <div className="flex items-center gap-2 rounded-lg bg-white p-4 py-3 font-semibold shadow dark:bg-neutral-800">
      Page
      <input
        className="h-6 w-8 rounded border border-neutral-300 bg-transparent text-center text-sm outline-1 dark:border-neutral-700"
        defaultValue={page}
        inputMode="numeric"
        onBlur={handlePageInputBlur}
      />
      {`of ${totalPages}`}
    </div>
  );
};

Pagination.Content = Content;
Pagination.Page = Page;
Pagination.Pages = Pages;
Pagination.PageDivider = PageDivider;
Pagination.PageInput = PageInput;
Pagination.PageSizeInput = PageSizeInput;
Pagination.PreviousPage = PreviousPage;
Pagination.NextPage = NextPage;

export default Pagination;
