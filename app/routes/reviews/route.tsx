import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { prisma } from "~/server/db.server";

export const loader = async () => {
  const reviews = await prisma.review.findMany({
    select: {
      author: true,
      category: true,
      id: true,
      rating: true,
      ratingScale: true,
      title: true,
    },
  });
  return json({ reviews });
};

export default function Reviews() {
  const { reviews } = useLoaderData<typeof loader>();

  return (
    <div>
      <p>Reviews Page</p>
      {reviews.length ? (
        <ul className="grid grid-cols-4 gap-6">
          {reviews.map(
            ({ author, category, id, rating, ratingScale, title }) => (
              <li
                className="flex flex-col gap-1 rounded-lg border border-neutral-300 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-xl"
                style={{ aspectRatio: "4/3" }}
                key={id}
              >
                <h2>{title}</h2>
                <h3>{category?.name ?? "Uncategorized"}</h3>
                <p>By: {author.username}</p>

                {rating && ratingScale ? (
                  <p>
                    <span>{rating}</span> out of <span>{ratingScale}</span>
                  </p>
                ) : (
                  <p className="h-6"></p>
                )}

                <Link
                  className="mt-auto text-end text-lg font-medium underline underline-offset-4 transition-colors hover:text-primary-600 dark:hover:text-primary-300"
                  to={`/review/${id}`}
                >
                  Read review
                </Link>
              </li>
            ),
          )}
        </ul>
      ) : (
        <p>No reviews found</p>
      )}
    </div>
  );
}
