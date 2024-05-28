import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Form } from "@remix-run/react";
import { PropsWithChildren } from "react";

import useUser from "~/hooks/useUser/useUser";

import Link from "../atoms/Link";

import { MobileNavigation } from "./components/MobileNavigation";

const MainLayout = ({ children }: PropsWithChildren) => {
  const user = useUser();

  return (
    <main className="mx-auto flex  flex-col gap-8 md:max-w-screen-xl lg:gap-16 ">
      <header className="flex items-center justify-between gap-4">
        <Link
          className="text-3xl font-bold text-primary-700 dark:text-primary-300"
          to="/"
          size="custom"
          variant="custom"
        >
          <h1>Review Keeper</h1>
        </Link>

        <MobileNavigation user={user} />
        <nav className="hidden gap-2 lg:flex">
          <ul className="flex gap-2">
            <Link to="/" variant="navigation">
              <li>Home</li>
            </Link>
            <Link to="/review/new" variant="navigation">
              <li>Review Creator</li>
            </Link>
          </ul>
          {user ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className="rounded-lg border border-neutral-200 bg-neutral-100 px-4 py-1 text-neutral-800"
                  type="button"
                >
                  {user?.username}
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="min-w-[var(--radix-dropdown-menu-trigger-width)] rounded-lg bg-white px-4 py-2 shadow">
                  <Link to="/user/123124" size="custom" variant="custom">
                    User Profile
                  </Link>
                  <Form action="/auth/sign-out" method="POST">
                    <button type="submit">Sign out</button>
                  </Form>

                  <DropdownMenu.Arrow />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ) : (
            <section className="grid grid-cols-2 gap-2">
              <Link to="/auth/sign-up" size="sm" variant="buttonSecondary">
                Sign up
              </Link>
              <Link to="/auth/sign-in" size="sm" variant="button">
                Sign in
              </Link>
            </section>
          )}
        </nav>
      </header>

      {children}
    </main>
  );
};

export default MainLayout;
