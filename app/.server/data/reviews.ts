import { prisma } from "../service/db";

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
  } catch (error) {
    console.error(error);
    return [];
  }
};
