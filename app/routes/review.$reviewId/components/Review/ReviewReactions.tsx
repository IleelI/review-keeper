import { Form } from "@remix-run/react";
import {
  EmojiSad,
  EmojiTalkingAngry,
  Heart,
  ThumbsDown,
  ThumbsUp,
} from "iconoir-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { twJoin } from "tailwind-merge";

import type { ReviewReactions as ReviewReactionsType } from "~/.server/data/review";
import type { AppUser } from "~/.server/data/user";

interface ReviewReactionsProps {
  reactions: ReviewReactionsType;
  reviewId: string;
  user: AppUser | null;
}

const ReviewReactions = ({
  reactions,
  reviewId,
  user,
}: ReviewReactionsProps) => {
  const isUser = !!user;

  const handleReactionClick = useCallback(
    (name: string) => toast(<ReactionToast name={name} />),
    [],
  );

  return (
    <section className="flex items-center justify-between gap-4 lg:flex-col">
      <p>Reactions</p>
      {reactions.length ? (
        <ul className="flex items-center gap-6">
          {reactions.map(({ _count, hasReacted, name, typeId }) => (
            <Form key={typeId} method="PUT">
              <button
                aria-label={`${name} reaction button`}
                disabled={!isUser}
                className={twJoin(
                  "group relative rounded-md disabled:cursor-not-allowed",
                )}
                onClick={() => handleReactionClick(name)}
                type="submit"
              >
                <span
                  className={twJoin(
                    "flex items-center justify-center rounded-full bg-transparent p-2 text-neutral-900 transition group-hover:bg-neutral-200 group-hover:text-primary-700 dark:text-neutral-100 dark:group-hover:bg-neutral-800 dark:group-hover:text-primary-300 [&_svg]:h-6 [&_svg]:w-6",
                    hasReacted && "text-primary-700 dark:text-primary-300",
                  )}
                >
                  <ReactionIcon name={name} />
                </span>
                <span className="absolute -bottom-2 -right-2 flex h-5 w-5 select-none items-center justify-center rounded-full bg-neutral-800 text-xs leading-none text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900">
                  {_count}
                </span>
              </button>
              <input type="hidden" name="reactionId" value={typeId} />
              <input type="hidden" name="reviewId" value={reviewId} />
            </Form>
          ))}
        </ul>
      ) : (
        <div className="flex items-center gap-4 font-medium text-neutral-900 lg:text-lg dark:text-neutral-100">
          No reactions yet
        </div>
      )}
    </section>
  );
};

export default ReviewReactions;

const getReactionToastMessage = (reactionType: string, resource: string) => {
  switch (reactionType) {
    case "Like":
    case "Love":
    case "Dislike":
      return `You ${reactionType.toLowerCase()} this ${resource}`;
    case "Angry":
      return `You are angry about this ${resource}`;
    case "Sad":
      return `You are unhappy about this ${resource}`;
    default:
      return null;
  }
};

interface ReactionIconProps {
  name: string;
}
const ReactionIcon = ({ name }: ReactionIconProps) => {
  switch (name) {
    case "Like":
      return <ThumbsUp />;
    case "Love":
      return <Heart />;
    case "Dislike":
      return <ThumbsDown />;
    case "Angry":
      return <EmojiTalkingAngry />;
    case "Sad":
      return <EmojiSad />;
    default:
      return null;
  }
};

interface ReactionToastProps {
  name: string;
}
const ReactionToast = ({ name }: ReactionToastProps) => (
  <div className='[&_svg]:w-4" flex items-center gap-3 text-sm [&_svg]:h-4'>
    <ReactionIcon name={name} />
    {getReactionToastMessage(name, "review")}
  </div>
);
