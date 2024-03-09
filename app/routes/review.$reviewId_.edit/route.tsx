import { invariant } from "@epic-web/invariant";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoaderFunctionArgs,
  json,
  type ActionFunctionArgs,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import CharacterCountExtension from "@tiptap/extension-character-count";
import { useEditor } from "@tiptap/react";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { getReview, getReviewCategories } from "~/.server/data/review";
import { getUserReviews } from "~/.server/data/user";
import { getRequiredUser } from "~/.server/service/auth";
import { prisma } from "~/.server/service/db";
import Button from "~/components/atoms/Button";
import MainLayout from "~/components/layouts/MainLayout";
import { extensions } from "~/components/molecules/RichTextEditor";

import FormFields from "../review/components/FormFields";
import {
  defaultReviewValues,
  reviewSchema,
  type ReviewSchema,
} from "../review/helpers/helpers";
import { reviewServerSchema } from "../review/helpers/helpers.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.reviewId, "reviewId is required.");
  const { reviewId } = params;
  const { id: userId } = await getRequiredUser(request);

  const userReviews = await getUserReviews(userId);
  if (!userReviews.flatMap(({ id }) => id).includes(reviewId)) {
    throw new Response("You're not authorized to access this resource", {
      status: 403,
      statusText: "Forbidden.",
    });
  }

  const review = await getReview(reviewId);
  if (review === null) {
    throw new Response("Review doesn't exist.", {
      status: 404,
      statusText: "Not Found.",
    });
  }

  const categories = await getReviewCategories();

  return json({ categories, review });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.reviewId, "reviewId is required.");
  const { reviewId } = params;
  const { id: userId } = await getRequiredUser(request);

  const formData = Object.fromEntries(await request.formData());
  const validatedData = reviewServerSchema.safeParse(formData);
  if (!validatedData.success) {
    return json({ error: "Incorrect data sent, please try again." });
  }

  const updatedReviewData = validatedData.data;
  const userReviews = await getUserReviews(userId);
  if (!userReviews.flatMap(({ id }) => id).includes(reviewId)) {
    throw new Response("You're not authorized to access this resource", {
      status: 403,
      statusText: "Forbidden.",
    });
  }

  const review = await getReview(reviewId);
  if (review === null) {
    throw new Response("Review doesn't exist.", {
      status: 404,
      statusText: "Not Found.",
    });
  }

  try {
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...updatedReviewData,
      },
    });
    return json({
      success: true as const,
      message: "Review updated successfully!",
      updatedReview,
    });
  } catch {
    return json({
      error:
        "Something went wrong while updating the review, please try again.",
    });
  }
};

const CHARACTER_LIMIT = 2_000;

const ReviewEditPage = () => {
  const { categories, review } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  const initialValues: ReviewSchema = useMemo(
    () => ({
      categoryId: review.categoryId ?? undefined,
      content: review.content,
      rating: review.rating ? String(review.rating) : undefined,
      ratingScale: review.ratingScale ? String(review.ratingScale) : undefined,
      title: review.title,
    }),
    [review],
  );
  const form = useForm({
    defaultValues: defaultReviewValues,
    resolver: zodResolver(reviewSchema),
    values: initialValues,
  });
  const isUnchanged = Object.entries(form.getValues()).every(([key, value]) => {
    console.log({
      current: value,
      initial: initialValues[key as keyof typeof initialValues],
    });
    return initialValues[key as keyof typeof initialValues] === value;
  });

  const editor = useEditor({
    content: review.content ?? defaultReviewValues.content,
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

  useEffect(() => {
    const data = fetcher.data;

    if (!data) return;
    else if ("error" in data) {
      toast.error(data.error, { closeButton: true });
    } else {
      toast.success(data.message, { closeButton: true });
    }
  }, [fetcher.data]);

  const onSubmit: SubmitHandler<ReviewSchema> = (data) => {
    const transformedData = {
      content: data.content,
      title: data.title,
      reviewId: review.id,
      ...(data.categoryId ? { categoryId: data.categoryId } : {}),
      ...(data.rating ? { rating: data.rating } : {}),
      ...(data.ratingScale ? { ratingScale: data.ratingScale } : {}),
    };
    fetcher.submit(transformedData, { method: "post", navigate: true });
  };

  return (
    <MainLayout>
      <FormProvider {...form}>
        <form
          className="flex flex-col gap-12"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormFields
            categories={categories}
            characterLimit={CHARACTER_LIMIT}
            editor={editor}
          />

          <nav className="flex flex-col gap-4 sm:flex-row sm:gap-8">
            <Button
              intent="secondary"
              onClick={handleFormReset}
              size="lg"
              type="reset"
            >
              Restore Initial Values
            </Button>
            <Button disabled={isUnchanged} size="lg" type="submit">
              Update Review
            </Button>
          </nav>
        </form>
      </FormProvider>
    </MainLayout>
  );
};

export default ReviewEditPage;
