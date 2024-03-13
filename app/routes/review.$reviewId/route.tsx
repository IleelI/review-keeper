import { invariant } from "@epic-web/invariant";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getReview } from "~/.server/data/review";
import MainLayout from "~/components/layouts/MainLayout";
import { getFormattedDate, getValidDate } from "~/utils/date/date";

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
  const wasEdited = createdAtDate?.getTime() !== updatedAtDate?.getTime();

  return (
    <MainLayout>
      <article className="mx-auto flex flex-col gap-12 lg:max-w-screen-md">
        <header className="flex flex-col  gap-4">
          <section className="">
            {createdAtDate ? (
              <p className="text-sm font-light text-neutral-600 dark:text-neutral-400">
                Published {getFormattedDate(createdAtDate)}
              </p>
            ) : null}
            {updatedAtDate && wasEdited ? (
              <p className="text-sm font-light text-neutral-600 dark:text-neutral-400">
                Updated {getFormattedDate(updatedAtDate)}
              </p>
            ) : null}
          </section>

          <h1 className="font-serif text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {title}
          </h1>

          <section className="flex flex-col gap-4">
            <p className="text-sm">
              Author:{" "}
              <Link
                className="underline underline-offset-2"
                to={`/user/${author.id}`}
              >
                {author.username}
              </Link>
            </p>
            <p className="flex flex-col gap-2">
              <span className="text-sm">Category</span>
              <Link
                className="w-max rounded bg-primary-800 px-4 py-1 text-sm font-medium leading-normal tracking-wide text-neutral-100 dark:bg-primary-300 dark:text-neutral-900"
                to="/reviews?category=category"
              >
                {category?.name ?? "Uncategorized"}
              </Link>
            </p>
          </section>
        </header>

        <section>
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
          {rating && ratingScale ? (
            <p>
              {rating} out of {ratingScale}
            </p>
          ) : null}
        </section>

        <footer>
          <p>Reactions</p>
          {reactions.map(({ type: { id, name, _count } }) => (
            <div key={id}>
              {name}:{String(_count)}
            </div>
          ))}
        </footer>
      </article>
    </MainLayout>
  );
};

export default ReviewPage;
