import type { PromiseReturnType } from "@prisma/client/extension";
import { prisma } from "../service/db";

export type ReviewForGrid = PromiseReturnType<typeof getReviewsForGrid>[number];
export const getReviewsForGrid = async () => {
  try {
    const reviews = await prisma.review.findMany({
      select: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        id: true,
        rating: true,
        ratingScale: true,
        title: true,
        updatedAt: true,
      },
    });
    return reviews.map(({ createdAt, updatedAt, ...review }) => ({
      ...review,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};
