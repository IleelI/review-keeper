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
      "h-4 w-4 appearance-none rounded border border-neutral-200 bg-neutral-50 text-neutral-100 outline-offset-4 transition duration-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-900",
      "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40",
      "enabled:hover:border-priamry-700 enabled:focus-visible:border-primary-700 dark:enabled:hover:border-primary-300 dark:enabled:focus-visible:border-primary-300",
      "data-[state=checked]:border-primary-700 data-[state=checked]:bg-primary-700 data-[state=checked]:text-neutral-100 dark:data-[state=checked]:border-primary-300 dark:data-[state=checked]:bg-primary-300 dark:data-[state=checked]:text-neutral-900",
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
