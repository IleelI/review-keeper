import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEditor } from "@tiptap/react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import Button from "~/components/atoms/Button";
import Input from "~/components/atoms/Input";
import Link from "~/components/atoms/Link";
import { FormField } from "~/components/molecules/FormField";
import RichTextEditor, {
  extensions,
} from "~/components/molecules/RichTextEditor";
import Select from "~/components/molecules/Select";
import { getRequiredUser } from "~/server/auth.server";
import { getReviewCategories } from "~/server/review.server";

type NewReviewSchema = z.infer<typeof newReviewSchema>;
const newReviewSchema = z.object({
  categoryId: z.string().optional(),
  content: z.string().trim().min(1, "Review is required."),
  rating: z.string().optional(),
  ratingScale: z.string().optional(),
  title: z.string().trim().min(1, "Title is required."),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log(request);
  return null;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await getRequiredUser(request);

  const categories = await getReviewCategories();
  return json({ categories });
};

const defaultValues: NewReviewSchema = {
  categoryId: "",
  content: "",
  rating: "",
  ratingScale: "",
  title: "",
};
const NewReview = () => {
  const { categories } = useLoaderData<typeof loader>();
  const fetcher = useFetcher({ key: "new-review" });
  const form = useForm<NewReviewSchema>({
    defaultValues,
    resolver: zodResolver(newReviewSchema),
  });
  const editor = useEditor({
    content: "",
    extensions,
    onUpdate: ({ editor }) =>
      form.setValue("content", editor.isEmpty ? "" : editor.getHTML()),
  });

  const onSubmit: SubmitHandler<NewReviewSchema> = (data) => {
    console.log(data);
    fetcher.submit(data);
  };

  return (
    <main className="flex min-h-[100dvh] w-full flex-col gap-8 px-8 py-6 xl:mx-auto xl:max-w-screen-lg">
      <header className="flex flex-col gap-1">
        <Link
          className="flex items-center gap-0.5 text-sm"
          decoration="underline"
          to="/"
          variant="muted"
        >
          Go home
        </Link>
        <h2 className="text-3xl font-black">New Review</h2>
      </header>

      <FormProvider {...form}>
        <form
          className="flex flex-col gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <fieldset className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormField.Item className="col-span-2">
                  <FormField.Label isRequired>Title</FormField.Label>
                  <FormField.Message />
                  <FormField.Control>
                    <Input {...field} />
                  </FormField.Control>
                </FormField.Item>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field, fieldState: { error } }) => (
                <FormField.Item className="col-span-2">
                  <FormField.Label>Category</FormField.Label>
                  <FormField.Message />
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ? String(field.value) : undefined}
                  >
                    <FormField.Control>
                      <Select.Trigger hasError={!!error} ref={field.ref}>
                        <Select.Value placeholder="Select a category..." />
                      </Select.Trigger>
                    </FormField.Control>
                    <Select.Content>
                      {categories.length ? (
                        categories.map(({ id, name }) => (
                          <Select.Item key={id} value={String(id)}>
                            {name}
                          </Select.Item>
                        ))
                      ) : (
                        <Select.EmptyList
                          message="Please try again in a while."
                          title="No categories found."
                        />
                      )}
                    </Select.Content>
                  </Select>
                </FormField.Item>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormField.Item className="col-span-1 justify-between">
                  <FormField.Label>Rating</FormField.Label>
                  <FormField.Message />
                  <FormField.Control>
                    <Input inputMode="numeric" {...field} />
                  </FormField.Control>
                </FormField.Item>
              )}
            />

            <FormField
              control={form.control}
              name="ratingScale"
              render={({ field }) => (
                <FormField.Item className="col-span-1 justify-between">
                  <FormField.Label>Rating Scale</FormField.Label>
                  <FormField.Message />
                  <FormField.Control>
                    <Input inputMode="numeric" {...field} />
                  </FormField.Control>
                </FormField.Item>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormField.Item className="col-span-2">
                  <FormField.Label isRequired>Review</FormField.Label>
                  <FormField.Message />
                  <RichTextEditor editor={editor} />
                  <FormField.Control>
                    <input type="hidden" {...field} />
                  </FormField.Control>
                </FormField.Item>
              )}
            />
          </fieldset>

          <nav className="flex gap-8">
            <Button
              intent="secondary"
              onClick={() => form.reset()}
              type="reset"
            >
              Clear Review
            </Button>
            <Button type="submit">Create Review</Button>
          </nav>
        </form>
      </FormProvider>
    </main>
  );
};

export default NewReview;
