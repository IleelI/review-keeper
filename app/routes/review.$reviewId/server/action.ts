import { invariant } from "@epic-web/invariant";
import {
  json,
  type ActionFunctionArgs,
  redirectDocument,
} from "@remix-run/node";
import { z } from "zod";

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
        throw new Response("You have to be signed in to edit this review.", {
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
        return json({
          status: "error" as const,
          message: "Something went wrong while deleting the review.",
        });
      }
    }
    case "PUT": {
      if (!user) {
        throw new Response(
          "You have to be signed in to react to this review.",
          {
            status: 401,
            statusText: "Not Authenticated.",
          },
        );
      }
      const formData = Object.fromEntries(await request.formData());
      const parsedReviewReaction = reviewReactionSchema.safeParse(formData);
      if (!parsedReviewReaction.success) {
        console.log(parsedReviewReaction.error);
        return json({
          status: "error" as const,
          message: "Something went wrong while reacting to the review.",
        });
      }
      const { id: userId } = user;
      const { reactionId: typeId, reviewId } = parsedReviewReaction.data;

      try {
        const oldReaction = await prisma.reviewReaction.findFirst({
          where: { reviewId, userId },
          select: { id: true },
        });
        if (oldReaction) {
          await prisma.reviewReaction.delete({
            where: {
              id: oldReaction.id,
            },
          });
        }
        await prisma.reviewReaction.create({
          data: {
            reviewId,
            typeId,
            userId,
          },
        });
        return null;
      } catch (error) {
        console.log(error);
        return json({
          status: "error" as const,
          message: "Something went wrong while reacting to the review.",
        });
      }
    }
    default: {
      console.warn(`Unexpected method - ${request.method} request!`);
      return null;
    }
  }
};

const reviewReactionSchema = z.object({
  reactionId: z.string().trim().min(1, "reactionId is required."),
  reviewId: z.string().trim().min(1, "reviewId is required."),
});
