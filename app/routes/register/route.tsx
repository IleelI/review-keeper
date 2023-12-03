import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { isErrorResponse } from "utils/server";
import InputError from "~/components/input-error/input-error";
import InputField from "~/components/input-field/input-field";
import InputLabel from "~/components/input-label/input-label";
import {
  login,
  validateCredentials,
  getTokenizedUser,
  generateAuthTokens,
} from "~/server/auth.server";

import { registerUser } from "./register.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const tokenizedUser = await getTokenizedUser(request);
  return tokenizedUser ? redirect("/") : json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const validationResponse = await validateCredentials(request);
  if (isErrorResponse(validationResponse)) {
    return json({
      type: "form-error" as const,
      error: validationResponse.error,
    });
  }

  const credentials = validationResponse.data;
  const registerUserResponse = await registerUser(credentials);
  if (isErrorResponse(registerUserResponse)) {
    const { error, origin } = registerUserResponse.error;
    return json({
      type: "identity-error" as const,
      error: {
        email: origin === "email" ? error : undefined,
        other: origin === "other" ? error : undefined,
      },
    });
  }

  const user = registerUserResponse.data;
  const { accessToken, refreshToken } = await generateAuthTokens(user);
  return await login(accessToken, refreshToken);
};

const useRegisterPage = () => {
  const actionData = useActionData<typeof action>();

  const formFieldErrors =
    actionData?.type === "form-error" ? actionData.error : undefined;
  const identityError =
    actionData?.type === "identity-error" ? actionData.error : undefined;

  const emailError = (formFieldErrors?.email || identityError?.email) ?? null;
  const passwordError = formFieldErrors?.password ?? null;
  const otherError = identityError?.other ?? null;

  return {
    emailError,
    otherError,
    passwordError,
  };
};

export default function Register() {
  const { emailError, otherError, passwordError } = useRegisterPage();

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
            {emailError ? <InputError error={emailError} /> : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <InputLabel label="Password" name="password" />
            <InputField name="password" type="password" />
            {passwordError ? <InputError error={passwordError} /> : null}
          </div>
        </fieldset>

        <div className="flex flex-col gap-1.5">
          <button
            className="rounded-md bg-neutral-900 px-4 py-1.5 text-center text-neutral-300 dark:bg-neutral-50 dark:text-neutral-700"
            type="submit"
          >
            Register
          </button>
          {otherError ? <InputError error={otherError} /> : null}
        </div>
      </Form>
    </div>
  );
}
