interface ReviewTitleProps {
  title: string;
}
const ReviewTitle = ({ title }: ReviewTitleProps) => (
  <h1 className="font-serif text-3xl font-bold text-neutral-900 dark:text-neutral-100">
    {title}
  </h1>
);

export default ReviewTitle;
