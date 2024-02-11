import { prisma } from "./db.server";

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
