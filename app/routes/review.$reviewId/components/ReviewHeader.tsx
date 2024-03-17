import { Link, useFetcher } from "@remix-run/react";
import { useState } from "react";

import type { Review } from "~/.server/data/review";
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
        <section className="flex items-center gap-8">
          {createdAtDate ? (
            <p className="flex items-baseline gap-0.5 text-sm font-light text-neutral-600 dark:text-neutral-400">
              Published {getFormattedDate(createdAtDate)}
              {updatedAtDate && wasEdited ? (
                <span className="text-xs">
                  (Edited {getFormattedDate(updatedAtDate)})
                </span>
              ) : null}
            </p>
          ) : null}
          {isAuthor ? (
            <nav className="ml-auto flex gap-2">
              <ConfirmationModal
                handleAbortClick={handleModalClose}
                handleConfirmClick={handleReviewDelete}
                handleOpenChange={setOpen}
                open={open}
              />
              <Link
                className="block min-w-max rounded bg-primary-700 px-4 py-1 text-sm font-medium text-neutral-100 dark:bg-primary-300 dark:text-neutral-900"
                to={`/review/${reviewId}/edit`}
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
        <Link
          className="underline underline-offset-2 transition hover:text-primary-700 dark:hover:text-primary-300"
          to={`/user/${author.id}`}
        >
          {author.username}
        </Link>
      </p>

      <Link
        className="w-max rounded bg-neutral-900 px-5 py-1.5 text-sm leading-none text-neutral-100 transition duration-300 hover:bg-neutral-700 focus-visible:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300 dark:focus-visible:bg-neutral-300"
        to={`/reviews?category=${category?.name ?? "uncategorized"}`}
      >
        {category?.name ?? "Uncategorized"}
      </Link>
    </header>
  );
};

export default ReviewHeader;
