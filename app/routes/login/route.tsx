import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form } from "@remix-run/react";

import InputField from "~/components/input-field/input-field";
import InputLabel from "~/components/input-label/input-label";
import {
  comparePasswords,
  createAccessToken,
  createRefreshToken,
  credentialsSchema,
  login,
  lookForUser,
} from "~/server/auth.server";
import { prisma } from "~/server/db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();
    const parsedData = await credentialsSchema.safeParseAsync(
      Object.fromEntries(formData),
    );
    if (!parsedData.success) {
      return json({ type: "error", error: parsedData.error });
    }
    const credentials = parsedData.data;

    const user = await lookForUser(credentials.email);
    if (!user) {
      return json({ type: "error", error: "Email not found." });
    }

    const arePasswordsSame = await comparePasswords(
      credentials.password,
      user.hash,
    );
    if (!arePasswordsSame) {
      return json({ type: "error", error: "Incorrect password." });
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

export default function Login() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
        Log in page
      </h1>

      <Form className="flex max-w-xs flex-col gap-8" method="post">
        <fieldset className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <InputLabel name="email" label="Email" />
            <InputField name="email" />
          </div>
          <div className="flex flex-col gap-1.5">
            <InputLabel name="password" label="Password" />
            <InputField name="password" type="password" />
          </div>
        </fieldset>

        <div className="flex flex-col gap-1.5">
          <button
            className="rounded-md bg-neutral-900 p-2 text-center text-neutral-300 dark:bg-neutral-50 dark:text-neutral-700"
            type="submit"
          >
            Log in
          </button>
        </div>
      </Form>
    </div>
  );
}
