import { type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Review Keeper" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="flex flex-col gap-6">
      <h1>Welcome to Review Keeper</h1>
      <div className="flex max-w-xs flex-col gap-6 rounded-xl bg-neutral-100 p-4 dark:bg-neutral-800">
        <p className="text-xl font-medium text-neutral-900 dark:text-neutral-50">
          Auth showcase
        </p>
        <section className="grid grid-cols-2 items-center gap-4">
          <Link
            className="rounded-md border border-neutral-700 px-4 py-1.5 text-center text-neutral-700 dark:border-neutral-300 dark:text-neutral-300"
            to="/register"
          >
            Register
          </Link>
          <Link
            className="rounded-md bg-neutral-900 px-4 py-1.5 text-center text-neutral-300 dark:bg-neutral-50 dark:text-neutral-700"
            to="/login"
          >
            Log in
          </Link>
        </section>
      </div>
    </div>
  );
}
