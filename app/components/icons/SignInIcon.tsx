import { twJoin } from "tailwind-merge";

import type { IconProps } from "./types";

export const SignInIcon = ({ className, weight = "32" }: IconProps) => (
  <svg
    className={twJoin("ionicon", className)}
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M192 176v-40a40 40 0 0140-40h160a40 40 0 0140 40v240a40 40 0 01-40 40H240c-22.09 0-48-17.91-48-40v-40"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={weight}
    />
    <path
      d="M288 336l80-80-80-80M80 256h272"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={weight}
    />
  </svg>
);
