import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  type PopoverTriggerProps,
  type PopoverProps,
  type PopoverContentProps,
} from "@radix-ui/react-popover";
import {
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
  type PropsWithChildren,
  useEffect,
} from "react";
import { twMerge } from "tailwind-merge";

import { ArrowSeparateVerticalIcon } from "~/assets/icons/ArrowSeparateVertical.icon";
import { CheckIcon } from "~/assets/icons/Check.icon";
import { SearchIcon } from "~/assets/icons/Search.icon";
import Input from "~/components/atoms/Input";

export interface ComboboxItem {
  name: string;
  value: string;
}

const Combobox = ({ children, ...props }: PopoverProps) => {
  useEffect(() => {
    if (props.open) {
      document.body.style.overflowY = "hidden";
      document.documentElement.style.paddingRight = "16px";
    } else {
      document.body.style.overflowY = "auto";
      document.documentElement.style.paddingRight = "0px";
    }
  }, [props.open]);

  return <Popover {...props}>{children}</Popover>;
};

const ComboboxTrigger = forwardRef<
  ElementRef<typeof PopoverTrigger>,
  PopoverTriggerProps
>(
  (
    { children, className, role = "combobox", type = "button", ...props },
    ref,
  ) => {
    return (
      <PopoverTrigger
        className={twMerge(
          "flex min-h-[38px] items-center justify-between gap-4 rounded-md border px-3 py-1.5 text-left outline-none transition",
          "border-neutral-200 bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100",
          "enabled:hover:border-primary-700 enabled:focus-visible:border-primary-700 dark:enabled:hover:border-primary-300 dark:enabled:focus-visible:border-primary-300",
          "data-[placeholder]:text-neutral-400 dark:data-[placeholder]:text-neutral-600",
          "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40",
          "aria-[invalid=true]:border-red-700 dark:aria-[invalid=true]:border-red-300",
          "[&>span]:first-of-type:overflow-hidden [&>span]:first-of-type:text-ellipsis [&>span]:first-of-type:whitespace-nowrap",
          className,
        )}
        ref={ref}
        role={role}
        type={type}
        {...props}
      >
        {children}
      </PopoverTrigger>
    );
  },
);
ComboboxTrigger.displayName = "ComboboxTrigger";

const TriggerIcon = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<"svg">>(
  ({ className, ...props }, ref) => (
    <ArrowSeparateVerticalIcon
      className={twMerge("h-4 w-4 shrink-0", className)}
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
  children ? (
    <span>{children}</span>
  ) : (
    <p className="text-neutral-500">{placeholder}</p>
  );

const ComboboxContent = forwardRef<
  ElementRef<typeof PopoverContent>,
  PopoverContentProps
>(({ children, className, collisionPadding = 24, sideOffset = 8 }, ref) => {
  return (
    <PopoverContent
      className={twMerge(
        "relative max-h-[var(--radix-popover-content-available-height)] w-[var(--radix-popover-trigger-width)] overflow-y-auto rounded-lg border border-neutral-200 bg-white ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4 dark:border-neutral-700 dark:bg-neutral-800",
        className,
      )}
      collisionPadding={collisionPadding}
      ref={ref}
      sideOffset={sideOffset}
    >
      {children}
    </PopoverContent>
  );
});
ComboboxContent.displayName = "ComboboxContent";

const ComboboxSearch = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input">
>(({ className, ...props }, ref) => {
  return (
    <section
      className={twMerge(
        "flex items-center gap-1.5 border-b border-neutral-200 bg-white px-2 py-2 dark:border-neutral-700 dark:bg-neutral-800",
        className,
      )}
    >
      <SearchIcon className="h-4 w-4" />
      <Input
        className="min-h-0 w-full rounded-none border-none p-0"
        ref={ref}
        {...props}
      />
    </section>
  );
});
ComboboxSearch.displayName = "ComboboxSearch";

const ComboboxItem = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button">
>(({ children, className, type = "button", ...props }, ref) => {
  return (
    <button
      className={twMerge(
        "relative w-full px-1.5 py-1.5 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700",
        className,
      )}
      ref={ref}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
});
ComboboxItem.displayName = "ComboboxItem";

type ComboboxItemIndicatorProps = ComponentPropsWithoutRef<"svg"> & {
  isSelected?: boolean;
};
const ComboboxItemIndicator = forwardRef<
  SVGSVGElement,
  ComboboxItemIndicatorProps
>(({ className, isSelected = false, ...props }, ref) => (
  <CheckIcon
    className={twMerge(
      "absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 stroke-2 transition-opacity duration-300",
      isSelected ? "opacity-100" : "opacity-0",
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
      "flex flex-col items-center justify-center gap-1 p-4",
      className,
    )}
    ref={ref}
    {...props}
  >
    <h2 className="font-semibold">No options available</h2>
    <h3 className="text-sm text-neutral-600 dark:text-neutral-400">
      Please, try again later...
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
