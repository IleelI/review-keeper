import { invariant } from "@epic-web/invariant";
import { LoaderFunctionArgs, json } from "@remix-run/node";

import { getRequiredUser } from "~/.server/auth";
import { getUserReviews } from "~/.server/review";

import { getReview } from "./route.server";

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

  const review = getReview(reviewId);
  if (review === null) {
    throw new Response("Review doesn't exist.", {
      status: 404,
      statusText: "Not Found.",
    });
  }

  return json({ review: null });
};

const ReviewEditPage = () => {
  return <div>Review edit page</div>;
};

export default ReviewEditPage;
