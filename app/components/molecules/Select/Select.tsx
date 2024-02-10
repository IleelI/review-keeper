import { CaretDown, CaretUp, CaretUpDown, Check } from "@phosphor-icons/react";
import * as RadixSelect from "@radix-ui/react-select";
import { ElementRef, forwardRef } from "react";
import { twJoin, twMerge } from "tailwind-merge";

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
      "flex items-center justify-between gap-4 rounded-lg border px-3 py-1.5 shadow-sm outline-none transition",
      "border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
      "enabled:hover:border-neutral-600 enabled:focus-visible:border-neutral-600 dark:enabled:hover:border-neutral-400 dark:enabled:focus-visible:border-neutral-400",
      "data-[placeholder]:text-neutral-400 dark:data-[placeholder]:text-neutral-500",
      "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40",
      "aria-[invalid=true]:border-red-700 dark:aria-[invalid=true]:border-red-300",
      className,
    ])}
    ref={ref}
    {...props}
  >
    {children}
    <RadixSelect.Icon asChild>
      <CaretUpDown
        className="text-neutral-700 dark:text-neutral-300"
        weight="bold"
      />
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
    className={twJoin("flex items-center justify-center px-2 py-1", className)}
    {...props}
  >
    <CaretUp />
  </RadixSelect.ScrollUpButton>
));
SelectScrollUpButton.displayName = RadixSelect.ScrollUpButton.displayName;

const SelectScrollDownButton = forwardRef<
  React.ElementRef<typeof RadixSelect.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof RadixSelect.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <RadixSelect.ScrollDownButton
    ref={ref}
    className={twJoin("flex items-center justify-center px-2 py-1", className)}
    {...props}
  >
    <CaretDown />
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
      collisionPadding = 16,
      position = "popper",
      sideOffset = 8,
      ...props
    },
    ref,
  ) => (
    <RadixSelect.Portal>
      <RadixSelect.Content
        className={twMerge(
          "relative overflow-hidden rounded-lg border shadow-md",
          "border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        collisionPadding={collisionPadding}
        position={position}
        ref={ref}
        sideOffset={sideOffset}
        {...props}
      >
        <SelectScrollUpButton />

        <RadixSelect.Viewport
          className={twJoin(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </RadixSelect.Viewport>

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
      "relative flex cursor-pointer items-center rounded py-1.5 pl-2 pr-8 outline-none",
      "data-[disabled]:cursor-not-allowed data-[highlighted]:bg-neutral-200 data-[highlighted]:text-neutral-700 data-[disabled]:opacity-40 dark:data-[highlighted]:bg-neutral-700 dark:data-[highlighted]:text-neutral-300",
      className,
    )}
    {...props}
  >
    <span className="absolute right-2 flex items-center justify-center">
      <RadixSelect.ItemIndicator>
        <Check weight="bold" />
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
      "-mx-1 my-1 h-px bg-neutral-400 dark:bg-neutral-600",
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
  <div className="flex flex-col items-center justify-center gap-2 p-2">
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
