import { getReviewForEdit } from "~/.server/data/review";

export const getReviewForEditData = async (reviewId: string) => {
  const review = await getReviewForEdit(reviewId);
  if (review === null) {
    throw new Response("Review doesn't exist.", {
      status: 404,
      statusText: "Not Found.",
    });
  }
  return review;
};
