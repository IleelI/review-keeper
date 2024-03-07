import { Link } from "@remix-run/react";
import { NavArrowLeft } from "iconoir-react";

const BackButton = () => {
  return (
    <Link
      className="absolute left-0 top-0 cursor-pointer rounded-lg border border-neutral-200 p-2 transition hover:border-primary-700 hover:bg-neutral-100 hover:text-primary-700 focus-visible:border-primary-700 focus-visible:bg-neutral-100 focus-visible:text-primary-700 lg:-left-16 lg:-top-0 dark:border-neutral-800 dark:hover:border-primary-300 dark:hover:bg-neutral-900 dark:hover:text-primary-300 dark:focus-visible:border-primary-300 dark:focus-visible:bg-neutral-900 dark:focus-visible:text-primary-300"
      to="/"
    >
      <NavArrowLeft className="h-5 w-5" />
    </Link>
  );
};

export default BackButton;
