import { PromiseReturnType } from "@prisma/client/extension";

import { prisma } from "../service/db";

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

type RawReviewReactionQuery = {
  _count: bigint;
  name: string;
  typeId: string;
};
type RawUserReactionQuery = {
  typeId: string;
};
export const getReviewReactions = async (reviewId: string, userId?: string) => {
  try {
    const reviewReactions = await prisma.$queryRaw<RawReviewReactionQuery[]>`
    SELECT rt.name, rt.id as typeId, COUNT(rr.id) as _count FROM ReactionType as rt 
      LEFT JOIN ReviewReaction as rr
        ON rt.id = rr.typeId AND rr.reviewId = ${reviewId}
    GROUP BY rt.id
    `;

    const userReaction = (
      await prisma.$queryRaw<RawUserReactionQuery[]>`
      SELECT typeId FROM ReviewReaction
        WHERE reviewId = ${reviewId} AND userId = ${userId}
      LIMIT 1
    `
    )[0];

    return reviewReactions.map(({ _count, name, typeId }) => ({
      _count: String(_count),
      hasReacted: userReaction?.typeId === typeId,
      name,
      typeId,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};
export type ReviewReactions = PromiseReturnType<typeof getReviewReactions>;
