import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunctionArgs,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Link, useFetcher, useSearchParams } from "@remix-run/react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import HelperText from "~/components/atoms/HelperText";
import Input from "~/components/atoms/Input";
import { FormField } from "~/components/molecules/FormField";
import { CredentialsSchema, credentialsSchema } from "~/schema/auth.schema";
import {
  lookForUser,
  createRefreshToken,
  createAccessToken,
  signIn,
  createUser,
  getUser,
} from "~/server/auth.server";
import { prisma } from "~/server/db.server";
import { getSafeRedirect } from "~/utils/routing/routing";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();
    const redirectTo = formData.get("redirectTo");
    const parsedForm = credentialsSchema.safeParse(
      Object.fromEntries(formData),
    );
    if (!parsedForm.success) {
      return json({
        error: "Invalid email and/or password",
      });
    }

    const credentials = parsedForm.data;
    const existingUser = await lookForUser(credentials.email);
    if (existingUser) {
      return json({
        error: "Account with this email already exists.",
      });
    }

    const user = await createUser(credentials);
    if (!user) {
      return json({
        error: "Something went wrong while creating account.",
      });
    }

    const refreshToken = await createRefreshToken(user);
    const accessToken = await createAccessToken(user);
    await prisma.user.update({
      where: { email: user.email },
      data: { refreshToken },
    });

    return await signIn(refreshToken, accessToken, getSafeRedirect(redirectTo));
  } catch {
    return json({
      error: "Something went wrong while signing up.",
    });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (user) return redirect("/");
  return null;
};

export default function Register() {
  const fetcher = useFetcher<typeof action>();
  const form = useForm<CredentialsSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(credentialsSchema),
  });
  const [searchParams] = useSearchParams();
  const backendError = fetcher.data?.error;
  const redirectTo = getSafeRedirect(searchParams.get("redirectTo"));

  const handleSubmitSuccess: SubmitHandler<CredentialsSchema> = (data) => {
    fetcher.submit(data, { method: "post" });
  };

  return (
    <main className="flex min-h-[100dvh] w-full flex-col gap-10 px-8 py-6 lg:mx-auto lg:max-w-screen-sm lg:justify-center">
      <header className="flex flex-col gap-1">
        <Link
          className="text-sm leading-none text-neutral-400 underline underline-offset-2 transition-colors hover:text-primary-600 dark:text-neutral-600 dark:hover:text-primary-400"
          to="/"
        >
          Go home
        </Link>
        <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
          Sign up
        </h1>
      </header>

      <FormProvider {...form}>
        <form
          className="flex flex-col gap-8"
          onSubmit={form.handleSubmit(handleSubmitSuccess)}
        >
          <fieldset className="flex flex-col gap-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormField.Item>
                  <FormField.Label isRequired>Email</FormField.Label>
                  <FormField.Message />
                  <FormField.Control>
                    <Input autoComplete="email" type="email" {...field} />
                  </FormField.Control>
                </FormField.Item>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormField.Item>
                  <FormField.Label isRequired>Password</FormField.Label>
                  <FormField.Message />
                  <FormField.Control>
                    <Input
                      autoComplete="new-password"
                      type="password"
                      {...field}
                    />
                  </FormField.Control>
                  <FormField.Description>
                    Generate safe password{" "}
                    <a
                      aria-label="Bitwarden password generator"
                      className="text-primary-700 underline underline-offset-4 transition-colors hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-400"
                      href="https://bitwarden.com/password-generator/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      here.
                    </a>
                  </FormField.Description>
                </FormField.Item>
              )}
            />

            <input name="redirectTo" type="hidden" value={redirectTo} />
          </fieldset>

          <nav className="flex flex-col gap-2">
            <button
              className="rounded-lg bg-primary-700 px-4 py-1.5 text-lg font-medium text-neutral-100 transition-colors duration-300 enabled:hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-primary-300 dark:text-neutral-900 dark:enabled:hover:bg-primary-400"
              disabled={!form.formState.isValid}
              type="submit"
            >
              Sign up
            </button>
            {backendError ? (
              <HelperText isError>{backendError}</HelperText>
            ) : null}
            <small className="text-xs tracking-wide">
              {"Already have an account?"}{" "}
              <Link
                className="text-sm text-primary-700 underline underline-offset-4 transition-colors hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-400"
                to={`/sign-in?${searchParams}`}
              >
                Sign in here.
              </Link>
            </small>
          </nav>
        </form>
      </FormProvider>
    </main>
  );
}
