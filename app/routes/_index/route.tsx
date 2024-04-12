import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import {
  getReviewCategories,
  type ReviewCategory,
} from "~/.server/data/review";
import { ReviewFilters, getReviewsForGrid } from "~/.server/data/reviews";
import MainLayout from "~/components/layouts/MainLayout";
import Pagination, { usePagination } from "~/components/molecules/Pagination";

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
