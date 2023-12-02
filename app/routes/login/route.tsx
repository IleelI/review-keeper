import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";

import { getSafeRedirectPath } from "utils/auth";
import { isErrorResponse } from "utils/server";
import InputError from "~/components/input-error/input-error";
import InputField from "~/components/input-field/input-field";
import InputLabel from "~/components/input-label/input-label";
import {
  createJWT,
  login,
  validateCredentials,
  getTokenizedUser,
} from "~/server/auth.server";

import { verifyUser } from "./login.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const tokenizedUser = await getTokenizedUser(request);
  return tokenizedUser ? redirect("/") : json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const clonedRequest = request.clone();
  const validationResponse = await validateCredentials(request);
  if (isErrorResponse(validationResponse)) {
    return json({
      type: "invalid-form" as const,
      error: validationResponse.error,
    });
  }

  const credentials = validationResponse.data;
  const verifyResponse = await verifyUser(credentials);
  if (isErrorResponse(verifyResponse)) {
    const { error, origin } = verifyResponse.error;
    return json({
      type: "invalid-identity" as const,
      error: {
        email: origin === "email" ? error : undefined,
        password: origin === "password" ? error : undefined,
        other: origin === "other" ? error : undefined,
      },
    });
  }

  const user = verifyResponse.data;
  const JWTToken = await createJWT(user);
  const formData = await clonedRequest.formData();
  const redirectPath = getSafeRedirectPath(formData.get("redirectPath"));
  return await login(JWTToken, redirectPath);
};

const useLoginPage = () => {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirectPath") ?? "/";

  const formFieldsErrors =
    actionData?.type === "invalid-form" ? actionData.error : null;
  const identityErrors =
    actionData?.type === "invalid-identity" ? actionData.error : null;

  const emailError = (formFieldsErrors?.email || identityErrors?.email) ?? null;
  const passwordError =
    (formFieldsErrors?.password || identityErrors?.password) ?? null;
  const otherError = identityErrors?.other ?? null;

  return {
    emailError,
    otherError,
    redirectPath,
    passwordError,
  };
};

export default function Login() {
  const { emailError, otherError, redirectPath, passwordError } =
    useLoginPage();

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
            {emailError ? <InputError error={emailError} /> : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <InputLabel name="password" label="Password" />
            <InputField name="password" type="password" />
            {passwordError ? <InputError error={passwordError} /> : null}
          </div>
          <input type="hidden" name="redirectPath" value={redirectPath} />
        </fieldset>

        <div className="flex flex-col gap-1.5">
          <button
            className="rounded-md bg-neutral-900 p-2 text-center text-neutral-300 dark:bg-neutral-50 dark:text-neutral-700"
            type="submit"
          >
            Log in
          </button>
          {otherError ? <InputError error={otherError} /> : null}
        </div>
      </Form>
    </div>
  );
}
