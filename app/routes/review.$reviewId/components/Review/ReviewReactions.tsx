import { Form } from "@remix-run/react";
import { useCallback } from "react";
import { toast } from "sonner";
import { twJoin } from "tailwind-merge";

import type { ReviewReactions as ReviewReactionsType } from "~/.server/data/review";
import type { AppUser } from "~/.server/data/user";
import { HeartIcon } from "~/assets/icons/Heart.icon";
import { SadEmojiIcon } from "~/assets/icons/SadEmoji.icon";
import { TalkingAngryEmojiIcon } from "~/assets/icons/TalkingAngryEmoji.icon";
import { ThumbsDownIcon } from "~/assets/icons/ThumbsDown.icon";
import { ThumbsUpIcon } from "~/assets/icons/ThumbsUp.icon";
import { Tooltip } from "~/components/molecules/Tooltip";

interface ReviewReactionsProps {
  isAuthor: boolean;
  reactions: ReviewReactionsType;
  reviewId: string;
  user: AppUser | null;
}

const ReviewReactions = ({
  isAuthor,
  reactions,
  reviewId,
  user,
}: ReviewReactionsProps) => {
  const isLoggedIn = !!user;
  const isReactionDisabled = !isLoggedIn || isAuthor;

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
              <Tooltip>
                <Tooltip.Trigger asChild>
                  <button
                    aria-label={`${name} reaction button`}
                    className="group relative rounded-md disabled:cursor-not-allowed"
                    disabled={isReactionDisabled}
                    onClick={() =>
                      hasReacted ? null : handleReactionClick(name)
                    }
                    type="submit"
                  >
                    <span
                      className={twJoin(
                        "flex items-center justify-center rounded-full bg-transparent p-2 text-neutral-900 transition group-hover:bg-neutral-200 group-hover:text-primary-700 group-disabled:opacity-40 dark:text-neutral-100 dark:group-hover:bg-neutral-800 dark:group-hover:text-primary-300 [&_svg]:h-6 [&_svg]:w-6",
                        hasReacted && "text-primary-700 dark:text-primary-300",
                      )}
                    >
                      <ReactionIcon name={name} />
                    </span>
                    <span className="absolute -bottom-2 -right-2 flex h-5 w-5 select-none items-center justify-center rounded-full bg-neutral-800 text-xs leading-none text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900">
                      {_count}
                    </span>
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  {isReactionDisabled
                    ? !isLoggedIn
                      ? "You have to be logged in to react."
                      : isAuthor
                        ? "You cannot react to your own review."
                        : ""
                    : getReactionToastMessage(name, "review")}
                </Tooltip.Content>
              </Tooltip>

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
      return <ThumbsUpIcon strokeWidth={2} />;
    case "Love":
      return <HeartIcon strokeWidth={2} />;
    case "Dislike":
      return <ThumbsDownIcon strokeWidth={2} />;
    case "Angry":
      return <TalkingAngryEmojiIcon strokeWidth={2} />;
    case "Sad":
      return <SadEmojiIcon strokeWidth={2} />;
    default:
      return null;
  }
};

interface ReactionToastProps {
  name: string;
}
const ReactionToast = ({ name }: ReactionToastProps) => (
  <div className="flex items-center gap-2 text-sm text-neutral-900 dark:text-neutral-100">
    <ReactionIcon name={name} />
    {getReactionToastMessage(name, "review")}
  </div>
);
