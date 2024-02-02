import { ComponentPropsWithoutRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export type InputProps = ComponentPropsWithoutRef<"input">;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      className={twMerge([
        "rounded-lg border px-3 py-1.5 outline-none transition",
        "border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200",
        "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "enabled:hover:border-neutral-600 enabled:focus-visible:border-neutral-600 dark:enabled:hover:border-neutral-400 dark:enabled:focus-visible:border-neutral-400",
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
