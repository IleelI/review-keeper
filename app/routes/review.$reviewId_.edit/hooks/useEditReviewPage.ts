import { useLoaderData } from "@remix-run/react";
import CharacterCountExtension from "@tiptap/extension-character-count";
import { useEditor, type Extensions } from "@tiptap/react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import type { ReviewCategory } from "~/.server/data/review";
import { extensions } from "~/components/molecules/RichTextEditor";
import { uncategorisedOption } from "~/routes/review/components/FormFields";

import type { loader } from "../server/loader";

export const CHARACTER_LIMIT = 2_000;

const editorExtensions: Extensions = [
  ...extensions,
  CharacterCountExtension.configure({
    limit: CHARACTER_LIMIT,
    mode: "textSize",
  }),
];

const useEditReviewPage = () => {
  const { categories, review } = useLoaderData<typeof loader>();

  const form = useForm({
    values: review,
  });
  const editor = useEditor({
    content: review.content,
    extensions: editorExtensions,
    onUpdate: ({ editor }) =>
      form.setValue("content", editor.isEmpty ? "" : editor.getHTML(), {
        shouldValidate: form.formState.submitCount > 0,
      }),
  });

  const categoriesWithUncategorised: ReviewCategory[] = useMemo(
    () => [uncategorisedOption, ...categories],
    [categories],
  );

  const handleFormReset = () => {
    form.reset();
    editor?.commands.clearContent();
  };

  return {
    categories: categoriesWithUncategorised,
    editor,
    form,
    handleFormReset,
  };
};

export default useEditReviewPage;
