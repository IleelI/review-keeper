import { Form } from "@remix-run/react";
import { LogIn, LogOut, UserPlus } from "iconoir-react";
import { PropsWithChildren } from "react";

import useUser from "~/hooks/useUser/useUser";

import Button from "../atoms/Button";
import Link from "../atoms/Link";

const MainLayout = ({ children }: PropsWithChildren) => {
  const user = useUser();

  return (
    <main className="mx-auto flex w-full flex-col gap-8 md:max-w-screen-xl lg:gap-16 ">
      <header className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr]">
        <Link
          className="text-2xl font-bold text-primary-700 dark:text-primary-300"
          to="/"
          size="custom"
          variant="custom"
        >
          <h1>Review Keeper</h1>
        </Link>

        <nav className="flex flex-col justify-end gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Link to="/" size="sm" variant="navigation">
            Home
          </Link>

          {user ? (
            <>
              <Link to="/review/new" size="sm" variant="navigation">
                Review Creator
              </Link>

              <Form action="/auth/sign-out" method="post">
                <Button size="sm" type="submit">
                  Sign out
                  <LogOut className="h-4 w-4" />
                </Button>
              </Form>
            </>
          ) : (
            <>
              <Link to="/auth/sign-up" size="sm" variant="buttonGhost">
                Sign up
                <UserPlus className="h-4 w-4" />
              </Link>
              <Link to="/auth/sign-in" size="sm" variant="button">
                Sign in
                <LogIn className="h-4 w-4" />
              </Link>
            </>
          )}
        </nav>
      </header>

      {children}
    </main>
  );
};

export default MainLayout;
