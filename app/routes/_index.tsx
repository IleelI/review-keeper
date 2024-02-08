import { type MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";

import Button from "~/components/atoms/Button";
import Link from "~/components/atoms/Link";
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
    <main className="flex min-h-[100dvh] w-full flex-col px-8 py-6 lg:mx-auto lg:max-w-screen-sm lg:items-center lg:justify-center">
      <div className="flex flex-col gap-8 rounded-lg bg-white p-8 shadow-md dark:bg-neutral-800">
        <h1 className="text-3xl font-bold">Welcome to Review Keeper!</h1>

        <Link decoration="underline" to="/playground">
          Playground
        </Link>

        {user ? (
          <div className="grid w-full grid-cols-2 items-center gap-4">
            <Form action="/sign-out" method="post">
              <Button type="submit" intent="secondary">
                Log out
              </Button>
            </Form>
            <Link to="/review/new" variant="filled">
              Create a new review
            </Link>
          </div>
        ) : (
          <section className="grid w-full grid-cols-2 items-center gap-4">
            <Link to="/sign-up" variant="outlined">
              Sign up
            </Link>
            <Link to="/sign-in" variant="filled">
              Sign in
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
