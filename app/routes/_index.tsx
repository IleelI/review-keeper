import { type MetaFunction } from "@remix-run/node";

import useUser from "~/hooks/useUser/useUser";

export const meta: MetaFunction = () => {
  return [
    { title: "Review Keeper" },
    { name: "description", content: "Welcome to Review Keeper!" },
  ];
};

export default function Index() {
  const user = useUser();

  return (
    <main className="grid min-h-[100dvh] w-full place-content-center px-8 py-6">
      {user ? (
        <h1 className="text-4xl font-extralight text-neutral-900 dark:text-neutral-100">
          Signed in as {""}
          <span className="text-primary-700 dark:text-primary-300">
            {user.username}
          </span>
        </h1>
      ) : (
        <h1 className="text-4xl font-bold">Not signed in.</h1>
      )}
    </main>
  );
}
