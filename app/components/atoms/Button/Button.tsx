import { VariantProps, cva } from "class-variance-authority";
import { ComponentPropsWithoutRef, forwardRef } from "react";

type ButtonStyles = VariantProps<typeof buttonStyles>;
export const buttonStyles = cva(
  "w-full flex gap-1.5 justify-center items-center rounded-lg font-medium leading-relaxed tracking-wide transition duration-300 outline-offset-4 disabled:opacity-40 disabled:cursor-not-allowed",
  {
    variants: {
      intent: {
        primary: [
          "bg-neutral-800 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900",
          "enabled:hover:bg-neutral-950 enabled:focus-visible:bg-neutral-950 enabled:active:bg-neutral-800 dark:enabled:hover:bg-neutral-300 dark:enabled:focus-visible:bg-neutral-300 dark:enabled:active:bg-neutral-100",
        ],
        secondary: [
          "bg-transparent border border-neutral-700 text-neutral-700 dark:border-neutral-300 dark:text-neutral-300",
          "enabled:hover:backdrop-brightness-95 enabled:focus-visible:backdrop-brightness-95 enabled:active:backdrop-brightness-85 dark:enabled:hover:backdrop-brightness-150 dark:enabled:focus-visible:backdrop-brightness-150 dark:enabled:active:backdrop-brightness-200",
        ],
        info: [
          "bg-blue-700 text-neutral-100 dark:bg-blue-400 dark:text-neutral-900",
          "enabled:hover:bg-blue-800 enabled:focus-visible:bg-blue-800 enabled:active:bg-blue-700 dark:enabled:hover:bg-blue-500 dark:enabled:focus-visible:bg-blue-500 dark:enabled:active:bg-blue-400",
        ],
        success: [
          "bg-green-700 text-neutral-100 dark:bg-green-400 dark:text-neutral-900",
          "enabled:hover:bg-green-800 enabled:focus-visible:bg-green-800 enabled:active:bg-green-700 dark:enabled:hover:bg-green-500 dark:enabled:focus-visible:bg-green-500 dark:enabled:active:bg-green-400",
        ],
        warning: [
          "bg-orange-700 text-neutral-100 dark:bg-orange-400 dark:text-neutral-900",
          "enabled:hover:bg-orange-800 enabled:focus-visible:bg-orange-800 enabled:active:bg-orange-700 dark:enabled:hover:bg-orange-500 dark:enabled:focus-visible:bg-orange-500 dark:enabled:active:bg-orange-400",
        ],
        danger: [
          "bg-red-700 text-neutral-100 dark:bg-red-400 dark:text-neutral-900",
          "enabled:hover:bg-red-800 enabled:focus-visible:bg-red-800 enabled:active:bg-red-700 dark:enabled:hover:bg-red-500 dark:enabled:focus-visible:bg-red-500 dark:enabled:active:bg-red-400",
        ],
        text: [
          "text-neutral-900 dark:text-neutral-100 underline underline-offset-2",
          "enabled:hover:backdrop-brightness-95 enabled:focus-visible:backdrop-brightness-95 enabled:active:backdrop-brightness-85 dark:enabled:hover:backdrop-brightness-150 dark:enabled:focus-visible:backdrop-brightness-150 dark:enabled:active:backdrop-brightness-200",
        ],
      },
      size: {
        sm: ["px-2.5 py-1 font-semibold text-sm"],
        md: ["px-4 py-1.5"],
        lg: ["px-5 py-2 text-lg"],
        none: [""],
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ButtonStyles & ComponentPropsWithoutRef<"button">;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, intent, size, type = "button", ...props }, ref) => (
    <button
      className={buttonStyles({ className, intent, size })}
      ref={ref}
      type={type}
      {...props}
    >
      {children}
    </button>
  ),
);
Button.displayName = "Button";

export default Button;
