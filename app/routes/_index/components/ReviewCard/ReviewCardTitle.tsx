interface ReviewCardTitleProps {
  title: string;
}
const ReviewCardTitle = ({ title }: ReviewCardTitleProps) => (
  <h2 className="line-clamp-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
    {title}
  </h2>
);

export default ReviewCardTitle;
