import Link from "~/components/atoms/Link";

const NewReviewHeader = () => (
  <header className="flex flex-col gap-1">
    <Link
      className="flex items-center gap-0.5 text-sm"
      decoration="underline"
      to="/"
      variant="muted"
    >
      Go home
    </Link>
    <h2 className="text-3xl font-black text-primary-700 dark:text-primary-300">
      New Review
    </h2>
  </header>
);

export default NewReviewHeader;
