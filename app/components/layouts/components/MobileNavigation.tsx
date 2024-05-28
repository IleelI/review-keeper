import { Form } from "@remix-run/react";
import { Menu } from "iconoir-react";

import type { AppUser } from "~/.server/data/user";
import Button from "~/components/atoms/Button";
import Link from "~/components/atoms/Link";
import Dialog from "~/components/molecules/Dialog";

interface MobileNavigationProps {
  user: AppUser | null;
}
export const MobileNavigation = ({ user }: MobileNavigationProps) => {
  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button
          className="h-8 w-8 rounded-md lg:hidden"
          intent="text"
          size="none"
        >
          <Menu />
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Content className="flex flex-col gap-8">
          <Dialog.Header>
            <h2>Navigation</h2>
          </Dialog.Header>

          <ul className="flex flex-col items-center gap-6">
            <Link
              className="w-full rounded-md px-4 py-2 text-lg [&.active]:font-semibold"
              to="/"
              size="custom"
              variant="navigation"
            >
              <li>Home</li>
            </Link>
            <Link
              className="w-full rounded-md px-4 py-2 text-lg [&.active]:font-semibold"
              to="/review/new"
              size="custom"
              variant="navigation"
            >
              <li>Review Creator</li>
            </Link>

            {user ? (
              <Link
                className="w-full rounded-md px-4 py-2 text-lg [&.active]:font-semibold"
                to="/user"
                size="custom"
                variant="navigation"
              >
                <li>User Profile</li>
              </Link>
            ) : null}
          </ul>

          <hr className="h-px  text-neutral-300" />

          {user ? (
            <Dialog.Footer className="grid grid-cols-1">
              <Form action="/auth/sign-out" method="POST">
                <Button type="submit">Sign out</Button>
              </Form>
            </Dialog.Footer>
          ) : (
            <Dialog.Footer className="grid grid-cols-2 gap-4">
              <Link to="/auth/sign-up" variant="buttonSecondary">
                Sign up
              </Link>
              <Link to="/auth/sign-in" variant="button">
                Sign in
              </Link>
            </Dialog.Footer>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
