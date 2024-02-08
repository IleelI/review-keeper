import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunctionArgs,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import { useFetcher, useSearchParams } from "@remix-run/react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import Button from "~/components/atoms/Button";
import Checkbox from "~/components/atoms/Checkbox";
import HelperText from "~/components/atoms/HelperText";
import Input from "~/components/atoms/Input";
import Label from "~/components/atoms/Label";
import Link from "~/components/atoms/Link";
import { FormField } from "~/components/molecules/FormField";
import { CredentialsSchema, credentialsSchema } from "~/schema/auth.schema";
import {
  comparePasswords,
  createAccessToken,
  createRefreshToken,
  signIn,
  lookForUser,
  getUser,
} from "~/server/auth.server";
import { prisma } from "~/server/db.server";
import { getSafeRedirect } from "~/utils/routing/routing";

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
    <main className="flex min-h-[100dvh] w-full flex-col gap-10 px-8 py-6 lg:mx-auto lg:max-w-screen-sm lg:justify-center">
      <header className="flex flex-col gap-1">
        <Link className="text-sm" decoration="underline" to="/" variant="muted">
          Go home
        </Link>
        <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
          Sign in
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
                <Label htmlFor="rememberMe">Remember me</Label>
              </div>
            </div>

            <input name="redirectTo" type="hidden" value={redirectTo} />
          </fieldset>

          <nav className="flex flex-col gap-2">
            <Button disabled={!form.formState.isValid} type="submit">
              Sign in
            </Button>
            {backendError ? (
              <HelperText isError>{backendError}</HelperText>
            ) : null}
            <small className="text-xs tracking-wide">
              {"Don't have an account?"}{" "}
              <Link
                className="text-sm"
                decoration="underline"
                to={`/sign-up?${searchParams}`}
              >
                Sign up here.
              </Link>
            </small>
          </nav>
        </form>
      </FormProvider>
    </main>
  );
}
