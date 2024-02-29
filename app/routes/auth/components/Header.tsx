interface HeaderProps {
  title: string;
  firstMessage: string;
  secondMessage: string;
}
const Header = ({ firstMessage, secondMessage, title }: HeaderProps) => {
  return (
    <header className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold text-neutral-900 lg:text-3xl dark:text-neutral-100">
        {title}
      </h1>
      <p className="leading-tight text-neutral-500 lg:text-lg">
        {firstMessage}
      </p>
      <p className="leading-tight text-neutral-500 lg:text-lg">
        {secondMessage}
      </p>
    </header>
  );
};

export default Header;
