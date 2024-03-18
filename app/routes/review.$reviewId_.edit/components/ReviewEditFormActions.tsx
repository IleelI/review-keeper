import Button from "~/components/atoms/Button";

interface ReviewEditFormActionsProps {
  handleFormReset: () => void;
  isFormDisabled: boolean;
  isFormResetDisabled: boolean;
}
const ReviewEditFormActions = ({
  handleFormReset,
  isFormDisabled,
  isFormResetDisabled,
}: ReviewEditFormActionsProps) => {
  return (
    <nav className="flex flex-col gap-4 sm:flex-row sm:gap-8">
      <Button
        disabled={isFormResetDisabled}
        intent="text"
        onClick={handleFormReset}
        type="reset"
      >
        Restore Initial Values
      </Button>
      <Button disabled={isFormDisabled} type="submit">
        Update Review
      </Button>
    </nav>
  );
};

export default ReviewEditFormActions;
