import { zodResolver } from "@hookform/resolvers/zod";
import { useLoaderData, useFetcher } from "@remix-run/react";
import CharacterCountExtension from "@tiptap/extension-character-count";
import { useEditor } from "@tiptap/react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { extensions } from "~/components/molecules/RichTextEditor";
import {
  type ReviewSchema,
  defaultReviewValues,
  reviewSchema,
} from "~/routes/review/helpers/helpers";

import type { action } from "../server/action";
import type { loader } from "../server/loader";

export const CHARACTER_LIMIT = 2_000;

const useNewReviewPage = () => {
  const { categories } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>({ key: "new-review" });
  const form = useForm<ReviewSchema>({
    defaultValues: defaultReviewValues,
    resolver: zodResolver(reviewSchema),
  });
  const editor = useEditor({
    content: "",
    extensions: [
      ...extensions,
      CharacterCountExtension.configure({
        limit: CHARACTER_LIMIT,
        mode: "textSize",
      }),
    ],
    onUpdate: ({ editor }) =>
      form.setValue("content", editor.isEmpty ? "" : editor.getHTML(), {
        shouldValidate: form.formState.submitCount > 0,
      }),
  });

  const handleFormReset = () => {
    form.reset();
    editor?.commands.clearContent();
  };

  const onSubmit: SubmitHandler<ReviewSchema> = (data) => {
    const transformedData = {
      content: data.content,
      title: data.title,
      ...(data.categoryId ? { categoryId: data.categoryId } : {}),
      ...(data.rating ? { rating: data.rating } : {}),
      ...(data.ratingScale ? { ratingScale: data.ratingScale } : {}),
    };
    fetcher.submit(transformedData, { method: "post", navigate: true });
  };

  return {
    categories,
    editor,
    form,
    handleFormReset,
    onSubmit,
  };
};

export default useNewReviewPage;
