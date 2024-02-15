import { z } from "zod";

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
    if (!rating && !ratingScale) {
      return z.NEVER;
    }
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
    } else if (rating && !ratingScale) {
      context.addIssue({
        code: "custom",
        message: "Rating scale must be set.",
        path: ["ratingScale"],
      });
    } else if (!rating && ratingScale) {
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

export const defaultValues: ReviewSchema = {
  categoryId: "",
  content: "",
  rating: "",
  ratingScale: "",
  title: "",
};
