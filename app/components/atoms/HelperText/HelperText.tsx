import clsx from "clsx";
import { ComponentPropsWithoutRef, forwardRef } from "react";

export type HelperTextProps = {
  isError?: boolean;
} & ComponentPropsWithoutRef<"p">;
const HelperText = forwardRef<HTMLParagraphElement, HelperTextProps>(
  function HelperText({ className, children, isError, ...props }, ref) {
    return (
      <p
        className={clsx([
          "text-sm",
          isError
            ? "font-medium text-red-700 dark:text-red-300"
            : "text-neutral-500 dark:text-neutral-500",
          className,
        ])}
        ref={ref}
        {...props}
      >
        {children}
      </p>
    );
  },
);

export default HelperText;
