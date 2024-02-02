import { ComponentPropsWithoutRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export type LabelProps = {
  isRequired?: boolean;
} & ComponentPropsWithoutRef<"label">;

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, className, isRequired, ...props }, ref) => (
    <label
      className={twMerge([
        "flex items-baseline gap-1 leading-none text-neutral-700 dark:text-neutral-300",
        isRequired &&
          "after:text-red-700 after:content-['*'] dark:after:text-red-300",
        className,
      ])}
      ref={ref}
      {...props}
    >
      {children}
    </label>
  ),
);
Label.displayName = "Label";

export default Label;
