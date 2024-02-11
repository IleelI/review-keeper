import Button from "~/components/atoms/Button";

interface NewReviewFormActionsProps {
  handleFormReset: () => void;
}
const NewReviewFormActions = ({
  handleFormReset,
}: NewReviewFormActionsProps) => (
  <nav className="flex gap-8">
    <Button intent="secondary" onClick={handleFormReset} type="reset">
      Clear Review
    </Button>
    <Button type="submit">Create Review</Button>
  </nav>
);

export default NewReviewFormActions;
