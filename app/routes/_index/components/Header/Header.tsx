interface HeaderProps {
  pageSize: number;
  totalItems: number;
}
const Header = ({ pageSize, totalItems }: HeaderProps) => {
  return (
    <section className="flex flex-col gap-1">
      <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
        Reviews
      </h2>
      <h3 className="text-sm text-neutral-600 dark:text-neutral-400">
        Showing {pageSize} out of {totalItems} reviews.
      </h3>
    </section>
  );
};

export default Header;
