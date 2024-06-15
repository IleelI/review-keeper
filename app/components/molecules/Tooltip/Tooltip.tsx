import * as RadixTooltip from "@radix-ui/react-tooltip";
import { TooltipProps } from "@radix-ui/react-tooltip";
import * as React from "react";
import { ComponentPropsWithoutRef, ElementRef } from "react";
import { twMerge } from "tailwind-merge";

const TooltipProvider = RadixTooltip.Provider;

const Tooltip = ({ children, ...props }: TooltipProps) => (
  <RadixTooltip.Root {...props}>{children}</RadixTooltip.Root>
);

const TooltipTrigger = RadixTooltip.Trigger;

const TooltipContent = React.forwardRef<
  ElementRef<typeof RadixTooltip.Content>,
  ComponentPropsWithoutRef<typeof RadixTooltip.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <RadixTooltip.Content
    ref={ref}
    sideOffset={sideOffset}
    className={twMerge(
      "z-50 overflow-hidden rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-neutral-700 dark:bg-neutral-800",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = RadixTooltip.Content.displayName;

Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;

export { Tooltip, TooltipProvider };
