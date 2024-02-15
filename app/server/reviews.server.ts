import { prisma } from "./db.server";

export type ReviewForGrid = Awaited<
  ReturnType<typeof getReviewsForGrid>
>[number];

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
        category: true,
        content: true,
        id: true,
        rating: true,
        ratingScale: true,
        title: true,
      },
    });
    return reviews;
  } catch {
    return [];
  }
};
