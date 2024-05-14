import {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  type PopoverTriggerProps,
  type PopoverProps,
  type PopoverContentProps,
} from "@radix-ui/react-popover";
import { ArrowSeparateVertical, Search, Check } from "iconoir-react";
import {
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
  type PropsWithChildren,
} from "react";
import { twMerge } from "tailwind-merge";

import Input from "~/components/atoms/Input";

export interface ComboboxItem {
  name: string;
  value: string;
}

const Combobox = ({ children, ...props }: PopoverProps) => (
  <Popover {...props}>{children}</Popover>
);

const ComboboxTrigger = forwardRef<
  ElementRef<typeof PopoverTrigger>,
  PopoverTriggerProps
>(({ children, className, role = "combobox", ...props }, ref) => {
  return (
    <PopoverTrigger
      className={twMerge(
        "flex min-h-[32px] w-96 items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-left leading-none outline-none dark:border-neutral-700 dark:bg-neutral-800",
        className,
      )}
      ref={ref}
      role={role}
      {...props}
    >
      {children}
    </PopoverTrigger>
  );
});
ComboboxTrigger.displayName = "ComboboxTrigger";

const TriggerIcon = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<"svg">>(
  ({ className, ...props }, ref) => (
    <ArrowSeparateVertical
      className={twMerge("h-4 w-4", className)}
      ref={ref}
      {...props}
    />
  ),
);
TriggerIcon.displayName = "TriggerIcon";

type ComboboxValueProps = PropsWithChildren<{
  placeholder?: string;
}>;
const ComboboxValue = ({ children, placeholder }: ComboboxValueProps) =>
  children || <p className="text-neutral-500">{placeholder}</p>;

const ComboboxContent = forwardRef<
  ElementRef<typeof PopoverContent>,
  PopoverContentProps
>(({ children, className, collisionPadding = 24, sideOffset = 8 }, ref) => {
  return (
    <PopoverPortal>
      <PopoverContent
        className={twMerge(
          "max-h-[var(--radix-popover-content-available-height)] w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-lg border border-neutral-200 bg-white ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4 dark:border-neutral-700 dark:bg-neutral-800",
          className,
        )}
        collisionPadding={collisionPadding}
        ref={ref}
        sideOffset={sideOffset}
      >
        {children}
      </PopoverContent>
    </PopoverPortal>
  );
});
ComboboxContent.displayName = "ComboboxContent";

const ComboboxSearch = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input">
>(({ className, ...props }, ref) => {
  return (
    <form
      className={twMerge(
        "flex items-center gap-1.5 border-b border-neutral-200 px-2 py-2 dark:border-neutral-700",
        className,
      )}
    >
      <Search className="h-4 w-4" />
      <Input
        className="min-h-8 w-full rounded-none border-none p-0"
        ref={ref}
        {...props}
      />
    </form>
  );
});
ComboboxSearch.displayName = "ComboboxSearch";

const ComboboxItem = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button">
>(({ children, className, ...props }, ref) => {
  return (
    <button
      className={twMerge(
        "relative w-full px-1.5 py-1.5 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});
ComboboxItem.displayName = "ComboboxItem";

const ComboboxItemIndicator = forwardRef<
  SVGSVGElement,
  ComponentPropsWithoutRef<"svg">
>(({ className, ...props }, ref) => (
  <Check
    className={twMerge(
      "absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 stroke-2",
      className,
    )}
    ref={ref}
    {...props}
  />
));
ComboboxItemIndicator.displayName = "ComboboxItemIndicator";

const ComboboxEmptyContent = forwardRef<
  HTMLElement,
  ComponentPropsWithoutRef<"section">
>(({ className, ...props }, ref) => (
  <section
    className={twMerge(
      "flex flex-col items-center justify-center gap-1 px-3 py-4",
      className,
    )}
    ref={ref}
    {...props}
  >
    <h2 className="font-semibold text-neutral-800 dark:text-neutral-200">
      No result found
    </h2>
    <h3 className="text-sm text-neutral-600 dark:text-neutral-400">
      You can try changing your search input
    </h3>
  </section>
));
ComboboxEmptyContent.displayName = "ComboboxEmptyContent";

Combobox.Trigger = ComboboxTrigger;
Combobox.TriggerIcon = TriggerIcon;
Combobox.Value = ComboboxValue;
Combobox.Content = ComboboxContent;
Combobox.Search = ComboboxSearch;
Combobox.Item = ComboboxItem;
Combobox.ItemIndicator = ComboboxItemIndicator;
Combobox.EmptyContent = ComboboxEmptyContent;

export { Combobox };
