import { zodResolver } from "@hookform/resolvers/zod";
import { CaretDown, CaretUp, Check } from "@phosphor-icons/react";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import { ActionFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { NavLink, useFetcher, useLoaderData } from "@remix-run/react";
import CharacterCountExtension from "@tiptap/extension-character-count";
import { useEditor } from "@tiptap/react";
import clsx from "clsx";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import RichTextEditor, {
  extensions,
} from "~/components/molecules/RichTextEditor";
import { requireUser } from "~/server/auth.server";
import { prisma } from "~/server/db.server";
import { getReviewCategories } from "~/server/review.server";

const reviewSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required."),
    categoryId: z
      .number({ invalid_type_error: "CategoryId must be a number." })
      .optional(),
    rating: z
      .number({ invalid_type_error: "Rating must be a number." })
      .min(0, "Rating cannot be smaller than 0.")
      .optional(),
    ratingScale: z
      .number({ invalid_type_error: "Rating scale must be a number." })
      .min(0, "Rating scale cannot be smaller than 0.")
      .optional(),
    review: z.string().trim().min(1, "Review is required."),
  })
  .superRefine(({ rating, ratingScale }, ctx) => {
    if (rating === undefined && ratingScale) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rating"],
        message: "Rating scale must have rating.",
      });
    } else if (rating && ratingScale === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ratingScale"],
        message: "Rating must have rating scale.",
      });
    } else if (rating && ratingScale && rating > ratingScale) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rating"],
        message: "Rating cannot be greater than rating scale.",
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ratingScale"],
        message: "Rating scale cannot be smaller than rating.",
      });
    }
  });
type ReviewSchema = z.infer<typeof reviewSchema>;

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);
  const formData = Object.fromEntries(await request.formData());

  const transformedFormData: ReviewSchema = {
    title: String(formData.title),
    review: String(formData.review),
    categoryId: Number(formData.categoryId) || undefined,
    rating: Number(formData.rating) || undefined,
    ratingScale: Number(formData.ratingScale) || undefined,
  };

  const parseResult = reviewSchema.safeParse(transformedFormData);
  if (!parseResult.success) {
    return json({ error: parseResult.error.flatten().fieldErrors });
  }
  const { categoryId, rating, ratingScale, review, title } = parseResult.data;
  const authorId = user.id;
  const content = review;

  const newReview = await prisma.review.create({
    data: {
      authorId,
      categoryId,
      content,
      title,
      rating,
      ratingScale,
    },
  });

  return json({ review: newReview });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUser(request);
  const categories = await getReviewCategories();
  return json({ categories });
};

const defaultValues: ReviewSchema = {
  review: "",
  title: "",
};

const CHARACTERS_LIMIT = 500;

