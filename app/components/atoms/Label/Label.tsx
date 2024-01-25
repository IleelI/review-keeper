import clsx from "clsx";
import { ComponentPropsWithoutRef, ReactNode, forwardRef } from "react";

export type LabelProps = {
  children: ReactNode;
  isRequired?: boolean;
} & ComponentPropsWithoutRef<"label">;
const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { children, className, isRequired, ...props },
  ref,
) {
  return (
    <label
      className={clsx([
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
  );
});

export default Label;
