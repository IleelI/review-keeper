import Button from "~/components/atoms/Button";

interface NewReviewFormActionsProps {
  handleFormReset: () => void;
}
const NewReviewFormActions = ({
  handleFormReset,
}: NewReviewFormActionsProps) => (
  <nav className="flex flex-col gap-4 sm:flex-row sm:gap-8">
    <Button intent="secondary" onClick={handleFormReset} size="lg" type="reset">
      Clear Review
    </Button>
    <Button size="lg" type="submit">
      Create Review
    </Button>
  </nav>
);

export default NewReviewFormActions;
