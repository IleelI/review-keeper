import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { FormProvider, useForm } from "react-hook-form";

import Button from "~/components/atoms/Button";
import Input from "~/components/atoms/Input";
import { FormField } from "~/components/molecules/FormField";
import Select from "~/components/molecules/Select";
import { getReviewCategories } from "~/server/review.server";

export const loader = async () => {
  const categories = await getReviewCategories();
  return json({ categories });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  console.log(Object.fromEntries(formData));

  return null;
};

const Playground = () => {
  const { categories } = useLoaderData<typeof loader>();
  const form = useForm({
    defaultValues: {
      category: "",
    },
  });

  return (
    <main className="flex min-h-[100dvh] w-full flex-col gap-10 px-8 py-6 lg:mx-auto lg:max-w-screen-sm lg:items-center lg:justify-center">
      <h1 className="text-3xl font-bold">Playground</h1>

      <FormProvider {...form}>
        <Form
          action="/playground"
          className="flex w-full max-w-xs flex-col gap-8"
          method="post"
        >
          <div className="flex w-full max-w-xs flex-col gap-4">
            <FormField
              name="category"
              control={form.control}
              render={({ field }) => (
                <FormField.Item>
                  <FormField.Label>Category</FormField.Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormField.Control>
                      <Select.Trigger>
                        <Select.Value placeholder="Select a category..." />
                      </Select.Trigger>
                    </FormField.Control>
                    <Select.Content>
                      {categories.length ? (
                        categories.map(({ name, id }) => (
                          <Select.Item key={id} value={String(id)}>
                            {name}
                          </Select.Item>
                        ))
                      ) : (
                        <Select.EmptyList />
                      )}
                    </Select.Content>
                  </Select>
                </FormField.Item>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormField.Item>
                  <FormField.Label>Category</FormField.Label>
                  <FormField.Message />
                  <FormField.Control>
                    <Input {...field} />
                  </FormField.Control>
                </FormField.Item>
              )}
            />
          </div>

          <Button type="submit">Submit</Button>
        </Form>
      </FormProvider>
    </main>
  );
};

export default Playground;
