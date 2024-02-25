import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getReviewsForGrid } from "~/.server/reviews";
import Link from "~/components/atoms/Link";

import ReviewCard from "./components/ReviewCard";

export const loader = async () => {
  const reviews = await getReviewsForGrid();
  return json({ reviews });
};

const ReviewsPage = () => {
  const { reviews } = useLoaderData<typeof loader>();

  return (
    <main
      className="px- 8 flex min-h-[100dvh] w-full flex-col
    gap-8 py-6 xl:mx-auto xl:max-w-screen-lg"
    >
      <header className="flex flex-col gap-2">
        <Link decoration="underline" to="/" variant="muted">
          Go back
        </Link>
        <h2 className="text-3xl font-black">Review Page</h2>
      </header>

      {reviews.length ? (
        <ul className="grid grid-cols-2 gap-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
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
