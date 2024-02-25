import { prisma } from "./db";

export type ReviewForGrid = Awaited<
  ReturnType<typeof getReviewsForGrid>
>[number];

export const getReviewsForGrid = async () => {
  try {
    return await prisma.review.findMany({
      select: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        category: true,
        content: true,
        id: true,
        rating: true,
        ratingScale: true,
        title: true,
      },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};
