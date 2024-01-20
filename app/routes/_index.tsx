import { type MetaFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";

import useUser from "~/hooks/useUser/useUser";

export const meta: MetaFunction = () => {
  return [
    { title: "Review Keeper" },
    { name: "description", content: "Welcome to Review Keeper!" },
  ];
};

export default function Index() {
  const user = useUser();

  return (
    <div className="flex flex-col gap-6">
      <h1>Welcome to Review Keeper</h1>
      <div className="flex max-w-xs flex-col gap-6 rounded-xl bg-neutral-100 p-4 dark:bg-neutral-800">
        <p className="text-xl font-medium text-neutral-900 dark:text-neutral-50">
          Auth showcase
        </p>
        {user ? (
          <div className="flex flex-col gap-4">
            <Link
              className="underline underline-offset-4 transition-colors hover:text-primary-700 dark:hover:text-primary-300"
              to="/review/new"
            >
              Create a new review
            </Link>
            <Form action="/sign-out" method="post">
              <button
                type="submit"
                className="rounded-md bg-neutral-900 px-4 py-1.5 text-center text-neutral-300 dark:bg-neutral-50 dark:text-neutral-700"
              >
                Log out
              </button>
            </Form>
          </div>
        ) : (
          <section className="grid grid-cols-2 items-center gap-4">
            <Link
              className="rounded-md border border-neutral-700 px-4 py-1.5 text-center text-neutral-700 dark:border-neutral-300 dark:text-neutral-300"
              to="/sign-up"
            >
              Sign up
            </Link>
            <Link
              className="rounded-md bg-neutral-900 px-4 py-1.5 text-center text-neutral-300 dark:bg-neutral-50 dark:text-neutral-700"
              to="/sign-in"
            >
              Sign in
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
