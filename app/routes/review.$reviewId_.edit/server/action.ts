import { invariant } from "@epic-web/invariant";
import { json, type ActionFunctionArgs } from "@remix-run/node";

import { isUserReviewAuthor } from "~/.server/data/review";
import { getRequiredUser } from "~/.server/service/auth";
import { prisma } from "~/.server/service/db";
import { reviewServerSchema } from "~/routes/review/helpers/helpers.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
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

  const parseResult = await reviewServerSchema.safeParseAsync(
    Object.fromEntries(await request.formData()),
  );
  if (!parseResult.success) {
    return json({
      message: "Incorrect data sent, please try again.",
      status: "error" as const,
    });
  }
  const review = parseResult.data;

  try {
    await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        ...review,
      },
    });
    return json({
      message: "Review updated successfully!",
      status: "success" as const,
    });
  } catch {
    return json({
      message: "Something went wronge while updating review, please try again.",
      status: "error" as const,
    });
  }
};
