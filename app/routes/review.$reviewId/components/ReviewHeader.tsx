import { useFetcher } from "@remix-run/react";
import { useState } from "react";

import type { Review } from "~/.server/data/review";
import Link from "~/components/atoms/Link";
import { getFormattedDate, getValidDate } from "~/utils/date";

import type { action } from "../server/action";

import ConfirmationModal from "./ConfirmationModal";

type ReviewHeaderProps = Pick<
  Exclude<Review, null>,
  "author" | "category" | "createdAt" | "title" | "updatedAt"
> & {
  isAuthor: boolean;
  reviewId: string;
};
const ReviewHeader = ({
  author,
  category,
  createdAt,
  isAuthor,
  reviewId,
  title,
  updatedAt,
}: ReviewHeaderProps) => {
  const fetcher = useFetcher<typeof action>({ key: `review-${reviewId}` });
  const [open, setOpen] = useState(false);

  const createdAtDate = getValidDate(createdAt);
  const updatedAtDate = getValidDate(updatedAt);
  const wasEdited = createdAtDate?.getTime() !== updatedAtDate?.getTime();

  const handleModalClose = () => setOpen(false);
  const handleReviewDelete = () => {
    fetcher.submit("", {
      method: "DELETE",
      navigate: true,
    });
    handleModalClose();
  };

  return (
    <header className="flex flex-col gap-6">
      {createdAt || isAuthor ? (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center">
          {createdAtDate ? (
            <p className="flex flex-col gap-0.5 text-sm font-light text-neutral-600 dark:text-neutral-400">
              Published {getFormattedDate(createdAtDate)}
              {updatedAtDate && wasEdited ? (
                <span className="text-xs">
                  (Edited {getFormattedDate(updatedAtDate)})
                </span>
              ) : null}
            </p>
          ) : null}
          {isAuthor ? (
            <nav className="flex gap-2 sm:justify-end">
              <ConfirmationModal
                handleAbortClick={handleModalClose}
                handleConfirmClick={handleReviewDelete}
                handleOpenChange={setOpen}
                open={open}
              />
              <Link
                className="w-full sm:w-max"
                size="sm"
                to={`/review/${reviewId}/edit`}
                variant="button"
              >
                Edit
              </Link>
            </nav>
          ) : null}
        </section>
      ) : null}

      <h1 className="font-serif text-3xl font-bold text-neutral-900 dark:text-neutral-100">
        {title}
      </h1>

      <p className="text-sm">
        By{" "}
        <Link size="sm" to={`/user/${author.id}`}>
          {author.username}
        </Link>
      </p>

      <Link
        className="w-max rounded bg-neutral-900 px-5 py-1.5 text-sm leading-none text-neutral-100 transition  hover:bg-neutral-700 focus-visible:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300 dark:focus-visible:bg-neutral-300"
        size="custom"
        to={`/reviews?category=${category?.name ?? "uncategorized"}`}
        variant="custom"
      >
        {category?.name ?? "Uncategorized"}
      </Link>
    </header>
  );
};

export default ReviewHeader;
