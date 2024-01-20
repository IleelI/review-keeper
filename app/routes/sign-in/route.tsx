import {
  ActionFunctionArgs,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";

import InputError from "~/components/ atoms/InputError/InputError";
import InputField from "~/components/ atoms/InputField/InputField";
import InputLabel from "~/components/ atoms/InputLabel/InputLabel";
import {
  comparePasswords,
  createAccessToken,
  createRefreshToken,
  credentialsSchema,
  signIn,
  lookForUser,
  getUser,
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
    const redirectTo = formData.get("redirectTo");
    const rememberMe = Boolean(formData.get("rememberMe"));
    const parsedData = await credentialsSchema.safeParseAsync(
      Object.fromEntries(formData),
    );
    if (!parsedData.success) {
      return createActionError({ ...parsedData.error.flatten().fieldErrors });
    }
    const credentials = parsedData.data;

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

    const refreshToken = await createRefreshToken(user, rememberMe);
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

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (user) return redirect("/");
  return null;
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
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
          <div className="flex items-center gap-1.5">
            <input
              className="relative h-6 w-6 appearance-none overflow-hidden rounded-md border border-neutral-300 bg-neutral-100 after:absolute after:left-1/2 after:top-1/2 after:h-1/2 after:w-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-sm after:bg-transparent after:transition-colors after:content-[''] checked:after:bg-primary-700 dark:border-neutral-700 dark:bg-neutral-900 checked:dark:after:bg-primary-300"
              defaultChecked
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo || "/"} />
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
              className="text-primary-600 underline underline-offset-4 dark:text-primary-400"
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
