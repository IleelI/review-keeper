import { PropsWithChildren } from "react";

type AppTemplateProps = PropsWithChildren;

const AppTemplate = ({ children }: AppTemplateProps) => {
  return (
    <main className="grid min-h-[100dvh] grid-cols-[repeat(12,1fr)] grid-rows-[auto_1fr] gap-8 px-8 py-6 xl:mx-auto xl:max-w-screen-lg">
      {children}
    </main>
  );
};

export default AppTemplate;
