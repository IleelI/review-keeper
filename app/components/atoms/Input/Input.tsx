import { ComponentPropsWithoutRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export type InputProps = ComponentPropsWithoutRef<"input">;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      className={twMerge([
        "rounded-xl border px-3 py-2 shadow-sm shadow-neutral-200 outline-none transition dark:shadow-none",
        "border-neutral-200 bg-neutral-50 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100",
        "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "enabled:hover:border-primary-700 enabled:focus-visible:border-primary-700 dark:enabled:hover:border-primary-300 dark:enabled:focus-visible:border-primary-300",
        "aria-[invalid=true]:border-red-700 dark:aria-[invalid=true]:border-red-300",
        className,
      ])}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export default Input;
