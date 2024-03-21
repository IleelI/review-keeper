import { PromiseReturnType } from "@prisma/client/extension";

import { prisma } from "../service/db";
import { getSchemaTypeNameByName } from "@tiptap/react";

export interface ReviewCategory {
  id: string;
  name: string;
}
export const getReviewCategories = async (): Promise<ReviewCategory[]> => {
  try {
    const categories = await prisma.reviewCategory.findMany();
    return categories.map(({ id, name }) => ({ id, name }));
  } catch {
    return [];
  }
};

export const getReviewForEdit = async (reviewId: string) => {
  try {
    return await prisma.review.findFirstOrThrow({
      where: { id: reviewId },
      select: {
        categoryId: true,
        content: true,
        id: true,
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

export const getReview = async (reviewId: string) => {
  try {
    const review = await prisma.review.findFirstOrThrow({
      where: {
        id: reviewId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        category: {
          select: {
            name: true,
            id: true,
          },
        },
        reactions: false,
      },
    });
    return {
      ...review,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
export type Review = Exclude<PromiseReturnType<typeof getReview>, null>;

export const isUserReviewAuthor = async (reviewId: string, userId: string) => {
  try {
    return Boolean(
      await prisma.review.findFirst({
        where: {
          id: reviewId,
          authorId: userId,
        },
      }),
    );
  } catch (error) {
    return false;
  }
};

export const getReviewReactionsWithUser = async (
  reviewId: string,
  userId: string,
) => {
  try {
    // get all "unique" review reactions and count them
    // check for user reaction
    const reactionsCount = await prisma.reviewReaction.groupBy({
      by: ["typeId"],
      _count: true,
      where: { reviewId },
    });
    const reactionTypes = await prisma.reactionType.findMany();
    const reactions = reactionTypes.map(({ id, name }) => ({
      count: reactionsCount.find(({ typeId }) => typeId === id)?._count ?? 0,
      id,
      name,
    }));

    return reactions;
  } catch (error) {
    console.error(error);
  }
};
