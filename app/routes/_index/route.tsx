import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Filter, Xmark } from "iconoir-react";

import {
  getReviewCategories,
  type ReviewCategory,
} from "~/.server/data/review";
import { ReviewFilters, getReviewsForGrid } from "~/.server/data/reviews";
import Button from "~/components/atoms/Button";
import MainLayout from "~/components/layouts/MainLayout";
import Pagination, { usePagination } from "~/components/molecules/Pagination";
import Select from "~/components/molecules/Select";

import ReviewCard from "./components/ReviewCard";

export const meta: MetaFunction = () => [{ title: "Homepage | Review Keeper" }];

export const uncategorisedOption: ReviewCategory = {
  id: "uncategorised",
  name: "Uncategorised",
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page-size")) || 10;

  const category = searchParams.get("category"); // Select
  const author = searchParams.get("author"); // Dynamic combobox
  const query = searchParams.get("query"); // Dynamic combobox

  const filters: ReviewFilters = {
    author: author ?? "",
    category: category ?? "",
    query: query ?? "",
  };

  // 3) Sorting params
  // date: oldest - newest,
  // rating: highest -lowest
  // reactions: highest - lowest

  const { items, totalItems } = await getReviewsForGrid(
    page,
    pageSize,
    filters,
  );
  const reviewCategories = await getReviewCategories();

  return json({
    filters,
    items,
    reviewCategories: [uncategorisedOption, ...reviewCategories],
    totalItems,
  });
};

export default function Index() {
  const { items, totalItems } = useLoaderData<typeof loader>();
  const paginationState = usePagination(totalItems);

  return (
    <MainLayout>
      <article className="flex flex-col gap-8">
        <header className="flex flex-col gap-6">
          <section className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
              Reviews
            </h2>
            <h3 className="text-sm text-neutral-600 dark:text-neutral-400">
              Showing {paginationState.pageSize} out of {totalItems} reviews.
            </h3>
          </section>

          <nav className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-[1fr_auto]">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="font-medium">Filter by</p>

                <div className="lg:grid lg:grid-cols-[auto,1fr] lg:gap-4">
                  <Button className="lg:w-max">
                    <Filter />
                    <span>Filters (3)</span>
                  </Button>

                  <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4">
                    <div className="flex flex-col gap-2">
                      <Select>
                        <Select.Trigger className="w-full" id="sortBy">
                          <Select.Value placeholder="Sort by" />
                        </Select.Trigger>
                        <Select.Content>
                          <Select.EmptyList />
                        </Select.Content>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Select>
                        <Select.Trigger className="w-full" id="sortBy">
                          <Select.Value placeholder="Sort by" />
                        </Select.Trigger>
                        <Select.Content>
                          <Select.EmptyList />
                        </Select.Content>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Select>
                        <Select.Trigger className="w-full" id="sortBy">
                          <Select.Value placeholder="Sort by" />
                        </Select.Trigger>
                        <Select.Content>
                          <Select.EmptyList />
                        </Select.Content>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-medium">Active filters</p>
                <ul className="flex flex-wrap gap-2">
                  <li className="flex max-h-6 items-center gap-1 rounded border border-neutral-200 bg-white px-2 py-1.5 text-xs leading-none  dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-none">
                    Reactions
                    <button type="button">
                      <Xmark className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </li>
                  <li className="flex max-h-6 items-center gap-1 rounded border border-neutral-200 bg-white px-2 py-1.5 text-xs leading-none  dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-none">
                    Rating
                    <button type="button">
                      <Xmark className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </li>
                  <li className="flex max-h-6 items-center gap-1 rounded border border-neutral-200 bg-white px-2 py-1.5 text-xs leading-none  dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-none">
                    Date
                    <button type="button">
                      <Xmark className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-2 lg:w-[320px]">
              <label htmlFor="sortBy">Sort by</label>
              <Select>
                <Select.Trigger className="w-full " id="sortBy">
                  <Select.Value placeholder="Sort by" />
                </Select.Trigger>
                <Select.Content>
                  <Select.EmptyList />
                </Select.Content>
              </Select>
            </div>
          </nav>
        </header>

        <section className="" role="grid">
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
        </section>

        <Pagination {...paginationState}>
          <nav className="grid grid-cols-2 grid-rows-2 gap-4 sm:grid-cols-[auto_1fr_auto_auto] sm:grid-rows-1">
            <Pagination.PageSizeInput className="sm:col-start-1 sm:col-end-2" />
            <Pagination.PageInput className="justify-end sm:col-start-3 sm:col-end-4 " />
            <Pagination.Pages className="col-span-full row-start-1  sm:col-start-4 sm:col-end-5" />
          </nav>
        </Pagination>
      </article>
    </MainLayout>
  );
}
