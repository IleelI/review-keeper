import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher, useSearchParams } from "@remix-run/react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import Button from "~/components/atoms/Button";
import HelperText from "~/components/atoms/HelperText";
import Input from "~/components/atoms/Input";
import Link from "~/components/atoms/Link";
import { FormField } from "~/components/molecules/FormField";
import { CredentialsSchema, credentialsSchema } from "~/schema/auth.schema";
import { getSafeRedirect } from "~/utils/routing";

import BackButton from "../auth/components/BackButton";
import Header from "../auth/components/Header";

import { action } from "./server/action";
import { loader } from "./server/loader";

export { action, loader };

const signUpSchema = credentialsSchema.extend({
  redirectTo: z.string().optional(),
});
type SignUpSchema = z.infer<typeof signUpSchema>;

export default function Register() {
  const fetcher = useFetcher<typeof action>();
  const [searchParams] = useSearchParams();
  const form = useForm<SignUpSchema>({
    defaultValues: {
      email: "",
      password: "",
      redirectTo: getSafeRedirect(searchParams.get("redirectTo")),
    },
    resolver: zodResolver(signUpSchema),
  });
  const backendError = fetcher.data?.error;

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
                      <Link
                        aria-label="Bitwarden password generator"
                        className="text-primary-700 hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-400"
                        size="sm"
                        to="https://bitwarden.com/password-generator/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        here.
                      </Link>
                    </FormField.Description>
                  </FormField.Item>
                )}
              />

              <input {...form.register("redirectTo")} type="hidden" />
            </fieldset>

            <nav className="flex flex-col gap-4">
              <small className="text-center text-sm">
                {"Already have an account? \t"}
                <Link
                  className="font-semibold text-primary-700 hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-400"
                  size="sm"
                  to={`/auth/sign-in?${searchParams}`}
                >
                  Sign in here.
                </Link>
              </small>
              <Button type="submit">Sign Up</Button>
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
