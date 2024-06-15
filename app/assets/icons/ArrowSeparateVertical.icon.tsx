import { forwardRef } from "react";

import type { IconType } from "./Icon.type";

export const ArrowSeparateVerticalIcon = forwardRef<SVGSVGElement, IconType>(
  ({ className, size = 20, strokeWidth = 1.5, ...props }: IconType) => {
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        strokeWidth={strokeWidth}
        fill="inherit"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M17 8L12 3L7 8"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M17 16L12 21L7 16"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    );
  },
);
ArrowSeparateVerticalIcon.displayName = "ArrowSeparateVerticalIcon";
