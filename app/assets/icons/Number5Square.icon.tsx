import type { IconType } from "./Icon.type";

export const Number5SquareIcon = ({
  size = 20,
  strokeWidth = 1.5,
  ...props
}: IconType) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color="inherit"
    {...props}
  >
    <path
      d="M3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4Z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    ></path>
    <path
      d="M9.5 14C9.5 15.1046 10.6193 16 12 16C13.3807 16 14.5 15 14.5 13.5C14.5 12 13.8807 11 12.5 11H9.5L10 8H14"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);
