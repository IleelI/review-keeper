import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getReviewsForGrid } from "~/.server/data/reviews";
import MainLayout from "~/components/layouts/MainLayout";

import ReviewCard from "./components/ReviewCard";

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
        <ul className="grid auto-rows-[minmax(120px,1fr)] grid-cols-1 gap-4 md:grid-cols-2 lg:auto-rows-[minmax(200px,1fr)] lg:grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
          {reviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
        </ul>
      ) : (
        <p>{"No reviews available :("}</p>
      )}
    </MainLayout>
  );
}
