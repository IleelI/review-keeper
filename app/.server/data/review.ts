import { PromiseReturnType } from "@prisma/client/extension";
import { prisma } from "../db";

export interface ReviewCategory {
  id: string;
  name: string;
}
export const getReviewCategories = async (): Promise<ReviewCategory[]> => {
  try {
    const categories = await prisma.reviewCategory.findMany();
    return categories.map(({ id, name }) => ({ id: String(id), name }));
  } catch {
    return [];
  }
};

export const getReview = async (reviewId: string) => {
  try {
    return prisma.review.findFirst({
      where: { id: reviewId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        category: true,
        tags: true,
        reactions: true,
      },
    });
  } catch {
    return null;
  }
};
export type Review = PromiseReturnType<typeof getReview>;
