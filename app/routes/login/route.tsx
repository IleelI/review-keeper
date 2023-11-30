import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import { jwtVerify } from "jose";

import { JWTCookie, credentialsSchema, login } from "~/server/auth.server";
import { env } from "~/server/env.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await JWTCookie.parse(cookieHeader)) || {};
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
  const validatedCredentials = credentialsSchema.safeParse(
    Object.fromEntries((await request.formData()) ?? []),
  );
  if (!validatedCredentials.success) {
    return json({
      origin: "form",
      error: validatedCredentials.error.flatten().fieldErrors,
    });
  }
  const loginResponse = await login(validatedCredentials.data);
  if (typeof loginResponse !== "string") {
    return json(
      {
        origin: loginResponse.origin,
        error: loginResponse.message,
      } as const,
      {
        status: loginResponse.origin === "server" ? 500 : 400,
        statusText: loginResponse.message,
      },
    );
  }
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await JWTCookie.parse(cookieHeader)) || {};

  return redirect("/", {
    headers: {
      "Set-Cookie": await JWTCookie.serialize({
        token: loginResponse,
        ...cookie,
      }),
    },
  });
};

export default function Login() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
        Log in page
      </h1>
      <Form method="post" className="flex max-w-xs flex-col gap-8">
        <fieldset className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input
              className="rounded-md border border-neutral-300 bg-neutral-100 px-4 py-1.5 dark:border-neutral-700 dark:bg-neutral-900"
              id="email"
              name="email"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <input
              className="rounded-md border border-neutral-300 bg-neutral-100 px-4 py-1.5 dark:border-neutral-700 dark:bg-neutral-900"
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
          Log in
        </button>
      </Form>
    </div>
  );
}
