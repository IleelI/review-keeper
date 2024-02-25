import Link from "~/components/atoms/Link";

const ReviewPage = () => {
  return (
    <div className="flex flex-col gap-6 px-8 py-6">
      <h1 className="text-3xl font-bold text-primary-700 dark:text-primary-300">
        Review Page
      </h1>
      <div className="flex w-max flex-col gap-2 rounded-lg border border-neutral-300 bg-neutral-50 px-6 py-4 dark:border-neutral-700 dark:bg-neutral-800">
        <p className="text-lg font-medium">
          Add guard to check if user can edit review
        </p>
        <Link decoration="underline" to="edit">
          Edit Review
        </Link>
      </div>
    </div>
  );
};

export default ReviewPage;
