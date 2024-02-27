import { invariant } from "@epic-web/invariant";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getRequiredUser } from "~/.server/auth";
import { getReview } from "~/.server/data/review";
import { getUserReviews } from "~/.server/data/user";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.reviewId, "reviewId is required.");
  const { reviewId } = params;
  const { id: userId } = await getRequiredUser(request);

  const userReviews = await getUserReviews(userId);
  if (!userReviews.flatMap(({ id }) => id).includes(reviewId)) {
    throw new Response("You're not authorized to access this resource", {
      status: 403,
      statusText: "Forbidden.",
    });
  }

  const review = await getReview(reviewId);
  if (review === null) {
    throw new Response("Review doesn't exist.", {
      status: 404,
      statusText: "Not Found.",
    });
  }

  return json({ review });
};

const ReviewEditPage = () => {
  const { review } = useLoaderData<typeof loader>();
  console.log({ review });

  return <div>Review edit page</div>;
};

export default ReviewEditPage;
