import { PromiseReturnType } from "@prisma/client/extension";

import { prisma } from "../service/db";
import { getSchemaTypeNameByName } from "@tiptap/react";
import { Prisma, type ReactionType } from "@prisma/client";

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

type RawReviewReactions = {
  _count: bigint;
  hasReacted: number;
  id: string;
  name: string;
}[];
export const getReviewReactions = async (reviewId: string, userId?: string) => {
  try {
    const rawReviewReaction =
      await prisma.$queryRaw<RawReviewReactions>(Prisma.sql`
    SELECT t.id, t.name, CASE r.userId WHEN ${userId} THEN true ELSE false END AS hasReacted, COUNT(r.id) as _count FROM ReactionType as t 
      LEFT JOIN ReviewReaction as r
        ON t.id = r.typeId AND r.reviewId = ${reviewId}
    GROUP BY t.id
    `);
    return rawReviewReaction.map(({ _count, hasReacted, ...rest }) => ({
      _count: String(_count),
      hasReacted: Boolean(hasReacted),
      ...rest,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};
export type ReviewReactions = PromiseReturnType<typeof getReviewReactions>;
