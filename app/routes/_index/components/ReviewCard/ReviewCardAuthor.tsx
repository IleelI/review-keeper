import type { Review } from "~/.server/data/review";

type ReviewCardAuthorProps = Pick<Review, "author">;
const ReviewCardAuthor = ({ author: { username } }: ReviewCardAuthorProps) => (
  <p className="text-sm text-neutral-600 dark:text-neutral-400">
    By: <span className="font-medium">{username}</span>
  </p>
);

export default ReviewCardAuthor;
