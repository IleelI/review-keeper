import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { createAccount, credentialsSchema } from "~/server/auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = Object.fromEntries((await request.formData()) ?? []);
  const parsedData = credentialsSchema.safeParse(formData);
  if (!parsedData.success) {
    return json(
      { origin: "form", error: parsedData.error.flatten() } as const,
      { status: 400, statusText: "Invalid credentials." },
    );
  }

  const credentials = parsedData.data;
  const response = await createAccount(credentials);
  if (response.type === "error") {
    return json({ origin: response.origin, error: response.message } as const, {
      status: response.origin === "server" ? 500 : 400,
      statusText: response.message,
    });
  }
  console.log({ response });
  return json({});
};

export default function Register() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
        Register page
      </h1>
      <Form
        className="flex max-w-xs flex-col gap-8"
        method="post"
        encType="application/x-www-form-urlencoded"
      >
        <fieldset className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input
              className="rounded-md bg-neutral-100 px-4 py-1.5 dark:bg-neutral-900"
              id="email"
              name="email"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <input
              className="rounded-md bg-neutral-100 px-4 py-1.5 dark:bg-neutral-900"
              id="password"
              name="password"
              type="password"
            />
          </div>
        </fieldset>
        <button
          className="rounded-md bg-neutral-900 px-4 py-1.5 text-center text-neutral-300 dark:bg-neutral-50 dark:text-neutral-700"
          type="submit"
        >
          Register
        </button>
      </Form>
    </div>
  );
}
