import type { IconType } from "./Icon.type";

export const UndoIcon = ({
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
      d="M4.5 8C8.5 8 11 8 15 8C15 8 15 8 15 8C15 8 20 8 20 12.7059C20 18 15 18 15 18C11.5714 18 9.71429 18 6.28571 18"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M7.5 11.5C6.13317 10.1332 5.36683 9.36683 4 8C5.36683 6.63317 6.13317 5.86683 7.5 4.5"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);
