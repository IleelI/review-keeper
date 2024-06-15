import type { IconType } from "./Icon.type";

export const StrikethroughIcon = ({
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
      d="M3 12L21 12"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M16.2857 3L10.068 3C7.82129 3 6 4.82129 6 7.06797C6 8.81895 7.12044 10.3735 8.78157 10.9272L12 12M6 21H13.932C16.1787 21 18 19.1787 18 16.932C18 16.2409 17.8255 15.5804 17.512 15"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);
