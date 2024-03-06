import { twJoin } from "tailwind-merge";

import type { IconProps } from "./types";

export const ArrowLeftIcon = ({ className, weight = "32" }: IconProps) => (
  <svg
    className={twJoin("ionicon", className)}
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M244 400L100 256l144-144M120 256h292"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={weight}
    />
  </svg>
);
