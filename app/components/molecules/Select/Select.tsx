import * as RadixSelect from "@radix-ui/react-select";
import { ElementRef, forwardRef } from "react";
import { twJoin, twMerge } from "tailwind-merge";

import { ArrowSeparateVerticalIcon } from "~/assets/icons/ArrowSeparateVertical.icon";
import { CheckIcon } from "~/assets/icons/Check.icon";
import { DownArrowIcon } from "~/assets/icons/DownArrow.icon";
import { UpArrowIcon } from "~/assets/icons/UpArrow.icon";

const Select = (props: RadixSelect.SelectProps) => (
  <RadixSelect.Root {...props} />
);

const SelectValue = RadixSelect.SelectValue;

const SelectGroup = RadixSelect.Group;

type SelectTriggerProps = {
  hasError?: boolean;
} & React.ComponentPropsWithoutRef<typeof RadixSelect.SelectTrigger>;
const SelectTrigger = forwardRef<
  ElementRef<typeof RadixSelect.Trigger>,
  SelectTriggerProps
>(({ children, className, hasError, ...props }, ref) => (
  <RadixSelect.Trigger
    aria-invalid={hasError}
    className={twMerge([
      "flex min-h-[38px] items-center justify-between gap-4 rounded-md border px-3 py-1.5 text-left outline-none transition",
      "border-neutral-200 bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100",
      "enabled:hover:border-primary-700 enabled:focus-visible:border-primary-700 dark:enabled:hover:border-primary-300 dark:enabled:focus-visible:border-primary-300",
      "data-[placeholder]:text-neutral-400 dark:data-[placeholder]:text-neutral-600",
      "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40",
      "aria-[invalid=true]:border-red-700 dark:aria-[invalid=true]:border-red-300",
      "[&>span]:first-of-type:overflow-hidden [&>span]:first-of-type:text-ellipsis [&>span]:first-of-type:whitespace-nowrap",
      className,
    ])}
    ref={ref}
    {...props}
  >
    {children}
    <RadixSelect.Icon asChild>
      <ArrowSeparateVerticalIcon className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
    </RadixSelect.Icon>
  </RadixSelect.Trigger>
));
SelectTrigger.displayName = RadixSelect.SelectTrigger.displayName;

const SelectScrollUpButton = forwardRef<
  React.ElementRef<typeof RadixSelect.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof RadixSelect.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <RadixSelect.ScrollUpButton
    ref={ref}
    className={twJoin("flex items-center justify-center p-2", className)}
    {...props}
  >
    <UpArrowIcon className={twMerge("h-4 w-4", className)} />
  </RadixSelect.ScrollUpButton>
));
SelectScrollUpButton.displayName = RadixSelect.ScrollUpButton.displayName;

const SelectScrollDownButton = forwardRef<
  React.ElementRef<typeof RadixSelect.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof RadixSelect.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <RadixSelect.ScrollDownButton
    ref={ref}
    className={twJoin("flex items-center justify-center p-2", className)}
    {...props}
  >
    <DownArrowIcon className={twMerge("h-4 w-4", className)} />
  </RadixSelect.ScrollDownButton>
));
SelectScrollDownButton.displayName = RadixSelect.ScrollDownButton.displayName;

const SelectContent = forwardRef<
  ElementRef<typeof RadixSelect.Content>,
  RadixSelect.SelectContentProps
>(
  (
    {
      children,
      className,
      collisionPadding = 24,
      position = "popper",
      sideOffset = 8,
      ...props
    },
    ref,
  ) => (
    <RadixSelect.Portal>
      <RadixSelect.Content
        className={twMerge(
          "relative overflow-hidden rounded-md border shadow shadow-neutral-200 dark:shadow-none",
          "border-neutral-200 bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100",
          "ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4",
          position === "popper" &&
            "max-h-[var(--radix-select-content-available-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          className,
        )}
        collisionPadding={collisionPadding}
        position={position}
        ref={ref}
        sideOffset={sideOffset}
        {...props}
      >
        <SelectScrollUpButton />

        <RadixSelect.Viewport>{children}</RadixSelect.Viewport>

        <SelectScrollDownButton />
      </RadixSelect.Content>
    </RadixSelect.Portal>
  ),
);
SelectContent.displayName = RadixSelect.SelectContent.displayName;

const SelectLabel = forwardRef<
  React.ElementRef<typeof RadixSelect.Label>,
  React.ComponentPropsWithoutRef<typeof RadixSelect.Label>
>(({ className, ...props }, ref) => (
  <RadixSelect.Label
    ref={ref}
    className={twJoin("px-2 py-1.5 font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = RadixSelect.Label.displayName;

const SelectItem = forwardRef<
  React.ElementRef<typeof RadixSelect.Item>,
  React.ComponentPropsWithoutRef<typeof RadixSelect.Item>
>(({ className, children, ...props }, ref) => (
  <RadixSelect.Item
    ref={ref}
    className={twMerge(
      "relative flex cursor-pointer items-center py-1.5 pl-2 pr-8 outline-none",
      "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40",
      "data-[highlighted]:data-[state=unchecked]:bg-neutral-100 data-[highlighted]:data-[state=unchecked]:text-neutral-900 dark:data-[highlighted]:data-[state=unchecked]:bg-neutral-700 dark:data-[highlighted]:data-[state=unchecked]:text-neutral-100",
      "data-[state=checked]:bg-neutral-100 data-[state=checked]:text-neutral-900 dark:data-[state=checked]:bg-neutral-700 dark:data-[state=checked]:text-neutral-300",
      className,
    )}
    {...props}
  >
    <span className="absolute right-2 flex items-center justify-center">
      <RadixSelect.ItemIndicator>
        <CheckIcon className={twMerge("h-5 w-5", className)} strokeWidth={2} />
      </RadixSelect.ItemIndicator>
    </span>
    <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
  </RadixSelect.Item>
));
SelectItem.displayName = RadixSelect.Item.displayName;

const SelectSeparator = forwardRef<
  React.ElementRef<typeof RadixSelect.Separator>,
  React.ComponentPropsWithoutRef<typeof RadixSelect.Separator>
>(({ className, ...props }, ref) => (
  <RadixSelect.Separator
    ref={ref}
    className={twJoin(
      "-mx-1 my-1 h-px bg-neutral-300 dark:bg-neutral-700",
      className,
    )}
    {...props}
  />
));
SelectSeparator.displayName = RadixSelect.Separator.displayName;

interface SelectEmptyListProps {
  message?: string;
  title?: string;
}
const SelectEmptyList = ({
  message = "Please, try again later...",
  title = "No options available",
}: SelectEmptyListProps) => (
  <div className="flex flex-col items-center justify-center gap-1 p-4">
    <p className="font-semibold">{title}</p>
    <p className="text-sm text-neutral-600 dark:text-neutral-400">{message}</p>
  </div>
);

Select.Trigger = SelectTrigger;
Select.Value = SelectValue;
Select.Content = SelectContent;
Select.Item = SelectItem;
Select.Group = SelectGroup;
Select.Label = SelectLabel;
Select.Separator = SelectSeparator;
Select.EmptyList = SelectEmptyList;

export { Select };
