import { invariant } from "@epic-web/invariant";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";

import { prisma } from "~/server/db.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.reviewId, "reviewId is required");
  const reviewId = Number(params.reviewId);
  if (typeof reviewId !== "number") {
    throw new Error("reviewId must be a number");
  }

  const review = await prisma.review.findFirst({
    where: {
      id: reviewId,
    },
  });
  if (!review) {
    throw new Error("Review not found!");
  }

  return json({ review });
};

export default function Review() {
  const { review } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <p>Review Page</p>
        <button
          className="-mx-2 -my-1 w-fit px-2 py-1 underline underline-offset-4 transition-colors hover:text-primary-600 dark:hover:text-primary-300"
          onClick={() => navigate(-1)}
          role="link"
        >
          Go back
        </button>
      </div>

      <article className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Title: {review.title}
        </h2>

        <div className="flex flex-col gap-2">
          <p>Review</p>
          {isMounted ? (
            <p dangerouslySetInnerHTML={{ __html: review.content }}></p>
          ) : null}
        </div>
      </article>
    </div>
  );
}
