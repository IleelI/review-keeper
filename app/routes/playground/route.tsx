import { House } from "@phosphor-icons/react";

import Input from "~/components/atoms/Input";
import Link from "~/components/atoms/Link";

const Playground = () => {
  return (
    <main className="flex min-h-[100dvh] w-full flex-col gap-10 px-8 py-6 lg:mx-auto lg:max-w-screen-sm lg:items-center lg:justify-center">
      <h1 className="text-3xl font-bold">Playground</h1>

      <div className="flex flex-col gap-4">
        <Link to="/playground" variant="filled">
          <House weight="bold" />
          Home
        </Link>
        <Link to="/playground" variant="outlined">
          <House weight="bold" />
          Playground
        </Link>
        <Link to="/somewhere" decoration="underline">
          Somewhere
        </Link>
      </div>
      <Input />
    </main>
  );
};

export default Playground;
