import { ReactNode } from "react";
import { twJoin } from "tailwind-merge";

interface MenuBarButtonProps {
  handleClick: () => void;
  icon: ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
}

const MenuBarButton = ({
  handleClick,
  icon,
  isActive = false,
  isDisabled = false,
}: MenuBarButtonProps) => {
  return (
    <button
      type="button"
      className={twJoin([
        "aspect-square items-center rounded-md p-2 transition-colors  ease-in-out focus:outline-none enabled:hover:bg-neutral-200 enabled:focus-visible:bg-neutral-200 disabled:opacity-40 dark:border-neutral-700 dark:enabled:hover:bg-neutral-700 dark:enabled:focus-visible:bg-neutral-700",
        isActive
          ? "text-primary-600 dark:text-primary-400"
          : "text-neutral-600 enabled:hover:text-primary-600 enabled:focus-visible:text-primary-600 dark:text-neutral-400 dark:enabled:hover:text-primary-400 dark:enabled:focus-visible:text-primary-400",
      ])}
      disabled={isDisabled}
      onClick={handleClick}
    >
      {icon}
    </button>
  );
};

export default MenuBarButton;
