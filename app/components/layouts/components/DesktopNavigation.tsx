import type { AppUser } from "~/.server/data/user";
import { LogInIcon } from "~/assets/icons/LogIn.icon";
import { LogOutIcon } from "~/assets/icons/LogOut.icon";
import { UserIcon } from "~/assets/icons/User.icon";
import { UserPlusIcon } from "~/assets/icons/UserPlus.icon";
import { UserSquareIcon } from "~/assets/icons/UserSquare.icon";
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
        {user ? (
          <Link to="/review/new" variant="navigation">
            <li>Review Creator</li>
          </Link>
        ) : null}
      </ul>
      {user ? (
        <Dropdown>
          <Dropdown.Trigger>
            <UserIcon /> {user.username}
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>
              <Link
                className="flex items-center gap-1.5"
                to={`/user/${user.id}`}
                size="custom"
                variant="custom"
              >
                <UserSquareIcon />
                User Profile
              </Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <button
                className="flex items-center gap-1.5"
                onClick={handleSignOut}
                type="button"
              >
                <LogOutIcon />
                Sign out
              </button>
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      ) : (
        <section className="grid grid-cols-2 gap-2">
          <Link to="/auth/sign-up" size="sm" variant="buttonSecondary">
            Sign up
            <UserPlusIcon />
          </Link>
          <Link to="/auth/sign-in" size="sm" variant="button">
            Sign in
            <LogInIcon />
          </Link>
        </section>
      )}
    </nav>
  );
};

export { DesktopNavigation };
