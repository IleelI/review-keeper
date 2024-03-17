import { invariant } from "@epic-web/invariant";
import { type ActionFunctionArgs, redirectDocument } from "@remix-run/node";

import { isUserReviewAuthor } from "~/.server/data/review";
import { getUser } from "~/.server/service/auth";
import { prisma } from "~/.server/service/db";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.reviewId, "reviewId is required.");
  const { reviewId } = params;
  const user = await getUser(request);

  switch (request.method.toUpperCase()) {
    case "DELETE": {
      if (!user) {
        throw new Response("You have to be signed in to edit this resource.", {
          status: 401,
          statusText: "Not Authenticated.",
        });
      }
      const isAuthor = await isUserReviewAuthor(reviewId, user.id);
      if (!isAuthor) {
        throw new Response("You are not authorized to edit this resource.", {
          status: 403,
          statusText: "Not Authorized.",
        });
      }
      try {
        await prisma.review.delete({
          where: { id: reviewId, authorId: user.id },
        });
        return redirectDocument("/");
      } catch (error) {
        console.error(error);
        return {
          status: "error" as const,
          message: "Something went wrong while deleting the review.",
        };
      }
    }
    default: {
      console.warn(`Unexpected method - ${request.method} request!`);
      return null;
    }
  }
};
