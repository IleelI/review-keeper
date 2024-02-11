import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import Link from "~/components/atoms/Link";
import { getReviews } from "~/server/reviews.server";

export const loader = async () => {
  const reviews = await getReviews();
  return json({ reviews });
};

const ReviewsPage = () => {
  const { reviews } = useLoaderData<typeof loader>();

  return (
    <main className="flex min-h-[100dvh] w-full flex-col gap-8 px-8 py-6 xl:mx-auto xl:max-w-screen-lg">
      <header className="flex flex-col gap-2">
        <Link decoration="underline" to="/" variant="muted">
          Go back
        </Link>
        <h2 className="text-3xl font-black">Review Page</h2>
      </header>

      {reviews.length ? (
        <ul className="grid grid-cols-2 gap-4">
          {reviews.map(
            ({ author, category, id, rating, ratingScale, title }) => (
              <li
                className="group flex flex-col gap-2 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 px-6 py-4 transition duration-300 hover:border-primary-700 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-300"
                key={id}
              >
                <h3 className="text-xl font-medium transition-colors duration-300 group-hover:text-primary-700 dark:group-hover:text-primary-300">
                  {title}
                </h3>
                <section>
                  {author.username ? (
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-medium">Author:</span>
                      <span>{author.username}</span>
                    </div>
                  ) : null}
                  {category ? (
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-medium">Category:</span>
                      <span>{category.name}</span>
                    </div>
                  ) : null}
                  {rating && ratingScale ? (
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-medium">Rating:</span>
                      <span className="flex items-baseline gap-1">
                        <span className="font-light text-neutral-700 dark:text-neutral-300">
                          {rating} out of {ratingScale}
                        </span>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          ({Math.floor(rating / ratingScale)}%)
                        </span>
                      </span>
                    </div>
                  ) : null}
                </section>
              </li>
            ),
          )}
        </ul>
      ) : (
        <section>
          <h3>No Reviews Available</h3>
          <p>Please try again later</p>
        </section>
      )}
    </main>
  );
};

export default ReviewsPage;
