import clsx from "clsx";
import { ComponentPropsWithoutRef, forwardRef } from "react";

export type InputProps = {
  isError?: boolean;
} & ComponentPropsWithoutRef<"input">;
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, isError, ...props },
  ref,
) {
  return (
    <input
      className={clsx([
        "rounded-lg border px-3 py-1.5 outline-none transition-colors duration-200",
        "bg-white text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
        "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "enabled:hover:border-neutral-700 dark:enabled:hover:border-neutral-300",
        "enabled:focus-visible:border-primary-700 dark:enabled:focus-visible:border-primary-300",
        isError
          ? "border-red-700 dark:border-red-300"
          : "border-neutral-200 dark:border-neutral-700",
        className,
      ])}
      ref={ref}
      {...props}
    />
  );
});

export default Input;
