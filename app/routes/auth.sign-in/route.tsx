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
  comparePasswords,
  createAccessToken,
  createRefreshToken,
  signIn,
  lookForUser,
  getUser,
} from "~/.server/auth";
import { prisma } from "~/.server/db";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/atoms/Checkbox";
import HelperText from "~/components/atoms/HelperText";
import Input from "~/components/atoms/Input";
import Label from "~/components/atoms/Label";
import { FormField } from "~/components/molecules/FormField";
import { CredentialsSchema, credentialsSchema } from "~/schema/auth.schema";
import { getSafeRedirect } from "~/utils/routing/routing";

import BackButton from "../auth/components/BackButton";
import Header from "../auth/components/Header";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();
    const redirectTo = formData.get("redirectTo");
    const rememberMe = Boolean(formData.get("rememberMe"));
    const parsedData = await credentialsSchema.safeParseAsync(
      Object.fromEntries(formData),
    );
    if (!parsedData.success) {
      return json({ error: "Invalid email and/or password." });
    }

    const credentials = parsedData.data;
    const user = await lookForUser(credentials.email);
    if (!user) {
      return json({ error: "Email not found." });
    }

    const arePasswordsSame = await comparePasswords(
      credentials.password,
      user.hash,
    );
    if (!arePasswordsSame) {
      return json({ error: "Incorrect password." });
    }

    const refreshToken = await createRefreshToken(user, rememberMe);
    const accessToken = await createAccessToken(user);
    await prisma.user.update({
      where: { email: user.email },
      data: { refreshToken },
    });

    return await signIn(refreshToken, accessToken, getSafeRedirect(redirectTo));
  } catch {
    return json({
      error: "Something went wrong while signing in.",
    });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (user) return redirect("/");
  return null;
};

export default function SignIn() {
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
          firstMessage="Welcome back."
          secondMessage="You've been missed!"
          title="Let's sign you in"
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

              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormField.Item>
                      <FormField.Label isRequired>Password</FormField.Label>
                      <FormField.Message />
                      <FormField.Control>
                        <Input
                          autoComplete="current-password"
                          type="password"
                          {...field}
                        />
                      </FormField.Control>
                    </FormField.Item>
                  )}
                />

                <div className="flex items-center gap-2">
                  <Checkbox defaultChecked id="rememberMe" name="rememberMe" />
                  <Label className="cursor-pointer" htmlFor="rememberMe">
                    Remember me
                  </Label>
                </div>
              </div>

              <input name="redirectTo" type="hidden" value={redirectTo} />
            </fieldset>

            <nav className="flex flex-col gap-4">
              <small className="text-center text-sm">
                {"Don't have an account?\t"}
                <Link
                  className="font-semibold text-primary-700 underline transition-colors hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-400"
                  to={`/auth/sign-up?${searchParams}`}
                >
                  Sign up here.
                </Link>
              </small>
              <Button className="text-lg font-medium" type="submit">
                Sign In
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
