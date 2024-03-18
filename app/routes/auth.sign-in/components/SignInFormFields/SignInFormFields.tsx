import { useFormContext } from "react-hook-form";

import Checkbox from "~/components/atoms/Checkbox";
import Input from "~/components/atoms/Input";
import { FormField } from "~/components/molecules/FormField";

import type { SignInSchema } from "../../hooks/useSignInPage";

const SignInFormFields = () => {
  const form = useFormContext<SignInSchema>();

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
  );
};

export default SignInFormFields;
