import { invariant } from "@epic-web/invariant";
import { type LoaderFunctionArgs, json } from "@remix-run/node";

import { getReview, isUserReviewAuthor } from "~/.server/data/review";
import { getUser } from "~/.server/service/auth";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.reviewId, "reviewId is required.");
  const user = await getUser(request);
  const { reviewId } = params;

  const review = await getReview(reviewId);
  if (!review) {
    throw new Response("Review not found!", {
      status: 404,
      statusText: "Not found.",
    });
  }
  const isAuthor = !!user && (await isUserReviewAuthor(reviewId, user.id));

  return json({ isAuthor, review, user });
};
