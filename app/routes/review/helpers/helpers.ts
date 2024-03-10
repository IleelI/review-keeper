import { z } from "zod";

import type { ReviewCategory } from "~/.server/data/review";

const ratingSchema = z
  .string()
  .optional()
  .transform((val, ctx) => {
    if (!val) return val;
    const parsedValue = Number(val);
    if (isNaN(parsedValue)) {
      ctx.addIssue({
        code: "custom",
        message: "Rating must be a number.",
      });
    } else if (parsedValue < 0) {
      ctx.addIssue({
        code: "custom",
        message: "Rating must be a positive number.",
      });
    }
    return parsedValue;
  });

const ratingScaleSchema = z
  .string()
  .optional()
  .transform((val, ctx) => {
    if (!val) return val;
    const parsedValue = Number(val);
    if (isNaN(parsedValue)) {
      ctx.addIssue({
        code: "custom",
        message: "Rating scale must be a number.",
      });
    } else if (parsedValue < 0) {
      ctx.addIssue({
        code: "custom",
        message: "Rating scale must be a positive number.",
      });
    }
    return parsedValue;
  });

export type ReviewSchema = z.infer<typeof reviewSchema>;
export const reviewSchema = z
  .object({
    categoryId: z.string().optional(),
    content: z.string().trim().min(1, "Review is required."),
    rating: ratingSchema,
    ratingScale: ratingScaleSchema,
    title: z.string().trim().min(1, "Title is required."),
  })
  .superRefine(({ rating, ratingScale }, context) => {
    if (rating && ratingScale && rating > ratingScale) {
      context.addIssue({
        code: "custom",
        message: "Rating cannot be greater than rating scale.",
        path: ["rating"],
      });
      context.addIssue({
        code: "custom",
        message: "Rating scale cannot be less than rating scale.",
        path: ["ratingScale"],
      });
    } else if (rating && !ratingScale && ratingScale !== 0) {
      context.addIssue({
        code: "custom",
        message: "Rating scale must be set.",
        path: ["ratingScale"],
      });
    } else if (!rating && ratingScale && rating !== 0) {
      context.addIssue({
        code: "custom",
        message: "Rating must be set.",
        path: ["rating"],
      });
    }
  })
  .transform(({ rating, ratingScale, ...rest }) => ({
    ...rest,
    rating: rating ? String(rating) : undefined,
    ratingScale: ratingScale ? String(ratingScale) : undefined,
  }));

export const defaultReviewValues: ReviewSchema = {
  categoryId: "",
  content: "",
  rating: "",
  ratingScale: "",
  title: "",
};

export const uncategorisedOption: ReviewCategory = {
  id: "uncategorised",
  name: "Uncategorised",
};

export type ReviewFormData = Partial<
  Pick<ReviewSchema, "categoryId" | "rating" | "ratingScale">
> &
  Pick<ReviewSchema, "content" | "title">;

export const getSubmitData = ({
  content,
  title,
  ...data
}: ReviewSchema): ReviewFormData => {
  const categoryId =
    data.categoryId && data.categoryId !== uncategorisedOption.id
      ? { categoryId: data.categoryId }
      : null;
  const rating =
    data.rating && data.ratingScale
      ? { rating: data.rating, ratingScale: data.ratingScale }
      : null;

  return {
    content,
    title,
    ...categoryId,
    ...rating,
  };
};
