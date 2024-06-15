import type { IconType } from "./Icon.type";

export const Number4SquareIcon = ({
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
      d="M13.5 16V8L9 13.5H15"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);
