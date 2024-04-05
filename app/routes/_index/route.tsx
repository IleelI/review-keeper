import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { NavArrowLeft, NavArrowRight } from "iconoir-react";
import { useCallback } from "react";
import { twJoin } from "tailwind-merge";

import { getReviewsForGrid } from "~/.server/data/reviews";
import MainLayout from "~/components/layouts/MainLayout";

import ReviewCard from "./components/ReviewCard";

export const meta: MetaFunction = () => [{ title: "Homepage | Review Keeper" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page-size")) || 10;

  // 2) Filtering params
  // author,
  // category,
  // rating,
  // reactions,
  // title,
  //
  // 3) Sorting params
  // date: oldest - newest,
  // rating: highest -lowest
  // reactions: highest - lowest

  const { items, totalItems } = await getReviewsForGrid(page, pageSize);
  return json({ items, totalItems });
};

const PAGE_SEARCH_PARAM = "page";
const PAGE_SIZE_SEARCH_PARAM = "page-size";

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, totalItems } = useLoaderData<typeof loader>();

  const page = Number(searchParams.get(PAGE_SEARCH_PARAM)) || 1;
  const pageSize = Number(searchParams.get(PAGE_SIZE_SEARCH_PARAM)) || 10;
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
    params.set(PAGE_SEARCH_PARAM, String(page - 1));
    setSearchParams(params, { preventScrollReset: true });
  }, [isPreviousPageAvailable, page, searchParams, setSearchParams]);

  const handleGoToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set(PAGE_SEARCH_PARAM, String(page));
      setSearchParams(params, { preventScrollReset: true });
    },
    [searchParams, setSearchParams],
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      if (pageSize <= 0 || pageSize > totalItems) return;
      const params = new URLSearchParams(searchParams);
      params.set(PAGE_SIZE_SEARCH_PARAM, String(pageSize));
      params.set(PAGE_SEARCH_PARAM, "1");
      setSearchParams(params, { preventScrollReset: true });
    },
    [searchParams, setSearchParams, totalItems],
  );

  return (
    <MainLayout>
      <article className="flex flex-col gap-8">
        <header className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
            Reviews{" "}
            <span className="text-base font-normal">({totalItems})</span>
          </h2>
          <p>Filters and sorting</p>
        </header>

        {items.length ? (
          <ul className="grid auto-rows-[minmax(120px,1fr)] grid-cols-1 gap-4 md:grid-cols-2 lg:auto-rows-[minmax(200px,1fr)] lg:grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
            {items.map((review) => (
              <ReviewCard key={review.id} {...review} />
            ))}
          </ul>
        ) : (
          <p className="text-2xl font-semibold text-neutral-600 dark:text-neutral-400">
            {"No reviews available."}
          </p>
        )}

        <nav className="grid grid-cols-[max-content_auto_max-content] justify-center gap-4">
          <div className="flex gap-4 rounded-lg bg-neutral-800 p-4 py-3">
            <div className="flex items-center gap-2 font-semibold">
              Page
              <input
                className="h-6 w-8 rounded border bg-transparent text-center text-sm outline-1 dark:border-neutral-700"
                defaultValue={page}
                inputMode="numeric"
                onBlur={({ target: { value } }) =>
                  !isNaN(Number(value)) ? handleGoToPage(Number(value)) : null
                }
              />
              {`of ${totalPages}`}
            </div>
          </div>

          <div className="flex gap-4 rounded-lg bg-neutral-800 p-4 py-3">
            <button
              className="transition duration-300 enabled:hover:text-primary-700 disabled:opacity-40 dark:enabled:hover:text-primary-300"
              disabled={!isPreviousPageAvailable}
              type="button"
              onClick={handleGoToPreviousPage}
            >
              <NavArrowLeft className="h-6 w-6" strokeWidth={2} />
            </button>

            <div className="flex gap-2">
              {Array(totalPages)
                .fill(null)
                .map((_, index) => (
                  <button
                    className={twJoin(
                      "flex aspect-square w-6 items-center justify-center font-semibold leading-none transition duration-300 enabled:hover:text-primary-700 dark:enabled:hover:text-primary-300",
                      index + 1 === page &&
                        "text-primary-700 dark:text-primary-300",
                    )}
                    key={index}
                    onClick={() => handleGoToPage(index + 1)}
                    type="button"
                  >
                    {index + 1}
                  </button>
                ))}
            </div>

            <button
              className="transition duration-300 enabled:hover:text-primary-700 disabled:opacity-40 dark:enabled:hover:text-primary-300"
              disabled={!isNextPageAvailable}
              type="button"
              onClick={handleGoToNextPage}
            >
              <NavArrowRight className="h-6 w-6" strokeWidth={2} />
            </button>
          </div>

          <div className="flex gap-4 rounded-lg bg-neutral-800 p-4 py-3">
            <div className="flex items-center gap-2 font-semibold">
              Page size:
              <input
                className="h-6 w-8 rounded border bg-transparent text-center text-sm outline-1 dark:border-neutral-700"
                defaultValue={pageSize}
                inputMode="numeric"
                onBlur={({ target: { value } }) =>
                  !isNaN(Number(value))
                    ? handlePageSizeChange(Number(value))
                    : null
                }
              />
            </div>
          </div>
        </nav>
      </article>
    </MainLayout>
  );
}
