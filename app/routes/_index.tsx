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
    <article className="grid place-content-center">
      {user ? (
        <h1 className="text-4xl font-extralight text-neutral-900 dark:text-neutral-100">
          Signed in as {""}
          <span className="font-medium text-primary-700 dark:text-primary-300">
            {user.username}
          </span>
        </h1>
      ) : (
        <h1 className="text-4xl font-bold">Not signed in.</h1>
      )}
    </article>
  );
}
