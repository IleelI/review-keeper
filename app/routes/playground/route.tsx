import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { z } from "zod";

import Input from "~/components/atoms/Input";
import { FormField } from "~/components/molecules/FormField";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = Object.fromEntries(await request.formData());
  console.log(formData);
  return null;
};

const testSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long."),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long."),
});
type TestSchema = z.infer<typeof testSchema>;

const Playground = () => {
  const fetcher = useFetcher();
  const form = useForm<TestSchema>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(testSchema),
  });

  const onSubmit: SubmitHandler<TestSchema> = (data) => {
    fetcher.submit(data, { method: "post" });
  };
  const onSubmitError: SubmitErrorHandler<TestSchema> = (errors) => {
    console.warn(errors);
  };

  return (
    <div className="flex max-w-screen-sm flex-col gap-8">
      <h1 className="text-3xl font-bold text-primary-700 dark:text-primary-300">
        Playground
      </h1>

      <FormProvider {...form}>
        <form
          className="flex flex-col gap-8"
          onSubmit={form.handleSubmit(onSubmit, onSubmitError)}
        >
          <fieldset className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field, fieldState: { error } }) => (
                <FormField.Item>
                  <FormField.Label isRequired>Username</FormField.Label>
                  <FormField.Message />
                  <FormField.Control>
                    <Input isError={!!error} {...field} />
                  </FormField.Control>
                  <FormField.Description>
                    Username that will be displayed
                  </FormField.Description>
                </FormField.Item>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState: { error } }) => (
                <FormField.Item>
                  <FormField.Label isRequired>Password</FormField.Label>
                  <FormField.Message />
                  <FormField.Control>
                    <Input isError={!!error} {...field} />
                  </FormField.Control>
                  <FormField.Description>
                    Generate safe password{" "}
                    <a
                      className="text-primary-700 underline underline-offset-4 transition-colors hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-500"
                      href="https://bitwarden.com/password-generator/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      here
                    </a>
                  </FormField.Description>
                </FormField.Item>
              )}
            />
          </fieldset>

          <button
            className="rounded-lg bg-primary-700 px-4 py-1.5 text-lg font-medium text-neutral-100 dark:bg-primary-500"
            type="submit"
          >
            Submit
          </button>
        </form>
      </FormProvider>
    </div>
  );
};

export default Playground;
