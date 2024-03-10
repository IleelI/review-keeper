import { zodResolver } from "@hookform/resolvers/zod";
import { useLoaderData, useFetcher, useNavigate } from "@remix-run/react";
import CharacterCountExtension from "@tiptap/extension-character-count";
import { useEditor, type Extensions } from "@tiptap/react";
import { useEffect, useMemo } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import type { ReviewCategory } from "~/.server/data/review";
import { extensions } from "~/components/molecules/RichTextEditor";
import {
  type ReviewSchema,
  defaultReviewValues,
  reviewSchema,
  uncategorisedOption,
  getSubmitData,
} from "~/routes/review/helpers/helpers";

import type { action } from "../server/action";
import type { loader } from "../server/loader";

export const CHARACTER_LIMIT = 2_000;

const editorExtenstions: Extensions = [
  ...extensions,
  CharacterCountExtension.configure({
    limit: CHARACTER_LIMIT,
    mode: "textSize",
  }),
];

const useNewReviewPage = () => {
  const { categories } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const form = useForm<ReviewSchema>({
    defaultValues: defaultReviewValues,
    mode: "onBlur",
    resolver: zodResolver(reviewSchema),
  });
  const editor = useEditor({
    content: defaultReviewValues.content,
    extensions: editorExtenstions,
    onUpdate: ({ editor }) =>
      form.setValue("content", editor.isEmpty ? "" : editor.getHTML(), {
        shouldValidate: true,
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

  const onSubmit: SubmitHandler<ReviewSchema> = (data) => {
    fetcher.submit(getSubmitData(data), { method: "post", navigate: true });
  };

  useEffect(() => {
    if (!fetcher.data || fetcher.state !== "idle") return;
    switch (fetcher.data.status) {
      case "error": {
        toast.error(fetcher.data.message);
        break;
      }
      case "success": {
        toast.success(fetcher.data.message);
        navigate(`/review/${fetcher.data.newReview.id}`);
        break;
      }
      default:
        return;
    }
  }, [fetcher, navigate]);

  return {
    categories: categoriesWithUncategorised,
    editor,
    form,
    handleFormReset,
    onSubmit,
  };
};

export default useNewReviewPage;
