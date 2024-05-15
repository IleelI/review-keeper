import { type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import MainLayout from "~/components/layouts/MainLayout";
import Pagination, { usePagination } from "~/components/molecules/Pagination";

import { action } from "./action";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import ReviewCard from "./components/ReviewCard";
import { loader } from "./loader";

export const meta: MetaFunction = () => [{ title: "Homepage | Review Keeper" }];

export { loader };
export { action };

export default function Index() {
  const { items, totalItems } = useLoaderData<typeof loader>();
  const paginationState = usePagination(totalItems);

  return (
    <MainLayout>
      <article className="flex flex-col gap-8">
        <header className="flex flex-col gap-4">
          <Header pageSize={paginationState.pageSize} totalItems={totalItems} />
          <Navigation />
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
