import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getReviewsForGrid } from "~/.server/data/reviews";
import useUser from "~/hooks/useUser/useUser";

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
  const user = useUser();

  return (
    <article className="grid place-content-center">
      {user ? (
        <h1 className="text-4xl font-extralight text-neutral-900 dark:text-neutral-100">
          Signed in as {""}
          <span className="font-medium text-primary-700 dark:text-primary-300">
            {user.username}
          </span>
        </h1>
      ) : (
        <h1 className="text-4xl font-bold">Not signed in.</h1>
      )}
      {reviews.length ? (
        <ul>
          {reviews.map(
            ({ author, category, id, rating, ratingScale, title }) => (
              <li key={id}>
                <p>{author.username}</p>
                <h2>{title}</h2>
                <p>{category?.name ?? "Uncategorized"}</p>
                {rating && ratingScale ? (
                  <p>
                    <span>{rating}</span> / <span>{ratingScale}</span>
                  </p>
                ) : null}
              </li>
            ),
          )}
        </ul>
      ) : (
        <p>{"No reviews available :("}</p>
      )}
    </article>
  );
}
