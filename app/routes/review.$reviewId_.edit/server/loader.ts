import { invariant } from "@epic-web/invariant";
import { json, type LoaderFunctionArgs } from "@remix-run/node";

import { getReviewCategories } from "~/.server/data/review";
import { getRequiredUser } from "~/.server/service/auth";

import { verifyReviewAuthor, getReviewForEditData } from "./helpers";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.reviewId, "reviewId is required.");

  const { reviewId } = params;
  const { id: userId } = await getRequiredUser(request);

  await verifyReviewAuthor(userId, reviewId);
  const [categories, review] = await Promise.all([
    getReviewCategories(),
    getReviewForEditData(reviewId),
  ]);

  return json({ categories, review });
};
