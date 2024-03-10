import { getReviewForEdit } from "~/.server/data/review";
import { getUserReviews } from "~/.server/data/user";

export const verifyReviewAuthor = async (userId: string, reviewId: string) => {
  const userReviews = await getUserReviews(userId);

  if (!userReviews.flatMap(({ id }) => id).includes(reviewId)) {
    throw new Response("You're not authorized to access this resource", {
      status: 403,
      statusText: "Forbidden.",
    });
  }
};

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
