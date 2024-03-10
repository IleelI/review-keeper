import { z } from "zod";

export type ReviewServerSchema = z.infer<typeof reviewServerSchema>;

export const reviewServerSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required."),
    content: z.string().trim().min(1, "Content is required."),
    rating: z.string().optional(),
    ratingScale: z.string().optional(),
    categoryId: z.string().optional(),
  })
  .transform(({ rating, ratingScale, ...values }, ctx) => {
    let hasErrors = false;
    if (rating !== undefined && isNaN(Number(rating))) {
      ctx.addIssue({ code: "custom", message: "Rating must be a number." });
      hasErrors = true;
    }
    if (ratingScale !== undefined && isNaN(Number(ratingScale))) {
      ctx.addIssue({
        code: "custom",
        message: "Rating scale must be a number.",
      });
      hasErrors = true;
    }

    if (hasErrors) return z.NEVER;
    return {
      ...values,
      rating: rating ? Number(rating) : undefined,
      ratingScale: ratingScale ? Number(ratingScale) : undefined,
    };
  })
  .superRefine(({ rating, ratingScale }, ctx) => {
    if (!rating && !ratingScale) {
      return z.NEVER;
    }
    if ((rating && !ratingScale) || (!rating && ratingScale)) {
      ctx.addIssue({
        code: "custom",
        message:
          "Rating/rating scale must be set along with rating scale/rating.",
      });
    } else if (rating && ratingScale && rating > ratingScale) {
      ctx.addIssue({
        code: "custom",
        message: "Rating cannot be greater than rating scale.",
      });
    }
  });
