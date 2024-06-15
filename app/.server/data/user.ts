import { User } from "@prisma/client";

import { prisma } from "../service/db";
import { extendedPrismaWithReviewPercentage } from "./reviews";

export type AppUser = Pick<User, "email" | "id" | "username"> & {
  createdAt: string;
};

export const getUserById = async (userId: string): Promise<AppUser | null> => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: { email: true, id: true, username: true, createdAt: true },
    });
    if (!user) return null;
    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
    };
  } catch {
    return null;
  }
};

export type UserStatistics = Awaited<ReturnType<typeof getUserStatistics>>;
export const getUserStatistics = async (userId: string) => {
  try {
    const [reviews, reviewTotalCount] = await prisma.$transaction([
      extendedPrismaWithReviewPercentage.review.findMany({
        where: {
          authorId: userId,
        },
        include: { _count: { select: { reactions: true } } },
      }),
      extendedPrismaWithReviewPercentage.review.count({
        where: { authorId: userId },
      }),
    ]);

    const ratingAverage =
      reviewTotalCount > 0
        ? Math.round(
            reviews.reduce((prev, curr) => prev + curr.ratingPercentage, 0) /
              reviewTotalCount,
          )
        : null;
    const reactionsAverage =
      reviewTotalCount > 0
        ? Math.round(
            reviews.reduce((prev, curr) => prev + curr._count.reactions, 0) /
              reviewTotalCount,
          )
        : null;

    return {
      ratingAverage,
      reactionsAverage,
      reviewTotalCount,
    };
  } catch (error) {
    console.error(error);
    return {
      ratingAverage: 0,
      reactionsAverage: 0,
      reviewTotalCount: 0,
    };
  }
};
