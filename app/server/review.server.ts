import { prisma } from "./db.server";

export const getReviewCategories = async () => {
  try {
    const categories = prisma.reviewCategory.findMany();
    return categories;
  } catch {
    return [];
  }
};
