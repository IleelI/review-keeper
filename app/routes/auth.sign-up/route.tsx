import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunctionArgs,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Link, useFetcher, useSearchParams } from "@remix-run/react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import {
  lookForUser,
  createRefreshToken,
  createAccessToken,
  signIn,
  createUser,
  getUser,
} from "~/.server/auth";
import { prisma } from "~/.server/db";
import Button from "~/components/atoms/Button";
import HelperText from "~/components/atoms/HelperText";
import Input from "~/components/atoms/Input";
import { FormField } from "~/components/molecules/FormField";
import { CredentialsSchema, credentialsSchema } from "~/schema/auth.schema";
import { getSafeRedirect } from "~/utils/routing/routing";

import BackButton from "../auth/components/BackButton";
import Header from "../auth/components/Header";

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
    <article className="grid lg:place-content-center">
      <div className="relative flex flex-col gap-12 pt-16 lg:w-[480px] lg:p-0">
        <BackButton />

        <Header
          firstMessage="Welcome to Review Keeper."
          secondMessage="Great to see you here!"
          title="Let's sign you up"
        />

        <FormProvider {...form}>
          <form
            className="flex flex-[2] flex-col justify-between gap-12 lg:gap-20"
            onSubmit={form.handleSubmit(handleSubmitSuccess)}
          >
            <fieldset className="flex flex-col gap-6">
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

            <nav className="flex flex-col gap-4">
              <small className="text-center text-sm">
                {"Already have an account? \t"}
                <Link
                  className="font-semibold text-primary-700 underline transition-colors hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-400"
                  to={`/auth/sign-in?${searchParams}`}
                >
                  Sign in here.
                </Link>
              </small>
              <Button className="text-lg font-medium" type="submit">
                Sign Up
              </Button>
              {backendError ? (
                <HelperText isError>{backendError}</HelperText>
              ) : null}
            </nav>
          </form>
        </FormProvider>
      </div>
    </article>
  );
}
