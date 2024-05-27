import { Prisma, type User } from "@prisma/client";
import type { PromiseReturnType } from "@prisma/client/extension";

import type { FiltersSchema } from "~/routes/_index/schema/filters.schema";
import type { ReviewSort } from "~/schema/review.schema";

import { prisma } from "../service/db";

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

const extendedPrisma = prisma.$extends({
  result: {
    review: {
      ratingPercentage: {
        needs: { rating: true, ratingScale: true },
        compute: ({ rating, ratingScale }) =>
          rating && ratingScale ? Math.round((rating / ratingScale) * 100) : 0,
      },
    },
  },
});
type ReviewWithPercentage = ReviewsForGrid & { ratingPercentage: number };

const getFilteredReviewsForGrid = async ({
  author,
  category,
  rating,
  reactions,
}: FiltersSchema) => {
  try {
    const authorAndCategoryFilterOptions: Prisma.ReviewWhereInput = {
      ...(author.length ? { author: { username: { in: author } } } : {}),
      ...(category.length
        ? {
            OR: [
              category.find((category) => category === "uncategorised")
                ? { category: { is: null } }
                : {},
              { category: { name: { in: category } } },
            ],
          }
        : {}),
    };

    const extendedReviews = await extendedPrisma.review.findMany({
      select: { ...reviewsForGridSelect, ratingPercentage: true },
      where: authorAndCategoryFilterOptions,
    });

    return extendedReviews.filter(
      ({ ratingPercentage, _count: { reactions: reactionsCount } }) => {
        let ratingFilter;
        switch (rating) {
          case "low": {
            ratingFilter = ratingPercentage < 40;
            break;
          }
          case "medicore": {
            ratingFilter = ratingPercentage >= 40 && ratingPercentage < 80;
            break;
          }
          case "high": {
            ratingFilter = ratingPercentage >= 80;
            break;
          }
          default: {
            ratingFilter = true;
            break;
          }
        }

        let reactionsFilter;
        switch (reactions) {
          case "unknown": {
            reactionsFilter = reactionsCount < 20;
            break;
          }
          case "known": {
            reactionsFilter = reactionsCount >= 20 || reactionsCount < 75;
            break;
          }
          case "popular": {
            reactionsFilter = reactionsCount >= 75;
            break;
          }
          default: {
            reactionsFilter = true;
            break;
          }
        }

        return ratingFilter && reactionsFilter;
      },
    );
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getSortedReviewsForGrid = async (
  reviews: ReviewWithPercentage[],
  sort: ReviewSort,
) => {
  try {
    switch (sort.key) {
      case "date":
        return reviews.sort(({ updatedAt: a }, { updatedAt: b }) => {
          if (a === b) return 0;
          else if (a >= b) return sort.order === "asc" ? 1 : -1;
          else return sort.order === "asc" ? -1 : 1;
        });
      case "rating":
        return reviews.sort(
          ({ ratingPercentage: a }, { ratingPercentage: b }) => {
            if (a === b) return 0;
            else if (a >= b) return sort.order === "asc" ? 1 : -1;
            else return sort.order === "asc" ? -1 : 1;
          },
        );
      case "reactions":
        return reviews.sort(
          ({ _count: { reactions: a } }, { _count: { reactions: b } }) => {
            if (a === b) return 0;
            else if (a >= b) return sort.order === "asc" ? 1 : -1;
            else return sort.order === "asc" ? -1 : 1;
          },
        );
      default:
        return reviews.sort(({ updatedAt: a }, { updatedAt: b }) => {
          if (a === b) return 0;
          else if (a >= b) return -1;
          else return 1;
        });
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

export type ReviewForGrid = PromiseReturnType<
  typeof getReviewsForGrid
>["items"][number];
export const getReviewsForGrid = async (
  page = 1,
  pageSize = 10,
  sort: ReviewSort,
  filters: FiltersSchema,
) => {
  try {
    const filteredReviews = await getFilteredReviewsForGrid(filters);
    const sortedReviews = await getSortedReviewsForGrid(filteredReviews, sort);
    const paginatedReviews = sortedReviews
      .slice((page - 1) * pageSize, page * pageSize)
      .map(({ ratingPercentage, ...review }) => review);

    return {
      items: paginatedReviews.map(({ createdAt, updatedAt, ...review }) => ({
        ...review,
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      })),
      totalItems: filteredReviews.length,
    };
  } catch (error) {
    console.error(error);
    return {
      items: [],
      totalItems: 0,
    };
  }
};

export const getReviewCategoriesFilter = async (categoryQuery?: string) => {
  try {
    const [categories, categoriesCount] = await prisma.$transaction([
      prisma.reviewCategory.findMany({
        take: 9,
        where: { name: { contains: categoryQuery } },
      }),
      prisma.reviewCategory.count(),
    ]);

    const mappedCategories = [
      {
        id: "uncategorised",
        name: "Uncategorised",
      },
      ...categories.map(({ id, name }) => ({
        id,
        name,
      })),
    ];

    return {
      categories: mappedCategories,
      categoriesCount: categoriesCount + 1,
    };
  } catch (error) {
    console.error(error);
    return {
      categories: [],
      categoriesCount: 0,
    };
  }
};

export const getReviewAuthorFilter = async (authorQuery?: string) => {
  try {
    const [authors, authorsCount] = await prisma.$transaction([
      prisma.user.findMany({
        take: 10,
        where: { reviews: { some: {} }, username: { contains: authorQuery } },
      }),
      prisma.user.count({ where: { reviews: { some: {} } } }),
    ]);

    const mappedAuthors = authors.map(({ id, username }) => ({ id, username }));

    return {
      authors: mappedAuthors,
      authorsCount,
    };
  } catch (error) {
    console.error(error);
    return { authors: [], authorsCount: 0 };
  }
};
