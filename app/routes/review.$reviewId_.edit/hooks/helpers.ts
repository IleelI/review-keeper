import type { ReviewForEdit } from "~/.server/data/review";
import { uncategorisedOption } from "~/routes/review/helpers/helpers";

export const getInitialData = ({
  categoryId,
  content,
  rating,
  ratingScale,
  title,
}: Exclude<ReviewForEdit, null>) => ({
  content: content,
  title: title,
  rating: rating ? String(rating) : "",
  ratingScale: ratingScale ? String(ratingScale) : "",
  categoryId: categoryId ?? uncategorisedOption.id,
});
