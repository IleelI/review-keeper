import {
  NavLink as RemixLink,
  NavLinkProps as RemixLinkProps,
} from "@remix-run/react";
import { VariantProps, cva } from "class-variance-authority";
import { ElementRef, forwardRef } from "react";

type LinkProps = {
  animatePendingState?: boolean;
} & Pick<LinkStyles, "decoration" | "variant"> &
  RemixLinkProps;

const Link = forwardRef<ElementRef<typeof RemixLink>, LinkProps>(
  (
    {
      animatePendingState = false,
      children,
      className,
      decoration,
      variant,
      ...props
    },
    ref,
  ) => (
    <RemixLink
      className={({ isActive, isPending, isTransitioning }) =>
        linkStyles({
          className:
            className instanceof Function
              ? className({ isActive, isPending, isTransitioning })
              : className,
          decoration,
          navigationState: getNavigationState(
            isActive,
            isPending,
            animatePendingState,
          ),
          variant,
        })
      }
      ref={ref}
      {...props}
    >
      {children}
    </RemixLink>
  ),
);
Link.displayName = "Link";

export default Link;

type LinkStyles = VariantProps<typeof linkStyles>;
const linkStyles = cva("h-full items-center font-medium transition", {
  variants: {
    decoration: {
      none: "",
      underline: "underline underline-offset-4",
    },
    navigationState: {
      active: "duration-300",
      base: "duration-300",
      pending: "animate-pulse cursor-wait grayscale duration-1000",
    },
    variant: {
      text: "inline-block w-max p-1 text-primary-700 hover:text-primary-600 focus-visible:text-primary-600 dark:text-primary-300 dark:hover:text-primary-400 dark:focus-visible:text-primary-400",
      muted:
        "inline-block w-max p-1 text-neutral-500 hover:text-primary-600 focus-visible:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 dark:focus-visible:text-primary-400",
      filled: [
        "flex gap-2 px-3 py-1.5 justify-center rounded-lg outline-offset-4 bg-primary-700 text-neutral-100 dark:bg-primary-300 dark:text-neutral-900",
        "hover:bg-primary-800 focus-visible:bg-primary-800 active:bg-primary-700 dark:hover:bg-primary-400 dark:focus-visible:bg-primary-400 dark:active:bg-primary-300",
      ],
      outlined: [
        "flex gap-2 px-3 py-1.5 justify-center rounded-lg outline-offset-4 bg-transparent border border-neutral-700 text-neutral-700 dark:border-neutral-300 dark:text-neutral-300",
        "hover:backdrop-brightness-95 focus-visible:backdrop-brightness-95 active:backdrop-brightness-85 dark:hover:backdrop-brightness-150 dark:focus-visible:backdrop-brightness-150 dark:active:backdrop-brightness-200",
      ],
    },
  },
  compoundVariants: [
    {
      variant: "text",
      navigationState: "active",
      className:
        "text-primary-700 hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-400",
    },
  ],
  defaultVariants: {
    decoration: "none",
    navigationState: "base",
    variant: "text",
  },
});

export const getNavigationState = (
  isActive: boolean,
  isPending: boolean,
  animatePendingState: boolean,
): LinkStyles["navigationState"] => {
  switch (true) {
    case isPending && animatePendingState:
      return "pending";
    case isActive:
      return "active";
    default:
      return "base";
  }
};
