import { SignIn, UserPlus } from "@phosphor-icons/react";
import { type MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";

import Button from "~/components/atoms/Button";
import Link from "~/components/atoms/Link";
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
    <>
      <header className="col-span-full flex items-center justify-between gap-8 rounded-xl border border-neutral-300 bg-neutral-50 px-6 py-2.5 dark:border-neutral-700 dark:bg-neutral-800">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Review Keeper
        </h2>

        <section className="flex items-center gap-6">
          {user ? (
            <>
              <p className="italic">{user.username}</p>
              <Form action="/sign-out" method="post">
                <Button intent="text" type="submit">
                  Sign out
                </Button>
              </Form>
            </>
          ) : (
            <>
              <Link className="flex items-center gap-2" to="/sign-in">
                <SignIn weight="bold" /> Sign in
              </Link>
              <Link className="flex items-center gap-2" to="/sign-up">
                <UserPlus weight="bold" /> Sign up
              </Link>
            </>
          )}
        </section>
      </header>

      <ul className="col-span-full grid auto-rows-min grid-cols-4 flex-col gap-4">
        <li className="aspect-[5/2] rounded-xl border border-neutral-300 bg-neutral-500 transition hover:border-primary-700 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-300">
          <Link
            className="flex h-full !w-full items-center justify-center px-5 py-2 text-xl"
            to="/reviews"
            variant="regular"
          >
            See Reviews
          </Link>
        </li>
        {user ? (
          <li className="aspect-[5/2] rounded-xl border border-neutral-300 bg-neutral-500 transition hover:border-primary-700 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-300">
            <Link
              className="flex h-full !w-full items-center justify-center px-5 py-2 text-xl"
              to="/review/new"
              variant="regular"
            >
              New Review
            </Link>
          </li>
        ) : null}
        <li className="aspect-[5/2] rounded-xl border border-neutral-300 bg-neutral-500 transition hover:border-primary-700 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-300">
          <Link
            className="flex h-full !w-full items-center justify-center px-5 py-2 text-xl"
            to="/playground"
            variant="regular"
          >
            Visit Playground
          </Link>
        </li>
      </ul>
    </>
  );
}
