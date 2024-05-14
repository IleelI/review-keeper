import { prisma } from "../service/db";
import { Prisma, type User } from "@prisma/client";
import type { PromiseReturnType } from "@prisma/client/extension";
import type { ReviewSort } from "~/schema/review.schema";
import type { ReviewCategory } from "./review";

const reviewsForGridSelect = Prisma.validator<Prisma.ReviewSelect>()({
  _count: {
    select: {
      reactions: true,
    },
  },
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
    let reviews: ReviewsForGrid[];

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
        const extendedPrisma = prisma.$extends({
          result: {
            review: {
              ratingPercentage: {
                needs: { rating: true, ratingScale: true },
                compute: ({ rating, ratingScale }) =>
                  !rating || !ratingScale
                    ? 0
                    : Math.round((rating / ratingScale) * 100),
              },
            },
          },
        });

        const extendedReviews = await extendedPrisma.review.findMany({
          select: { ...reviewsForGridSelect, ratingPercentage: true },
        });

        reviews = extendedReviews
          .sort(({ ratingPercentage: a }, { ratingPercentage: b }) => {
            if (a === b) return 0;
            else if (a >= b) return sort.order === "asc" ? 1 : -1;
            else return sort.order === "asc" ? -1 : 1;
          })
          .slice((page - 1) * pageSize, page * pageSize)
          .map(({ ratingPercentage, ...review }) => review);

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

export const getReviewCategoriesFilter = async (): Promise<
  ReviewCategory[]
> => {
  try {
    const categories = await prisma.reviewCategory.findMany();
    return categories.map(({ id, name }) => ({
      id,
      name,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export type ReviewAuthor = Pick<User, "id" | "username">;
export const getReviewAuthorFilter = async (): Promise<ReviewAuthor[]> => {
  try {
    const authors = await prisma.user.findMany({
      where: { reviews: { some: {} } },
    });

    return [
      { id: "all-authors", username: "All authors" },
      ...authors.map(({ id, username }) => ({
        id,
        username,
      })),
    ];
  } catch (error) {
    console.error(error);
    return [];
  }
};
