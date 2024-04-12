import type { PromiseReturnType } from "@prisma/client/extension";
import { prisma } from "../service/db";

export type ReviewForGrid = PromiseReturnType<
  typeof getReviewsForGrid
>["items"][0];

export type ReviewFilters = Partial<{
  category: string;
  author: string;
  query: string;
}>;

export const getReviewsForGrid = async (
  page = 1,
  pageSize = 10,
  filters?: ReviewFilters,
) => {
  try {
    console.log({ filters });
    const [reviews, count] = await prisma.$transaction([
      prisma.review.findMany({
        select: {
          _count: true,
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
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.review.count(),
    ]);

    return {
      items: reviews.map(({ createdAt, updatedAt, ...review }) => ({
        ...review,
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      })),
      totalItems: count,
    };
  } catch (error) {
    console.error(error);
    return {
      items: [],
      totalItems: 0,
    };
  }
};
