import { prisma } from "~/.server/db";

export const getReview = async (reviewId: string) => {
  try {
    return prisma.review.findFirst({
      where: {
        id: reviewId,
      },
      include: {
        author: { select: { id: true, username: true } },
        category: { select: { id: true, name: true } },
        reactions: { select: { id: true, type: true } },
        tags: { select: { id: true, name: true } },
      },
    });
  } catch {
    return null;
  }
};
