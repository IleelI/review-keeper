import { invariant } from "@epic-web/invariant";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { twJoin } from "tailwind-merge";

import { getReview } from "~/.server/data/review";
import MainLayout from "~/components/layouts/MainLayout";
import { getFormattedDate, getValidDate } from "~/utils/date";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.reviewId, "reviewId is required.");
  const { reviewId } = params;

  const review = await getReview(reviewId);
  if (!review) {
    throw new Response("Review not found!", {
      status: 404,
      statusText: "Not found.",
    });
  }

  return json({ review });
};

const ReviewPage = () => {
  const {
    review: {
      author,
      category,
      content,
      createdAt,
      rating,
      ratingScale,
      reactions,
      title,
      updatedAt,
    },
  } = useLoaderData<typeof loader>();
  const createdAtDate = getValidDate(createdAt);
  const updatedAtDate = getValidDate(updatedAt);
  const wasEdited =
    createdAtDate?.toDateString() !== updatedAtDate?.toDateString();

  const ratingPercentage =
    rating && ratingScale ? Math.round((rating / ratingScale) * 100) : null;

  return (
    <MainLayout>
      <article className="mx-auto flex w-full flex-col gap-10 lg:max-w-screen-md lg:gap-12">
        <header className="flex flex-col gap-6">
          <section>
            {createdAtDate ? (
              <p className="text-sm font-light text-neutral-600 dark:text-neutral-400">
                Published {getFormattedDate(createdAtDate)}
              </p>
            ) : null}
            {updatedAtDate && wasEdited ? (
              <p className="text-sm font-light text-neutral-600 dark:text-neutral-400">
                Edited {getFormattedDate(updatedAtDate)}
              </p>
            ) : null}
          </section>

          <h1 className="font-serif text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {title}
          </h1>

          <p className="text-sm">
            By{" "}
            <Link
              className="underline underline-offset-2 transition hover:text-primary-700 dark:hover:text-primary-300"
              to={`/user/${author.id}`}
            >
              {author.username}
            </Link>
          </p>

          <Link
            className="w-max rounded bg-neutral-900 px-5 py-1.5 text-sm leading-none text-neutral-100 transition duration-300 hover:bg-neutral-700 focus-visible:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300 dark:focus-visible:bg-neutral-300"
            to="/reviews?category=category"
          >
            {category?.name ?? "Uncategorized"}
          </Link>
        </header>

        <section
          className="tiptap"
          dangerouslySetInnerHTML={{ __html: content }}
        ></section>

        <hr className="w-full text-neutral-300 dark:text-neutral-700" />

        <footer className="grid grid-cols-1 justify-between gap-4 lg:grid-cols-2">
          <section className="flex items-center justify-between gap-1.5 lg:flex-col">
            <p className="font-medium text-neutral-800 dark:text-neutral-200">
              Reactions
            </p>
            <div className="flex items-baseline gap-1 font-light tracking-tight">
              {reactions.length ? (
                reactions.map(({ type: { id, name, _count } }) => (
                  <div key={id}>
                    {name}:{String(_count)}
                  </div>
                ))
              ) : (
                <p>No reactions yet</p>
              )}
            </div>
          </section>

          {ratingPercentage ? (
            <section className="flex items-center justify-between gap-1.5 lg:flex-col">
              <p className="font-medium text-neutral-800 dark:text-neutral-200">
                Rating
              </p>
              <p
                className={twJoin(
                  "flex items-baseline gap-1 font-light tracking-tight",
                )}
              >
                {rating} out of {ratingScale}{" "}
                <span
                  className={twJoin(
                    "font-medium",
                    ratingPercentage < 50
                      ? "text-red-700 dark:text-red-300"
                      : ratingPercentage < 75
                        ? "text-orange-600 dark:text-orange-400"
                        : ratingPercentage <= 100 &&
                          "text-green-600 dark:text-green-400",
                  )}
                >
                  ({ratingPercentage}%)
                </span>
              </p>
            </section>
          ) : null}
        </footer>
      </article>
    </MainLayout>
  );
};

export default ReviewPage;
