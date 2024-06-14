import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import { ElementRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const Dropdown = ({ children, ...props }: RadixDropdown.DropdownMenuProps) => (
  <RadixDropdown.Root {...props}>{children}</RadixDropdown.Root>
);

const DropdownTrigger = forwardRef<
  ElementRef<typeof RadixDropdown.Trigger>,
  RadixDropdown.DropdownMenuTriggerProps
>(({ children, className, role = "menu", type = "button", ...props }, ref) => (
  <RadixDropdown.Trigger
    className={twMerge(
      "flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-1 text-neutral-800 outline-offset-2 transition duration-200 ease-in-out enabled:hover:border-primary-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:enabled:hover:border-primary-300",
      className,
    )}
    ref={ref}
    role={role}
    type={type}
    {...props}
  >
    {children}
  </RadixDropdown.Trigger>
));
DropdownTrigger.displayName = "DropdownTrigger";

const DropdownContent = forwardRef<
  ElementRef<typeof RadixDropdown.Content>,
  RadixDropdown.MenuContentProps
>(
  (
    { children, className, collisionPadding = 24, sideOffset = 8, ...props },
    ref,
  ) => (
    <RadixDropdown.Portal>
      <RadixDropdown.Content
        className={twMerge(
          "flex min-w-[var(--radix-dropdown-menu-trigger-width)] flex-col gap-1 rounded-lg border border-neutral-100 bg-white p-1.5 shadow dark:border-neutral-700 dark:bg-neutral-800",
          className,
        )}
        collisionPadding={collisionPadding}
        sideOffset={sideOffset}
        ref={ref}
        {...props}
      >
        {children}
      </RadixDropdown.Content>
    </RadixDropdown.Portal>
  ),
);
DropdownContent.displayName = "DropdownContent";

const DropdownItem = forwardRef<
  ElementRef<typeof RadixDropdown.Item>,
  RadixDropdown.MenuItemProps
>(({ children, className, ...props }, ref) => (
  <RadixDropdown.Item
    className={twMerge(
      "flex w-full cursor-pointer items-center gap-1.5 rounded px-1.5 py-1 text-left text-sm outline-none data-[highlighted]:bg-neutral-100 dark:data-[highlighted]:bg-neutral-700",
      className,
    )}
    ref={ref}
    {...props}
  >
    {children}
  </RadixDropdown.Item>
));
DropdownItem.displayName = "DropdownMenuItem";

Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;
Dropdown.Item = DropdownItem;

export { Dropdown };
