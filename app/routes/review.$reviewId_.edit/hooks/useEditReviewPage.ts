import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher, useLoaderData } from "@remix-run/react";
import CharacterCountExtension from "@tiptap/extension-character-count";
import { useEditor, type Extensions } from "@tiptap/react";
import { useEffect, useMemo } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import type { ReviewCategory } from "~/.server/data/review";
import { extensions } from "~/components/molecules/RichTextEditor";
import {
  ReviewSchema,
  getSubmitData,
  reviewSchema,
  uncategorisedOption,
} from "~/routes/review/helpers/helpers";

import { action } from "../route";
import type { loader } from "../server/loader";

import { getInitialData } from "./helpers";

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
  const fetcher = useFetcher<typeof action>();
  const form = useForm<ReviewSchema>({
    mode: "onBlur",
    values: getInitialData(review),
    resolver: zodResolver(reviewSchema),
  });
  const editor = useEditor({
    content: review.content,
    extensions: editorExtensions,
    onUpdate: ({ editor }) =>
      form.setValue("content", editor.isEmpty ? "" : editor.getHTML(), {
        shouldValidate: true,
        shouldDirty: true,
      }),
  });

  const categoriesWithUncategorised: ReviewCategory[] = useMemo(
    () => [uncategorisedOption, ...categories],
    [categories],
  );

  const isFormDisabled = useMemo(
    () => !(form.formState.isDirty && form.formState.isValid),
    [form.formState.isDirty, form.formState.isValid],
  );

  const handleFormReset = () => {
    form.reset();
    editor?.commands.setContent(review.content);
  };

  const onSubmit: SubmitHandler<ReviewSchema> = (data) => {
    fetcher.submit(getSubmitData(data), { method: "post" });
  };

  useEffect(() => {
    if (!fetcher.data || fetcher.state !== "idle") return;
    const { message, status } = fetcher.data;
    switch (status) {
      case "error": {
        toast.error(message);
        break;
      }
      case "success": {
        toast.success(message);
        break;
      }
      default:
        return;
    }
  }, [fetcher]);

  return {
    categories: categoriesWithUncategorised,
    editor,
    form,
    handleFormReset,
    isFormDisabled,
    onSubmit,
  };
};

export default useEditReviewPage;
