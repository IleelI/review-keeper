import { invariant } from "@epic-web/invariant";
import { json, type LoaderFunctionArgs } from "@remix-run/node";

import { getReviewCategories, isUserReviewAuthor } from "~/.server/data/review";
import { getRequiredUser } from "~/.server/service/auth";

import { getReviewForEditData } from "./helpers";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.reviewId, "reviewId is required.");

  const { reviewId } = params;
  const { id: userId } = await getRequiredUser(request);

  const isAuthor = await isUserReviewAuthor(reviewId, userId);
  if (!isAuthor) {
    throw new Response("You're not authorized to access this resource", {
      status: 403,
      statusText: "Forbidden.",
    });
  }

  const [categories, review] = await Promise.all([
    getReviewCategories(),
    getReviewForEditData(reviewId),
  ]);

  return json({ categories, review });
};
