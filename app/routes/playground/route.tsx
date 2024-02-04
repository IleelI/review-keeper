import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { FormProvider, useForm } from "react-hook-form";

import Button from "~/components/atoms/Button";
import Input from "~/components/atoms/Input";
import Select, { SelectOption } from "~/components/atoms/Select";
import { FormField } from "~/components/molecules/FormField";
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

  const categoryOptions: SelectOption[] = categories.map(({ id, name }) => ({
    disabled: Math.floor(Math.random() * 1000) > 700,
    name: name,
    value: String(id),
  }));

  return (
    <main className="flex min-h-[100dvh] w-full flex-col gap-10 px-8 py-6 lg:mx-auto lg:max-w-screen-sm lg:items-center lg:justify-center">
      <h1 className="text-3xl font-bold">Playground</h1>

      <FormProvider {...form}>
        <Form
          action="/playground"
          className="flex w-full max-w-xs flex-col gap-4"
          method="post"
        >
          <FormField
            name="category"
            control={form.control}
            render={({ field }) => (
              <FormField.Item>
                <FormField.Label>Category</FormField.Label>
                <FormField.Control>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    options={categoryOptions}
                    customContent={({ name }) => (
                      <div className="flex items-center gap-2">
                        <img
                          alt="random img"
                          className="aspect-square w-6 rounded-full border border-neutral-800 object-cover dark:border-neutral-200"
                          src={`https://picsum.photos/seed/random/200/300`}
                        />
                        {name}
                      </div>
                    )}
                  />
                </FormField.Control>
              </FormField.Item>
            )}
          />

          <Input placeholder="Placeholder" />

          <Button type="submit">Submit</Button>
        </Form>
      </FormProvider>
    </main>
  );
};

export default Playground;
