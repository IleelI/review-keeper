import { Check } from "@phosphor-icons/react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const Checkbox = forwardRef<
  ElementRef<typeof RadixCheckbox.Root>,
  ComponentPropsWithoutRef<typeof RadixCheckbox.Root>
>(({ className, ...props }, ref) => (
  <RadixCheckbox.Root
    className={twMerge([
      "h-4 w-4 appearance-none rounded border border-neutral-700 bg-transparent text-neutral-100 outline-offset-4 transition duration-300 dark:border-neutral-300 dark:text-neutral-900",
      "data-[state=checked]:border-neutral-900 data-[state=checked]:bg-neutral-900 data-[state=checked]:text-neutral-100 dark:data-[state=checked]:border-neutral-100 dark:data-[state=checked]:bg-neutral-100 dark:data-[state=checked]:text-neutral-900",
      "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40",
      "enabled:hover:backdrop-brightness-95 enabled:focus-visible:backdrop-brightness-95 dark:enabled:hover:backdrop-brightness-150 dark:enabled:focus-visible:backdrop-brightness-150",
      className,
    ])}
    ref={ref}
    {...props}
  >
    <RadixCheckbox.Indicator className="*:h-full *:w-full">
      <Check weight="bold" />
    </RadixCheckbox.Indicator>
  </RadixCheckbox.Root>
));
Checkbox.displayName = "Checkbox";

export default Checkbox;
