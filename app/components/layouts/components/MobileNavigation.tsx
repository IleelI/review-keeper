import { useState } from "react";

import type { AppUser } from "~/.server/data/user";
import { MenuIcon } from "~/assets/icons/Menu.icon";
import Button from "~/components/atoms/Button";
import Link from "~/components/atoms/Link";
import Dialog from "~/components/molecules/Dialog";
import useSignOut from "~/hooks/useSignOut/useSignOut";

interface MobileNavigationProps {
  user: AppUser | null;
}
export const MobileNavigation = ({ user }: MobileNavigationProps) => {
  const signOut = useSignOut();
  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          className="h-8 w-8 rounded-md lg:hidden"
          intent="text"
          size="none"
        >
          <MenuIcon />
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
                to={`/user/${user.id}`}
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
              <h2 className="text-lg text-neutral-800 dark:text-neutral-200">
                Welcome,{" "}
                <span className="font-semibold text-primary-700 dark:text-primary-300">
                  {user.username}
                </span>
                !
              </h2>
              <Button onClick={handleSignOut}>Sign out</Button>
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
