import type { ComponentPropsWithoutRef } from "react";

export type IconType = Omit<ComponentPropsWithoutRef<"svg">, "strokeWidth"> & {
  size?: number | string;
  strokeWidth?: number | string;
};
