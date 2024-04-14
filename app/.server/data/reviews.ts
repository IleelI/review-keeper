import { prisma } from "../service/db";
import { Prisma } from "@prisma/client";
import type { PromiseReturnType } from "@prisma/client/extension";
import type { ReviewSort } from "~/schema/review.schema";

export type ReviewFilters = Partial<{
  category: string;
  author: string;
  query: string;
}>;

const reviewsForGridSelect = Prisma.validator<Prisma.ReviewSelect>()({
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
});
type ReviewsForGrid = Prisma.ReviewGetPayload<{
  select: typeof reviewsForGridSelect;
}>;

export const getReviewsForGrid = async (
  page = 1,
  pageSize = 10,
  sort: ReviewSort,
) => {
  try {
    let reviews: ReviewsForGrid[] = [];

    console.log(sort);

    switch (sort.key) {
      case "date": {
        reviews = await prisma.review.findMany({
          select: reviewsForGridSelect,
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: {
            updatedAt: sort.order,
          },
        });
        break;
      }
      case "rating": {
        reviews = await prisma.review.findMany({
          select: reviewsForGridSelect,
          skip: (page - 1) * pageSize,
          take: pageSize,
        });
        break;
      }
      case "reactions": {
        reviews = await prisma.review.findMany({
          select: reviewsForGridSelect,
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: {
            reactions: {
              _count: sort.order,
            },
          },
        });
        break;
      }
      default: {
        reviews = await prisma.review.findMany({
          select: reviewsForGridSelect,
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: {
            updatedAt: "desc",
          },
        });
        break;
      }
    }

    const totalItems = await prisma.review.count();

    return {
      items: reviews.map(({ createdAt, updatedAt, ...review }) => ({
        ...review,
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      })),
      totalItems,
    };
  } catch (error) {
    console.error(error);
    return {
      items: [],
      totalItems: 0,
    };
  }
};

export type ReviewForGrid = PromiseReturnType<
  typeof getReviewsForGrid
>["items"][number];
