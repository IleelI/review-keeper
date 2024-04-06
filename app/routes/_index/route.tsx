import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getReviewsForGrid } from "~/.server/data/reviews";
import MainLayout from "~/components/layouts/MainLayout";
import Pagination, { usePagination } from "~/components/molecules/Pagination";

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

export default function Index() {
  const { items, totalItems } = useLoaderData<typeof loader>();
  const paginationState = usePagination(totalItems);

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

        <Pagination {...paginationState}>
          <Pagination.Content>
            <Pagination.PageInput />
            <Pagination.Pages />
            <Pagination.PageSizeInput />
          </Pagination.Content>
        </Pagination>
      </article>
    </MainLayout>
  );
}
