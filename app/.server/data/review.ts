import { PromiseReturnType } from "@prisma/client/extension";

import { prisma } from "../service/db";

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
    const review = await prisma.review.findFirst({
      where: { id: reviewId },
      include: {
        author: {
          select: {
            username: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!review) return null;

    return {
      ...review,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.createdAt.toISOString(),
    };
  } catch {
    return null;
  }
};
export type Review = PromiseReturnType<typeof getReview>;

export const getReviewForEdit = async (reviewId: string) => {
  try {
    return await prisma.review.findFirst({
      where: { id: reviewId },
      select: {
        categoryId: true,
        content: true,
        rating: true,
        ratingScale: true,
        title: true,
      },
    });
  } catch {
    return null;
  }
};
export type ReviewForEdit = PromiseReturnType<typeof getReviewForEdit>;
