import { forwardRef } from "react";

import type { IconType } from "./Icon.type";

export const CheckIcon = forwardRef<SVGSVGElement, IconType>(
  ({ size = 20, strokeWidth = 1.5, ...props }, ref) => (
    <svg
      width={size}
      height={size}
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color="inherit"
      ref={ref}
      {...props}
    >
      <path
        d="M5 13L9 17L19 7"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  ),
);
CheckIcon.displayName = "CheckIcon";
