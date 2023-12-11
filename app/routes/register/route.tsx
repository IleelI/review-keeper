import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form } from "@remix-run/react";

import InputField from "~/components/input-field/input-field";
import InputLabel from "~/components/input-label/input-label";
import {
  credentialsSchema,
  lookForUser,
  createRefreshToken,
  createAccessToken,
  login,
  createUser,
} from "~/server/auth.server";
import { prisma } from "~/server/db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();
    const parsedCredentials = credentialsSchema.safeParse(
      Object.fromEntries(formData),
    );
    if (!parsedCredentials.success) {
      return json({ type: "error", error: parsedCredentials.error });
    }
    const credentials = parsedCredentials.data;

    const existingUser = await lookForUser(credentials.email);
    if (existingUser) {
      return json({
        type: "error",
        error: "Account with this email already exists.",
      });
    }

    const user = await createUser(credentials);
    if (!user) {
      return json({
        type: "error",
        error: "Something went wrong while creating account.",
      });
    }

    const refreshToken = await createRefreshToken(user);
    const accessToken = await createAccessToken(user);
    await prisma.user.update({
      where: { email: user.email },
      data: { refreshToken },
    });

    return await login(refreshToken, accessToken);
  } catch {
    return json({ type: "error", error: "Something went wrong." });
  }
};

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
