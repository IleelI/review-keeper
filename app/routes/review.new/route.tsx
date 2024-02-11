import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEditor } from "@tiptap/react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { extensions } from "~/components/molecules/RichTextEditor";
import { getRequiredUser } from "~/server/auth.server";
import { getReviewCategories } from "~/server/review.server";

import FormActions from "./ components/FormActions";
import FormFields from "./ components/FormFields";
import Header from "./ components/Header";
import { NewReviewSchema, defaultValues, newReviewSchema } from "./helpers";

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log(request);

  return null;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await getRequiredUser(request);

  const categories = await getReviewCategories();

  return json({ categories });
};

const NewReview = () => {
  const { categories } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>({ key: "new-review" });
  const form = useForm<NewReviewSchema>({
    defaultValues,
    resolver: zodResolver(newReviewSchema),
  });
  const editor = useEditor({
    content: defaultValues.content,
    extensions,
    onUpdate: ({ editor }) =>
      form.setValue("content", editor.isEmpty ? "" : editor.getHTML(), {
        shouldValidate: form.formState.submitCount >= 1,
      }),
  });

  const handleFormReset = () => {
    form.reset();
    editor?.commands.clearContent();
  };

  const onSubmit: SubmitHandler<NewReviewSchema> = (data) => {
    console.log({ data });
    fetcher.submit({});
  };

  return (
    <main className="flex min-h-[100dvh] w-full flex-col gap-8 px-8 py-6 xl:mx-auto xl:max-w-screen-lg">
      <Header />
      <FormProvider {...form}>
        <form
          className="flex flex-col gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormFields categories={categories} editor={editor} />
          <FormActions handleFormReset={handleFormReset} />
        </form>
      </FormProvider>
    </main>
  );
};

export default NewReview;
