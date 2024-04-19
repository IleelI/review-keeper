import * as RadixDialog from "@radix-ui/react-dialog";
import { Xmark } from "iconoir-react";
import {
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
} from "react";
import { twJoin, twMerge } from "tailwind-merge";

const Dialog = ({ children, ...props }: RadixDialog.DialogProps) => (
  <RadixDialog.Root {...props}>{children}</RadixDialog.Root>
);

const DialogTrigger = RadixDialog.Trigger;

const DialogPortal = RadixDialog.Portal;

const DialogClose = RadixDialog.Close;

const DialogOverlay = forwardRef<
  ElementRef<typeof RadixDialog.Overlay>,
  ComponentPropsWithoutRef<typeof RadixDialog.Overlay>
>(({ className, ...props }, ref) => (
  <RadixDialog.Overlay
    ref={ref}
    className={twJoin(
      "fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] data-[state=closed]:duration-300 data-[state=open]:duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = RadixDialog.Overlay.displayName;

const DialogContent = forwardRef<
  ElementRef<typeof RadixDialog.Content>,
  ComponentPropsWithoutRef<typeof RadixDialog.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <RadixDialog.Content
      ref={ref}
      className={twMerge(
        "fixed inset-x-0 bottom-0 z-40 flex w-full flex-col gap-4 rounded-b-none rounded-t-lg border border-neutral-200 bg-neutral-50 p-6 data-[state=closed]:duration-300 data-[state=open]:duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%] md:bottom-1/2 md:left-1/2 md:max-w-lg md:-translate-x-1/2 md:translate-y-1/2 md:rounded-md md:shadow-lg md:data-[state=closed]:slide-out-to-left-1/2 md:data-[state=open]:slide-in-from-left-1/2 dark:border-neutral-800 dark:bg-neutral-900",
        className,
      )}
      {...props}
    >
      {children}
      <RadixDialog.Close className="focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-2 top-2 rounded-sm opacity-70 ring-offset-neutral-50 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none dark:ring-offset-neutral-900">
        <Xmark className="h-6 w-6" />
        <span className="sr-only">Close</span>
      </RadixDialog.Close>
    </RadixDialog.Content>
  </DialogPortal>
));
DialogContent.displayName = RadixDialog.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <header
    className={twJoin(
      "flex flex-col gap-1 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <footer
    className={twJoin(
      "flex flex-col gap-4 sm:flex-row sm:justify-end",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = forwardRef<
  ElementRef<typeof RadixDialog.Title>,
  ComponentPropsWithoutRef<typeof RadixDialog.Title>
>(({ className, ...props }, ref) => (
  <RadixDialog.Title
    ref={ref}
    className={twJoin(
      "text-xl font-medium text-neutral-800 dark:text-neutral-200",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = RadixDialog.Title.displayName;

const DialogDescription = forwardRef<
  ElementRef<typeof RadixDialog.Description>,
  ComponentPropsWithoutRef<typeof RadixDialog.Description>
>(({ className, ...props }, ref) => (
  <RadixDialog.Description
    className={twMerge(
      "text-sm text-neutral-600 dark:text-neutral-400",
      className,
    )}
    ref={ref}
    {...props}
  />
));
DialogDescription.displayName = RadixDialog.Description.displayName;

Dialog.Portal = DialogPortal;
Dialog.Overlay = DialogOverlay;
Dialog.Trigger = DialogTrigger;
Dialog.Close = DialogClose;
Dialog.Content = DialogContent;
Dialog.Header = DialogHeader;
Dialog.Footer = DialogFooter;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;

export default Dialog;
