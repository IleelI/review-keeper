import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher, useSearchParams } from "@remix-run/react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import Button from "~/components/atoms/Button";
import Checkbox from "~/components/atoms/Checkbox";
import HelperText from "~/components/atoms/HelperText";
import Input from "~/components/atoms/Input";
import Link from "~/components/atoms/Link";
import { FormField } from "~/components/molecules/FormField";
import { credentialsSchema } from "~/schema/auth.schema";
import { getSafeRedirect } from "~/utils/routing";

import BackButton from "../auth/components/BackButton";
import Header from "../auth/components/Header";

import { action } from "./server/action";
import { loader } from "./server/loader";

export { action, loader };

const signInSchema = credentialsSchema.extend({
  redirectTo: z.string().optional(),
  rememberMe: z.boolean().optional(),
});
type SignInSchema = z.infer<typeof signInSchema>;

export default function SignIn() {
  const fetcher = useFetcher<typeof action>();
  const [searchParams] = useSearchParams();
  const form = useForm<SignInSchema>({
    defaultValues: {
      email: "",
      password: "",
      redirectTo: getSafeRedirect(searchParams.get("redirectTo")),
      rememberMe: true,
    },
    resolver: zodResolver(signInSchema),
  });
  const backendError = fetcher.data?.error;

  const handleSubmitSuccess: SubmitHandler<SignInSchema> = (data) =>
    fetcher.submit(data, { method: "post" });

  return (
    <article className="grid lg:place-content-center">
      <div className="relative flex flex-col gap-12  pt-16 lg:w-[480px] lg:p-0">
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
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormField.Item className="flex-row">
                        <FormField.Control>
                          <Checkbox
                            checked={value}
                            onCheckedChange={(checked) => onChange(!!checked)}
                            {...field}
                          />
                        </FormField.Control>
                        <FormField.Label className="cursor-pointer">
                          Remeber me
                        </FormField.Label>
                      </FormField.Item>
                    )}
                  />
                </div>
              </div>

              <input type="hidden" {...form.register("redirectTo")} />
            </fieldset>

            <nav className="flex flex-col gap-4">
              <small className="text-center text-sm">
                {"Don't have an account?\t"}
                <Link
                  className="font-semibold text-primary-700 hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-400"
                  size="sm"
                  to={`/auth/sign-up?${searchParams}`}
                >
                  Sign up here.
                </Link>
              </small>
              <Button type="submit">Sign In</Button>
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
