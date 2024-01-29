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
    <main className="flex min-h-[100dvh] w-full flex-col px-8 py-6 lg:mx-auto lg:max-w-screen-sm lg:items-center lg:justify-center">
      <div className="flex flex-col gap-8 rounded-lg bg-white p-8 shadow-md dark:bg-neutral-800">
        <h1 className="text-3xl font-bold">Welcome to Review Keeper!</h1>

        {user ? (
          <div className="flex flex-col gap-6">
            <Link
              className="underline underline-offset-4 transition-colors hover:text-primary-700 dark:hover:text-primary-300"
              to="/review/new"
            >
              Create a new review
            </Link>
            <Form action="/sign-out" method="post">
              <button
                type="submit"
                className="w-full rounded-md bg-neutral-900 px-4 py-1.5 text-center text-neutral-300 dark:bg-neutral-50 dark:text-neutral-700"
              >
                Log out
              </button>
            </Form>
          </div>
        ) : (
          <section className="grid w-full grid-cols-2 items-center gap-4">
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
    </main>
  );
}
