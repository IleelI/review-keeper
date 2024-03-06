import { json, type MetaFunction } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";

import { getReviewsForGrid } from "~/.server/data/reviews";
import MainLayout from "~/components/layouts/MainLayout";

export const meta: MetaFunction = () => {
  return [
    { title: "Review Keeper" },
    { name: "description", content: "Welcome to Review Keeper!" },
  ];
};

export const loader = async () => {
  const reviews = await getReviewsForGrid();
  return json({ reviews });
};

export default function Index() {
  const { reviews } = useLoaderData<typeof loader>();

  return (
    <MainLayout>
      {reviews.length ? (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
          {reviews.map(
            ({ author, category, id, rating, ratingScale, title }) => (
              <NavLink key={id} to={`/review/${id}`}>
                <li className="group flex h-full w-full flex-col gap-8 rounded-xl border border-transparent bg-white p-5 shadow transition duration-300 hover:border-primary-700 dark:bg-neutral-800 dark:hover:border-primary-300">
                  <header className="flex flex-col justify-between gap-4">
                    <h2 className="line-clamp-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      {title}
                    </h2>

                    <p className="flex h-auto w-max max-w-32 items-center justify-center rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-medium leading-relaxed tracking-wide text-neutral-200 dark:bg-neutral-200 dark:text-neutral-800">
                      {category?.name ?? "Uncategorized"}
                    </p>
                  </header>

                  <footer className="mt-auto flex flex-wrap justify-between gap-1 break-all font-light text-neutral-600 dark:text-neutral-400">
                    <p>
                      By <span className="font-medium">{author.username}</span>
                    </p>

                    {rating && ratingScale ? (
                      <p>
                        Rating:{" "}
                        <span
                          className={`${getRatingStyles(Math.round((rating / ratingScale) * 100))} font-medium transition duration-300`}
                        >
                          {Math.round((rating / ratingScale) * 100)}%
                        </span>
                      </p>
                    ) : null}
                  </footer>
                </li>
              </NavLink>
            ),
          )}
        </ul>
      ) : (
        <p>{"No reviews available :("}</p>
      )}
    </MainLayout>
  );
}

const getRatingStyles = (ratingPercentage: number) => {
  switch (true) {
    case ratingPercentage <= 40:
      return "group-hover:text-red-700 dark:group-hover:text-red-300";
    case ratingPercentage <= 80:
      return "group-hover:text-orange-700 dark:group-hover:text-orange-300";
    case ratingPercentage <= 100:
      return "group-hover:text-green-700 dark:group-hover:text-green-300";
  }
};
