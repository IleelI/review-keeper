import { SignOut, UserPlus, SignIn } from "@phosphor-icons/react";
import { Form, NavLink } from "@remix-run/react";
import { PropsWithChildren } from "react";

import useUser from "~/hooks/useUser/useUser";

const MainLayout = ({ children }: PropsWithChildren) => {
  const user = useUser();

  return (
    <main className="mx-auto flex w-full flex-col gap-8 lg:max-w-screen-md lg:gap-12 xl:max-w-screen-lg 2xl:max-w-screen-xl">
      {user ? (
        <header className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr]">
          <h1 className="text-4xl font-extralight text-neutral-900 dark:text-neutral-100">
            Review Keeper
          </h1>

          <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
            <nav className="hidden items-center justify-end gap-4 xl:flex">
              <NavLink
                className="rounded-lg bg-transparent px-3 py-2 font-medium transition duration-300 hover:bg-neutral-200 hover:text-primary-700 dark:hover:bg-neutral-800 dark:hover:text-primary-300 [&.active]:font-bold [&.active]:text-primary-700 dark:[&.active]:text-primary-300"
                to="/"
              >
                Home
              </NavLink>

              <NavLink
                className="rounded-lg bg-transparent px-3 py-2 font-medium transition duration-300 hover:bg-neutral-200 hover:text-primary-700 dark:hover:bg-neutral-800 dark:hover:text-primary-300 [&.active]:font-bold [&.active]:text-primary-700 dark:[&.active]:text-primary-300"
                to="/review/new"
              >
                Review Creator
              </NavLink>
            </nav>

            <p className="rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-700">
              Signed as{" "}
              <span className="font-mono font-medium text-primary-700 dark:text-primary-300">
                {user.username}
              </span>
            </p>

            <Form action="/auth/sign-out" method="post">
              <button
                className="flex w-full items-center justify-center gap-1 rounded-lg bg-primary-700 px-3 py-2 text-neutral-200 dark:bg-primary-300 dark:text-neutral-800"
                type="submit"
              >
                Sign out
                <SignOut />
              </button>
            </Form>
          </section>
        </header>
      ) : (
        <header className="flex justify-between gap-4">
          <h1 className="text-4xl font-bold">Not signed in.</h1>
          <nav className="flex gap-4">
            <NavLink
              className="flex items-center justify-center gap-2 rounded-lg border border-neutral-700 px-3 py-1.5 text-neutral-700 dark:border-neutral-300 dark:text-neutral-300"
              to="/auth/sign-up"
            >
              Sign up
              <UserPlus weight="bold" />
            </NavLink>
            <NavLink
              className="flex items-center justify-center gap-2 rounded-lg bg-primary-700 px-3 py-1.5 text-neutral-200 dark:bg-primary-300 dark:text-neutral-800"
              to="/auth/sign-in"
            >
              Sign in
              <SignIn weight="bold" />
            </NavLink>
          </nav>
        </header>
      )}

      {children}
    </main>
  );
};

export default MainLayout;
