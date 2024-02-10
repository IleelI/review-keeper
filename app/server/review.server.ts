import { prisma } from "./db.server";

export type GetReviewCategoriesResponse = {
  id: string;
  name: string;
}[];

export const getReviewCategories =
  async (): Promise<GetReviewCategoriesResponse> => {
    try {
      const categories = await prisma.reviewCategory.findMany();
      return categories.map(({ id, name }) => ({ id: String(id), name }));
    } catch {
      return [];
    }
  };
