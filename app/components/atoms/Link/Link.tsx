import { NavLink, type NavLinkProps } from "@remix-run/react";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ElementRef } from "react";

type LinkProps = NavLinkProps & LinkStyles;
const Link = forwardRef<ElementRef<typeof NavLink>, LinkProps>(
  ({ children, className, size, variant, ...props }, ref) => {
    return (
      <NavLink
        className={linkStyles({ className, size, variant })}
        ref={ref}
        {...props}
      >
        {children}
      </NavLink>
    );
  },
);
Link.displayName = "Link";

export default Link;

type LinkStyles = VariantProps<typeof linkStyles>;
const linkStyles = cva(
  "min-w-max w-auto h-auto inline-flex gap-1.5 justify-center items-center transition",
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        custom: "",
      },
      variant: {
        button: [
          "font-medium outline-offset-4 bg-primary-700 text-neutral-100 dark:bg-primary-300 dark:text-neutral-900",
          "hover:bg-primary-600 ring-transparent outline-offset-2 dark:hover:bg-primary-400 focus-visible:bg-primary-600 dark:focus-visible:bg-primary-400",
        ],
        buttonGhost: [
          "font-medium text-neutral-800 dark:text-neutral-200",
          "hover:backdrop-brightness-95 focus-visible:backdrop-brightness-95 active:backdrop-brightness-85 dark:hover:backdrop-brightness-150 dark:focus-visible:backdrop-brightness-150 dark:active:backdrop-brightness-200",
        ],
        buttonSecondary: [
          "font-medium bg-transparent border border-neutral-700 text-neutral-700 dark:border-neutral-300 dark:text-neutral-300",
          "hover:backdrop-brightness-95 focus-visible:backdrop-brightness-95 active:backdrop-brightness-85 dark:hover:backdrop-brightness-150 dark:focus-visible:backdrop-brightness-150 dark:active:backdrop-brightness-200",
        ],
        navigation: [
          "text-neutral-800 dark:text-neutral-200",
          "hover:text-primary-700 dark:hover:text-primary-300 focus-visible:text-primary-700 dark:focus-visible:text-primary-300 hover:backdrop-brightness-95 focus-visible:backdrop-brightness-95 active:backdrop-brightness-85 dark:hover:backdrop-brightness-150 dark:focus-visible:backdrop-brightness-150 dark:active:backdrop-brightness-200",
          "[&.active]:text-primary-700 dark:[&.active]:text-primary-300",
        ],
        text: [
          "rounded underline underline-offset-2",
          "hover:text-primary-700 dark:hover:text-primary-300 focus-visible:text-primary-700 dark:focus-visible:text-primary-300",
        ],
        custom: "",
      },
    },
    compoundVariants: [
      { size: "sm", variant: "button", className: "px-4 py-1 rounded-md" },
      { size: "md", variant: "button", className: "px-4 py-1.5 rounded-md" },
      { size: "lg", variant: "button", className: "px-6 py-1.5 rounded-md" },

      { size: "sm", variant: "buttonGhost", className: "px-4 py-1 rounded" },
      {
        size: "md",
        variant: "buttonGhost",
        className: "px-4 py-1.5 rounded-md",
      },
      {
        size: "lg",
        variant: "buttonGhost",
        className: "px-6 py-1.5 rounded-md",
      },

      {
        size: "sm",
        variant: "buttonSecondary",
        className: "px-4 py-1 rounded",
      },
      {
        size: "md",
        variant: "buttonSecondary",
        className: "px-4 py-1.5 rounded-md",
      },
      {
        size: "lg",
        variant: "buttonGhost",
        className: "px-6 py-1.5 rounded-md",
      },

      { size: "sm", variant: "navigation", className: "px-4 py-1 rounded" },
      {
        size: "md",
        variant: "navigation",
        className: "px-4 py-1.5 rounded-md",
      },
      {
        size: "lg",
        variant: "navigation",
        className: "px-6 py-1.5 rounded-md",
      },
    ],
    defaultVariants: {
      size: "md",
      variant: "text",
    },
  },
);
