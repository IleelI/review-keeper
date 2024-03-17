import Button from "~/components/atoms/Button";
import Dialog from "~/components/molecules/Dialog";

interface ConfirmationModalProps {
  handleAbortClick: () => void;
  handleConfirmClick: () => void;
  handleOpenChange: (open: boolean) => void;
  open: boolean;
}
const ConfirmationModal = ({
  handleAbortClick,
  handleConfirmClick,
  handleOpenChange,
  open,
}: ConfirmationModalProps) => {
  return (
    <Dialog modal open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <Button
          className="w-full hover:text-red-700 focus-visible:text-red-700 sm:w-max dark:hover:text-red-300 dark:focus-visible:text-red-300"
          intent="text"
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
          <Button intent="text" onClick={handleAbortClick}>
            No, keep it
          </Button>
          <Button intent="destructive" onClick={handleConfirmClick}>
            Yes, remove it
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

export default ConfirmationModal;
