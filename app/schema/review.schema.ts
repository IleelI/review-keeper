import { z } from "zod";

export const reviewSortKeySchema = z.union([
  z.literal("date"),
  z.literal("rating"),
  z.literal("reactions"),
]);
export type ReviewSortKey = z.infer<typeof reviewSortKeySchema>;

export const reviewSortOrderSchema = z.union([
  z.literal("desc"),
  z.literal("asc"),
]);
export type ReviewSortOrder = z.infer<typeof reviewSortOrderSchema>;

export interface ReviewSort {
  key: ReviewSortKey;
  order: ReviewSortOrder;
}
