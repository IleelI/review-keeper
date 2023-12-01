import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { jwtVerify } from "jose";

import { isErrorResponse } from "utils/server";
import InputError from "~/components/input-error/input-error";
import InputField from "~/components/input-field/input-field";
import InputLabel from "~/components/input-label/input-label";
import {
  JWTCookie,
  createJWT,
  validateCredentials,
} from "~/server/auth.server";
import { env } from "~/server/env.server";

import { identifyUser } from "./login.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await JWTCookie.parse(cookieHeader)) || {};

  // TODO -> Add generic handler for this
  if ("token" in cookie) {
    try {
      const secret = new TextEncoder().encode(env().JWT_SECRET);
      await jwtVerify(cookie.token, secret, {
        issuer: "review-keeper",
        audience: "review-keeper",
      });
      return redirect("/");
    } catch (error) {
      console.log("Invalid JWT");
    }
  }

  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const validationResponse = await validateCredentials(request);
  if (isErrorResponse(validationResponse)) {
    return json({
      type: "invalid-form" as const,
      error: validationResponse.error,
    });
  }

  const credentials = validationResponse.data;
  const identifyResponse = await identifyUser(credentials);
  if (isErrorResponse(identifyResponse)) {
    const { error, origin } = identifyResponse.error;
    return json({
      type: "invalid-identity" as const,
      error: {
        email: origin === "email" ? error : undefined,
        password: origin === "password" ? error : undefined,
        other: origin === "other" ? error : undefined,
      },
    });
  }

  const user = identifyResponse.data;
  const JWTToken = await createJWT(user);
  return redirect("/", {
    headers: {
      "Set-Cookie": await JWTCookie.serialize({
        token: JWTToken,
      }),
    },
  });
};

const useLoginPage = () => {
  const actionData = useActionData<typeof action>();
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
    passwordError,
  };
};

export default function Login() {
  const { emailError, otherError, passwordError } = useLoginPage();

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
