import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";

import InputError from "~/components/input-error/input-error";
import InputField from "~/components/input-field/input-field";
import InputLabel from "~/components/input-label/input-label";
import {
  comparePasswords,
  createAccessToken,
  createRefreshToken,
  credentialsSchema,
  signIn,
  lookForUser,
} from "~/server/auth.server";
import { prisma } from "~/server/db.server";
import { safeRedirect } from "~/utils/utils";

interface ActionError {
  email?: string | string[];
  password?: string | string[];
  other?: string;
}
const createActionError = (error: ActionError) => json({ error });

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();
    const parsedData = await credentialsSchema.safeParseAsync(
      Object.fromEntries(formData),
    );
    if (!parsedData.success) {
      return createActionError({ ...parsedData.error.flatten().fieldErrors });
    }
    const { redirectTo, ...credentials } = parsedData.data;

    const user = await lookForUser(credentials.email);
    if (!user) {
      return createActionError({ email: "Email not found." });
    }

    const arePasswordsSame = await comparePasswords(
      credentials.password,
      user.hash,
    );
    if (!arePasswordsSame) {
      return createActionError({ password: "Incorrect password." });
    }

    const refreshToken = await createRefreshToken(user);
    const accessToken = await createAccessToken(user);
    await prisma.user.update({
      where: { email: user.email },
      data: { refreshToken },
    });

    return await signIn(refreshToken, accessToken, safeRedirect(redirectTo));
  } catch {
    return createActionError({
      other: "Something went wrong while logging in.",
    });
  }
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const actionData = useActionData<typeof action>();
  const emailError = actionData?.error.email;
  const passwordError = actionData?.error.password;
  const otherError = actionData?.error.other;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
        Sign in page
      </h1>

      <Form className="flex max-w-xs flex-col gap-8" method="post">
        <fieldset className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <InputLabel name="email" label="Email" />
            <InputField name="email" />
            {emailError ? <InputError error={emailError} /> : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <InputLabel name="password" label="Password" />
            <InputField name="password" type="password" />
            {passwordError ? <InputError error={passwordError} /> : null}
          </div>
          <input type="hidden" name="redirectTo" value={redirectTo} />
        </fieldset>

        <div className="flex flex-col gap-1.5">
          <button
            className="rounded-md bg-neutral-900 p-2 text-center text-neutral-300 dark:bg-neutral-50 dark:text-neutral-700"
            type="submit"
          >
            Sign in
          </button>
          <small>
            Don&apos;t have an account?{" "}
            <Link
              className="text-primary-600 dark:text-primary-400 underline underline-offset-4"
              to={`/sign-up?${searchParams}`}
            >
              Sign up here.
            </Link>
          </small>
          {otherError ? <InputError error={otherError} /> : null}
        </div>
      </Form>
    </div>
  );
}
