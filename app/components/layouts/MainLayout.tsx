import { PropsWithChildren } from "react";

import useUser from "~/hooks/useUser/useUser";

import Link from "../atoms/Link";

import { DesktopNavigation } from "./components/DesktopNavigation";
import { MobileNavigation } from "./components/MobileNavigation";

const MainLayout = ({ children }: PropsWithChildren) => {
  const user = useUser();

  return (
    <main className="mx-auto flex w-full flex-col gap-8 md:max-w-screen-xl lg:gap-16 ">
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
        <DesktopNavigation user={user} />
      </header>

      {children}
    </main>
  );
};

export default MainLayout;
