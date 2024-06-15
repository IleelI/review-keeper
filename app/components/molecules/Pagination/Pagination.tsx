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

import { LeftArrowIcon } from "~/assets/icons/LeftArrow.icon";
import { RightArrowIcon } from "~/assets/icons/RightArrow.icon";
import Input from "~/components/atoms/Input";

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
          "flex aspect-square w-8 items-center justify-center rounded leading-none transition duration-300",
          "enabled:hover:backdrop-brightness-95 enabled:focus-visible:backdrop-brightness-95 enabled:active:backdrop-brightness-85 dark:enabled:hover:backdrop-brightness-150 dark:enabled:focus-visible:backdrop-brightness-150 dark:enabled:active:backdrop-brightness-200",
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

interface PreviousPageProps {
  className?: string;
}
const PreviousPage = ({ className }: PreviousPageProps) => {
  const { handleGoToPreviousPage, isPreviousPageAvailable } =
    usePaginationContext();
  return (
    <button
      className={twMerge(
        "flex aspect-square w-8 items-center justify-center rounded text-sm leading-none transition duration-300",
        "enabled:hover:backdrop-brightness-95 enabled:focus-visible:backdrop-brightness-95 enabled:active:backdrop-brightness-85 dark:enabled:hover:backdrop-brightness-150 dark:enabled:focus-visible:backdrop-brightness-150 dark:enabled:active:backdrop-brightness-200",
        "disabled:opacity-40",
        className,
      )}
      disabled={!isPreviousPageAvailable}
      type="button"
      onClick={handleGoToPreviousPage}
    >
      <LeftArrowIcon />
    </button>
  );
};

interface NextPageProps {
  className?: string;
}
const NextPage = ({ className }: NextPageProps) => {
  const { handleGoToNextPage, isNextPageAvailable } = usePaginationContext();

  return (
    <button
      className={twMerge(
        "flex aspect-square w-8 items-center justify-center rounded text-sm leading-none transition duration-300",
        "enabled:hover:backdrop-brightness-95 enabled:focus-visible:backdrop-brightness-95 enabled:active:backdrop-brightness-85 dark:enabled:hover:backdrop-brightness-150 dark:enabled:focus-visible:backdrop-brightness-150 dark:enabled:active:backdrop-brightness-200",
        "disabled:opacity-40",
        className,
      )}
      disabled={!isNextPageAvailable}
      type="button"
      onClick={handleGoToNextPage}
    >
      <RightArrowIcon />
    </button>
  );
};

type PagesProps = Omit<ComponentPropsWithoutRef<"div">, "children">;
const Pages = ({ className, ...props }: PagesProps) => {
  const { pages } = usePaginationContext();

  return (
    <div
      className={twMerge(
        "flex items-center justify-between gap-1 sm:gap-2",
        className,
      )}
      {...props}
    >
      <PreviousPage />

      <ul className="flex items-center gap-1 sm:gap-2">
        {pages.map((page, index) =>
          page === null ? (
            <PageDivider key={`divider-${index}`} />
          ) : (
            <Page key={page} page={page} />
          ),
        )}
      </ul>

      <NextPage />
    </div>
  );
};

interface PageSizeInputProps {
  className?: string;
}
const PageSizeInput = ({ className }: PageSizeInputProps) => {
  const { handlePageSizeChange, pageSize } = usePaginationContext();

  const handlePageSizeInputBlur = useCallback(
    ({ target: { value } }: ReactFoucsEvent<HTMLInputElement, Element>) => {
      const parsedNumber = Number(value);
      isNaN(parsedNumber) ? null : handlePageSizeChange(parsedNumber);
    },
    [handlePageSizeChange],
  );

  return (
    <label
      className={twMerge("inline-flex items-center gap-2 text-sm", className)}
      htmlFor="pageSize"
    >
      Items per page:
      <Input
        className="aspect-square min-h-0 w-8 p-0 text-center text-sm leading-none"
        defaultValue={pageSize}
        id="pageSize"
        inputMode="numeric"
        onBlur={handlePageSizeInputBlur}
      />
    </label>
  );
};

interface PageInputProps {
  className?: string;
}
const PageInput = ({ className }: PageInputProps) => {
  const { handleGoToPage, page, totalPages } = usePaginationContext();

  const handlePageInputBlur = useCallback(
    ({ target: { value } }: ReactFoucsEvent<HTMLInputElement, Element>) => {
      const parsedNumber = Number(value);
      isNaN(parsedNumber) ? null : handleGoToPage(parsedNumber);
    },
    [handleGoToPage],
  );

  return (
    <label
      className={twMerge("inline-flex items-center gap-2 text-sm", className)}
      htmlFor="page"
    >
      Page
      <Input
        className="aspect-square min-h-0 w-8 p-0 text-center text-sm leading-none"
        defaultValue={page}
        id="page"
        inputMode="numeric"
        onBlur={handlePageInputBlur}
      />
      {`of ${totalPages || 1}`}
    </label>
  );
};

Pagination.Page = Page;
Pagination.Pages = Pages;
Pagination.PageDivider = PageDivider;
Pagination.PageInput = PageInput;
Pagination.PageSizeInput = PageSizeInput;
Pagination.PreviousPage = PreviousPage;
Pagination.NextPage = NextPage;

export default Pagination;
