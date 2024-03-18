import { useFetcher } from "@remix-run/react";
import { useState } from "react";

import Button from "~/components/atoms/Button";
import Link from "~/components/atoms/Link";
import Dialog from "~/components/molecules/Dialog";

import type { action } from "../server/action";

interface ReviewActionsProps {
  reviewId: string;
}
const ReviewActions = ({ reviewId }: ReviewActionsProps) => {
  const fetcher = useFetcher<typeof action>({ key: `review-${reviewId}` });
  const [open, setOpen] = useState(false);

  const handleModalClose = () => setOpen(false);
  const handleReviewDelete = () => {
    fetcher.submit("", {
      method: "DELETE",
      navigate: true,
    });
    handleModalClose();
  };

  return (
    <nav className="row-start-1 flex gap-2 sm:row-start-auto sm:justify-end">
      <Dialog modal open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Button
            className="w-full border-red-700 text-red-700 hover:border-red-600 hover:text-red-600 focus-visible:border-red-600 focus-visible:text-red-600 sm:w-max dark:border-red-300 dark:text-red-300 dark:hover:border-red-400 dark:hover:text-red-400 dark:focus-visible:border-red-400 dark:focus-visible:text-red-400"
            intent="secondary"
            size="sm"
          >
            Delete
          </Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title className="text-red-700 dark:text-red-300">
              Delete review
            </Dialog.Title>
            <Dialog.Description>
              Are you sure you want to remove this review? This action cannot be
              undone.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer className="gap-4">
            <Button intent="text" onClick={handleModalClose}>
              No, keep it
            </Button>
            <Button intent="destructive" onClick={handleReviewDelete}>
              Yes, remove it
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>

      <Link
        className="w-full sm:w-max"
        size="sm"
        to={`/review/${reviewId}/edit`}
        variant="button"
      >
        Edit
      </Link>
    </nav>
  );
};

export default ReviewActions;
