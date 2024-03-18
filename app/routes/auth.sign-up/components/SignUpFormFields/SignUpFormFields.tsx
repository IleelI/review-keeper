import { useFormContext } from "react-hook-form";

import Input from "~/components/atoms/Input";
import Link from "~/components/atoms/Link";
import { FormField } from "~/components/molecules/FormField";

import { SignUpSchema } from "../../hooks/useSignUpPage";

const SignUpFormFields = () => {
  const form = useFormContext<SignUpSchema>();

  return (
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
              <Input autoComplete="new-password" type="password" {...field} />
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
  );
};

export default SignUpFormFields;
