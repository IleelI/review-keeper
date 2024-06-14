import { LogIn, LogOut, User, UserPlus, UserSquare } from "iconoir-react";

import type { AppUser } from "~/.server/data/user";
import Link from "~/components/atoms/Link";
import { Dropdown } from "~/components/molecules/Dropdown";
import useSignOut from "~/hooks/useSignOut/useSignOut";

interface DesktopNavigationProps {
  user: AppUser | null;
}
const DesktopNavigation = ({ user }: DesktopNavigationProps) => {
  const signOut = useSignOut();

  const handleSignOut = () => signOut();

  return (
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
        <Dropdown>
          <Dropdown.Trigger>
            <User /> {user.username}
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>
              <Link
                className="flex items-center gap-1.5"
                to={`/user/${user.id}`}
                size="custom"
                variant="custom"
              >
                <UserSquare />
                User Profile
              </Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <button
                className="flex items-center gap-1.5"
                onClick={handleSignOut}
                type="button"
              >
                <LogOut />
                Sign out
              </button>
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      ) : (
        <section className="grid grid-cols-2 gap-2">
          <Link to="/auth/sign-up" size="sm" variant="buttonSecondary">
            Sign up
            <UserPlus />
          </Link>
          <Link to="/auth/sign-in" size="sm" variant="button">
            Sign in
            <LogIn />
          </Link>
        </section>
      )}
    </nav>
  );
};

export { DesktopNavigation };
