import type { ReviewForGrid } from "~/.server/data/reviews";

type ReviewReactionCountProps = Pick<ReviewForGrid, "reactionCount">;
const ReviewReactionCount = ({ reactionCount }: ReviewReactionCountProps) => (
  <p className="text-sm text-neutral-600 dark:text-neutral-400">
    Reactions: <span className="font-medium">{reactionCount}</span>
  </p>
);

export default ReviewReactionCount;
