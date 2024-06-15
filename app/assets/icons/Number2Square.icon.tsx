import type { IconType } from "./Icon.type";

export const Number2SquareIcon = ({
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
      d="M9.5 10.8V10.4C9.5 9.07452 10.5332 8 11.8077 8C13.0822 8 14.1154 9.07452 14.1154 10.4C14.1154 10.857 13.9926 11.2841 13.7794 11.6476C12.7289 13.4396 9.5 16 9.5 16H14.5"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);