export default function NewReview() {
  const { categories } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const {
    clearErrors,
    control,
    formState: { disabled, errors },
    handleSubmit,
    register,
    trigger,
    setError,
    setValue,
  } = useForm<ReviewSchema>({
    defaultValues,
    resolver: zodResolver(reviewSchema),
  });
  const editor = useEditor({
    extensions: [
      ...extensions,
      CharacterCountExtension.configure({
        mode: "textSize",
        limit: CHARACTERS_LIMIT,
      }),
    ],
    injectCSS: false,
    onUpdate: ({ editor }) => {
      setValue("review", editor.isEmpty ? "" : editor.getHTML());
      if (editor.isEmpty) {
        setError("review", { message: "Review is required.", type: "min" });
      } else {
        clearErrors("review");
      }
    },
  });
  const characterCount = editor?.storage.characterCount.characters() ?? 0;

  const onSubmitSuccess: SubmitHandler<ReviewSchema> = (formData) => {
    const formattedData = {
      title: formData.title,
      review: formData.review,
      ...(formData.categoryId ? { categoryId: formData.categoryId } : {}),
      ...(formData.rating ? { rating: formData.rating } : {}),
      ...(formData.ratingScale ? { ratingScale: formData.ratingScale } : {}),
    };
    fetcher.submit(formattedData, { method: "post", navigate: false });
  };

  fetcher.data && console.log(fetcher.data);
  return (
    <main className="flex flex-col gap-6">
      <nav className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-neutral-950 dark:text-neutral-50">
          New Review
        </h1>
        <ul className="flex items-center gap-1">
          <NavLink
            className="text-sm text-neutral-600 underline underline-offset-2 dark:text-neutral-400"
            to="/"
          >
            Review Keeper
          </NavLink>
          <li className="text-sm text-neutral-600 dark:text-neutral-400">→</li>
          <NavLink
            className="text-sm font-medium underline underline-offset-2 [&.active]:text-primary-600 dark:[&.active]:text-primary-400"
            to="/review/new"
          >
            New Review
          </NavLink>
        </ul>
      </nav>

      <fetcher.Form
        className="flex flex-col gap-8"
        method="post"
        onSubmit={handleSubmit(onSubmitSuccess)}
      >
        <section className="flex flex-col gap-2">
          <fieldset className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label.Root className="font-medium" htmlFor="title">
                Title <span className="text-red-700 dark:text-red-300">*</span>
              </Label.Root>
              <input
                className="flex items-center rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 placeholder:text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:placeholder:text-neutral-400"
                id="title"
                placeholder="ex. Is Review Keeper worth it?"
                {...register("title")}
              />
              {errors.title ? (
                <small className="text-sm text-red-700 dark:text-red-300">
                  {errors.title.message}
                </small>
              ) : null}
            </div>

            <Controller
              control={control}
              name="categoryId"
              render={({ field: { disabled, name, onChange, ref, value } }) => (
                <div className="flex flex-col gap-1.5">
                  <Label.Root className="font-medium" htmlFor="category">
                    Category
                  </Label.Root>
                  <Select.Root
                    disabled={disabled}
                    name={name}
                    onValueChange={(value) =>
                      onChange(Number(value) || undefined)
                    }
                    value={value === undefined ? undefined : String(value)}
                  >
                    <Select.Trigger
                      ref={ref}
                      aria-label="Category"
                      className="flex items-center justify-between rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 data-[placeholder]:text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:data-[placeholder]:text-neutral-400"
                      id="category"
                    >
                      <Select.Value placeholder="Select a category...">
                        {value
                          ? categories.find(({ id }) => id === Number(value))
                              ?.name
                          : null}
                      </Select.Value>
                      <Select.Icon>
                        <CaretDown className="fill-neutral-700 stroke-neutral-700 dark:fill-neutral-300 dark:stroke-neutral-300" />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content
                        className="data-[state='open']:animate-in max-h-[var(--radix-select-content-available-height)] w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-neutral-300 bg-neutral-50 shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-xl md:max-h-[300px]"
                        position="popper"
                        sideOffset={16}
                      >
                        <Select.ScrollUpButton className="flex items-center justify-center border-b border-neutral-300 p-2.5 dark:border-neutral-600">
                          <CaretUp weight="bold" />
                        </Select.ScrollUpButton>

                        <Select.Viewport className="flex flex-col gap-2 rounded-lg p-2">
                          {categories.map(({ id, name }) => (
                            <Select.Item
                              className={clsx([
                                "flex select-none items-center justify-between gap-2 rounded-md border border-transparent bg-transparent px-2 py-1.5 transition-colors duration-150 data-[disabled]:opacity-40",
                                "data-[state=checked]:bg-primary-600 data-[state=checked]:text-neutral-200 dark:data-[state=checked]:bg-primary-300 dark:data-[state=checked]:text-neutral-800",
                                "data-[highlighted]:bg-neutral-100 data-[highlighted]:text-neutral-800 data-[highlighted]:outline-none dark:data-[highlighted]:bg-neutral-700 dark:data-[highlighted]:text-neutral-200",
                              ])}
                              key={id}
                              value={String(id)}
                            >
                              <Select.ItemText>{name}</Select.ItemText>
                              <Select.ItemIndicator className="inline-flex items-center justify-center">
                                <Check weight="bold" />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>

                        <Select.ScrollDownButton className="flex items-center justify-center border-t border-neutral-300 p-2.5 dark:border-neutral-600">
                          <CaretDown weight="bold" />
                        </Select.ScrollDownButton>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  {errors.categoryId ? (
                    <small className="text-sm text-red-700 dark:text-red-300">
                      {errors.categoryId.message}
                    </small>
                  ) : null}
                </div>
              )}
            />

            <fieldset className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label.Root className="font-medium" htmlFor="rating">
                  Rating
                </Label.Root>
                <input
                  className="flex items-center rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 placeholder:text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:placeholder:text-neutral-400"
                  id="rating"
                  inputMode="numeric"
                  placeholder="ex. 50"
                  {...register("rating", {
                    setValueAs: (value) => (value ? Number(value) : undefined),
                    onChange: () => trigger(["rating", "ratingScale"]),
                  })}
                />
                {errors.rating ? (
                  <small className="text-sm text-red-700 dark:text-red-300">
                    {errors.rating.message}
                  </small>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label.Root className="font-medium" htmlFor="ratingScale">
                  Rating Scale
                </Label.Root>
                <input
                  className="flex items-center rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 placeholder:text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:placeholder:text-neutral-400"
                  id="ratingScale"
                  inputMode="numeric"
                  placeholder="ex. 100"
                  {...register("ratingScale", {
                    setValueAs: (value) => (value ? Number(value) : undefined),
                    onChange: () => trigger(["rating", "ratingScale"]),
                  })}
                />
                {errors.ratingScale ? (
                  <small className="text-sm text-red-700 dark:text-red-300">
                    {errors.ratingScale.message}
                  </small>
                ) : null}
              </div>
            </fieldset>

            <div className="flex flex-col gap-1.5">
              <Label.Root className="font-medium" htmlFor="review">
                Review <span className="text-red-700 dark:text-red-300">*</span>
              </Label.Root>
              <RichTextEditor editor={editor} />
              <div className="grid grid-cols-2 gap-8">
                {errors.review ? (
                  <small className="text-sm text-red-700 dark:text-red-300">
                    {errors.review.message}
                  </small>
                ) : null}
                <small className="col-start-2 text-end text-sm text-neutral-600 dark:text-neutral-400">
                  {characterCount} / {CHARACTERS_LIMIT}
                </small>
              </div>
              <input {...register("review")} id="review" type="hidden" />
            </div>
          </fieldset>

          <legend className="text-sm font-medium text-neutral-500">
            Fields marked with{" "}
            <span className="text-base text-red-700 dark:text-red-300">*</span>{" "}
            are required.
          </legend>
        </section>

        <nav className="flex gap-4 self-end">
          <button
            className="flex items-center justify-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 font-bold text-neutral-200 outline-offset-4 transition-colors duration-300 enabled:hover:bg-primary-700 enabled:focus-visible:bg-primary-700 enabled:active:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-primary-400 dark:text-neutral-800 dark:enabled:hover:bg-primary-300 dark:enabled:focus-visible:bg-primary-300 dark:enabled:active:bg-primary-200"
            disabled={disabled || fetcher.state === "submitting"}
            type="submit"
          >
            Publish review
          </button>
        </nav>
      </fetcher.Form>
    </main>
  );
}
