import type { IconType } from "./Icon.type";

export const RestartIcon = ({
  size = 20,
  strokeWidth = 1.5,
  ...props
}: IconType) => (
  <svg
    width={size}
    height={size}
    strokeWidth={strokeWidth}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color="inherit"
    {...props}
  >
    <path
      d="M6.67742 20.5673C2.53141 18.0212 0.758026 12.7584 2.71678 8.1439C4.87472 3.0601 10.7453 0.68822 15.8291 2.84617C20.9129 5.00412 23.2848 10.8747 21.1269 15.9585C20.2837 17.945 18.8736 19.5174 17.1651 20.5673"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M17 16V20.4C17 20.7314 17.2686 21 17.6 21H22"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M12 22.01L12.01 21.9989"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);
