import { twJoin } from "tailwind-merge";

import type { IconProps } from "./types";

export const ChevronExpandIcon = ({ className, weight = "32" }: IconProps) => (
  <svg
    className={twJoin("ionicon", className)}
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M136 208l120-104 120 104M136 304l120 104 120-104"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={weight}
    />
  </svg>
);
