import { prisma } from "./db.server";

export type Reviews = Awaited<ReturnType<typeof getReviews>>;

export const getReviews = async () => {
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
