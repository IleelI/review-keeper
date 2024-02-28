import { ElementType, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type GlassCardProps = PropsWithChildren<{
  as?: ElementType<{ className: string }>;
  className?: string;
}>;

const GlassCard = ({
  as: Tag = "article",
  children,
  className,
}: GlassCardProps) => (
  <Tag
    className={twMerge(
      "relative rounded-2xl border border-neutral-300 bg-neutral-50 bg-opacity-55 backdrop-blur-2xl dark:border-neutral-800 dark:bg-neutral-950 dark:bg-opacity-45",
      className,
    )}
  >
    {children}
  </Tag>
);

export default GlassCard;
