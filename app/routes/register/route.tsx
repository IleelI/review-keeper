import { ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";

import InputField from "~/components/input-field/input-field";
import InputLabel from "~/components/input-label/input-label";

import { handleRegister } from "./action.server";

export const action = async ({ request }: ActionFunctionArgs) =>
  await handleRegister(request);

export default function Register() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
        Register page
      </h1>

      <Form className="flex max-w-xs flex-col gap-8" method="post">
        <fieldset className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <InputLabel label="Email" name="email" />
            <InputField name="email" />
          </div>
          <div className="flex flex-col gap-1.5">
            <InputLabel label="Password" name="password" />
            <InputField name="password" type="password" />
          </div>
        </fieldset>

        <div className="flex flex-col gap-1.5">
          <button
            className="rounded-md bg-neutral-900 px-4 py-1.5 text-center text-neutral-300 dark:bg-neutral-50 dark:text-neutral-700"
            type="submit"
          >
            Register
          </button>
        </div>
      </Form>
    </div>
  );
}
