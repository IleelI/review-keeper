import { PromiseReturnType } from "@prisma/client/extension";
import { prisma } from "../db";

export const getReviewsForGrid = async () => {
  try {
    return await prisma.review.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        category: true,
        reactions: true,
        tags: true,
      },
    });
  } catch {
    return [];
  }
};
export type ReviewForGrid = PromiseReturnType<typeof getReviewsForGrid>[number];
