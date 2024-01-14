import { zodResolver } from "@hookform/resolvers/zod";
import { CaretDown, CaretUp, Check } from "@phosphor-icons/react";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { NavLink, useFetcher } from "@remix-run/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { requireUser } from "~/server/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request);
  return null;
};

const newReviewSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required."),
    category: z.string().trim().min(1, "Category is required."),
    rating: z
      .number({ invalid_type_error: "Rating must be a number." })
      .min(0, "Rating cannot be less than 0.")
      .optional(),
    ratingScale: z
      .number({ invalid_type_error: "Rating scale must be a number." })
      .min(0, "Rating scale cannot be less than 0.")
      .optional(),
    review: z.string().trim().min(1, "Review is required."),
  })
  .superRefine(({ rating, ratingScale }, ctx) => {
    if (rating === undefined && ratingScale) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rating"],
        message: "Rating Scale must have Rating.",
      });
    } else if (rating && ratingScale === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ratingScale"],
        message: "Rating must have Rating Scale.",
      });
    } else if (rating && ratingScale && rating > ratingScale) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rating"],
        message: "Rating cannot be greater than Rating Scale.",
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ratingScale"],
        message: "Rating Scale cannot be less than Rating.",
      });
    }
  });
type NewReviewSchema = z.infer<typeof newReviewSchema>;

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());
  console.log({ formData });
  return null;
};

const defaultValues: NewReviewSchema = {
  title: "",
  review: "",
  category: "",
};

export default function NewReview() {
  // TODO - Get categories from the backend
  const fetcher = useFetcher({
    key: "newReview",
  });
  const {
    control,
    formState: { disabled, errors },
    handleSubmit,
    register,
    trigger,
  } = useForm<NewReviewSchema>({
    defaultValues,
    resolver: zodResolver(newReviewSchema),
  });

  const onSubmitSuccess: SubmitHandler<NewReviewSchema> = (_, event) => {
    fetcher.submit(event?.target, { method: "post", navigate: false });
  };

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
                Title <span className="text-red-700">*</span>
              </Label.Root>
              <input
                className="flex items-center rounded-lg border border-neutral-300 bg-neutral-50 bg-transparent px-2.5 py-1.5 placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:placeholder:text-neutral-600"
                id="title"
                placeholder="ex. Is Review Keeper worth it?"
                {...register("title")}
              />
              {errors.title ? (
                <small className="text-red-700 text-sm font-medium">
                  {errors.title.message}
                </small>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Controller
                control={control}
                name="category"
                render={({ field: { ref, ...field } }) => (
                  <>
                    <Label.Root className="font-medium" htmlFor="category">
                      Category
                    </Label.Root>
                    <Select.Root
                      {...field}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <Select.Trigger
                        ref={ref}
                        aria-label="Category"
                        className="flex items-center justify-between rounded-lg border border-neutral-300 bg-neutral-50 bg-transparent px-2.5 py-1.5 data-[placeholder]:text-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:data-[placeholder]:text-neutral-600"
                        id="category"
                      >
                        <Select.Value placeholder="Select a category..." />
                        <Select.Icon>
                          <CaretDown className="fill-neutral-700 stroke-neutral-700" />
                        </Select.Icon>
                      </Select.Trigger>

                      <Select.Portal>
                        <Select.Content
                          className="data-[state='open']:animate-in max-h-[200px] w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-neutral-300 bg-neutral-50 shadow-md dark:border-neutral-800 dark:bg-neutral-950"
                          position="popper"
                          sideOffset={8}
                        >
                          <Select.ScrollUpButton className="flex items-center justify-center border-b border-neutral-300 p-2.5 dark:border-neutral-800">
                            <CaretUp weight="bold" />
                          </Select.ScrollUpButton>

                          <Select.Viewport className="flex flex-col gap-2 rounded-lg p-1">
                            <Select.Item
                              className="flex select-none items-center justify-between gap-2 rounded-md border border-transparent p-1.5 data-[highlighted]:bg-neutral-100 data-[state='checked']:bg-primary-600 data-[highlighted]:text-neutral-800 data-[state='checked']:text-neutral-200 data-[disabled]:opacity-40 data-[highlighted]:outline-none dark:data-[highlighted]:bg-neutral-900 dark:data-[state='checked']:bg-primary-300 dark:data-[highlighted]:text-neutral-200 dark:data-[state='checked']:text-neutral-800"
                              value="item-1"
                            >
                              <Select.ItemText>Item 1</Select.ItemText>
                              <Select.ItemIndicator className="inline-flex items-center justify-center">
                                <Check weight="bold" />
                              </Select.ItemIndicator>
                            </Select.Item>
                            <Select.Item
                              className="flex select-none items-center justify-between gap-2 rounded-md border border-transparent p-1.5 data-[highlighted]:bg-neutral-100 data-[state='checked']:bg-primary-600 data-[highlighted]:text-neutral-800 data-[state='checked']:text-neutral-200 data-[disabled]:opacity-40 data-[highlighted]:outline-none dark:data-[highlighted]:bg-neutral-900 dark:data-[state='checked']:bg-primary-300 dark:data-[highlighted]:text-neutral-200 dark:data-[state='checked']:text-neutral-800"
                              value="item-2"
                            >
                              <Select.ItemText>Item 2</Select.ItemText>
                              <Select.ItemIndicator className="inline-flex items-center justify-center">
                                <Check weight="bold" />
                              </Select.ItemIndicator>
                            </Select.Item>
                            <Select.Item
                              className="flex select-none items-center justify-between gap-2 rounded-md border border-transparent p-1.5 data-[highlighted]:bg-neutral-100 data-[state='checked']:bg-primary-600 data-[highlighted]:text-neutral-800 data-[state='checked']:text-neutral-200 data-[disabled]:opacity-40 data-[highlighted]:outline-none dark:data-[highlighted]:bg-neutral-900 dark:data-[state='checked']:bg-primary-300 dark:data-[highlighted]:text-neutral-200 dark:data-[state='checked']:text-neutral-800"
                              value="item-3"
                            >
                              <Select.ItemText>Item 3</Select.ItemText>
                              <Select.ItemIndicator className="inline-flex items-center justify-center">
                                <Check weight="bold" />
                              </Select.ItemIndicator>
                            </Select.Item>
                            <Select.Item
                              className="flex select-none items-center justify-between gap-2 rounded-md border border-transparent p-1.5 data-[highlighted]:bg-neutral-100 data-[state='checked']:bg-primary-600 data-[highlighted]:text-neutral-800 data-[state='checked']:text-neutral-200 data-[disabled]:opacity-40 data-[highlighted]:outline-none dark:data-[highlighted]:bg-neutral-900 dark:data-[state='checked']:bg-primary-300 dark:data-[highlighted]:text-neutral-200 dark:data-[state='checked']:text-neutral-800"
                              value="item-4"
                            >
                              <Select.ItemText>Item 4</Select.ItemText>
                              <Select.ItemIndicator className="inline-flex items-center justify-center">
                                <Check weight="bold" />
                              </Select.ItemIndicator>
                            </Select.Item>
                            <Select.Item
                              className="flex select-none items-center justify-between gap-2 rounded-md border border-transparent p-1.5 data-[highlighted]:bg-neutral-100 data-[state='checked']:bg-primary-600 data-[highlighted]:text-neutral-800 data-[state='checked']:text-neutral-200 data-[disabled]:opacity-40 data-[highlighted]:outline-none dark:data-[highlighted]:bg-neutral-900 dark:data-[state='checked']:bg-primary-300 dark:data-[highlighted]:text-neutral-200 dark:data-[state='checked']:text-neutral-800"
                              value="item-5"
                            >
                              <Select.ItemText>Item 5</Select.ItemText>
                              <Select.ItemIndicator className="inline-flex items-center justify-center">
                                <Check weight="bold" />
                              </Select.ItemIndicator>
                            </Select.Item>
                            <Select.Item
                              className="flex select-none items-center justify-between gap-2 rounded-md border border-transparent p-1.5 data-[highlighted]:bg-neutral-100 data-[state='checked']:bg-primary-600 data-[highlighted]:text-neutral-800 data-[state='checked']:text-neutral-200 data-[disabled]:opacity-40 data-[highlighted]:outline-none dark:data-[highlighted]:bg-neutral-900 dark:data-[state='checked']:bg-primary-300 dark:data-[highlighted]:text-neutral-200 dark:data-[state='checked']:text-neutral-800"
                              value="item-6"
                            >
                              <Select.ItemText>Item 6</Select.ItemText>
                              <Select.ItemIndicator className="inline-flex items-center justify-center">
                                <Check weight="bold" />
                              </Select.ItemIndicator>
                            </Select.Item>
                          </Select.Viewport>

                          <Select.ScrollDownButton className="flex items-center justify-center border-t border-neutral-300 p-2.5 dark:border-neutral-800">
                            <CaretDown weight="bold" />
                          </Select.ScrollDownButton>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                    {errors.category ? (
                      <small className="text-red-700 text-sm font-medium">
                        {errors.category.message}
                      </small>
                    ) : null}
                  </>
                )}
              />
            </div>

            <fieldset className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label.Root className="font-medium" htmlFor="rating">
                  Rating
                </Label.Root>
                <input
                  className="flex w-full items-center rounded-lg border border-neutral-300 bg-neutral-50 px-2.5 py-1.5 placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:placeholder:text-neutral-600"
                  id="rating"
                  inputMode="numeric"
                  placeholder="ex. 50"
                  {...register("rating", {
                    setValueAs: (value) => (value ? Number(value) : undefined),
                    onChange: () => trigger(["rating", "ratingScale"]),
                  })}
                />
                {errors.rating ? (
                  <small className="text-red-700 text-sm font-medium">
                    {errors.rating.message}
                  </small>
                ) : null}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label.Root className="font-medium" htmlFor="ratingScale">
                  Rating Scale
                </Label.Root>
                <input
                  className="flex w-full items-center rounded-lg border border-neutral-300 bg-neutral-50 px-2.5 py-1.5 placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:placeholder:text-neutral-600"
                  id="ratingScale"
                  inputMode="numeric"
                  placeholder="ex. 100"
                  {...register("ratingScale", {
                    setValueAs: (value) => (value ? Number(value) : undefined),
                    onChange: () => trigger(["rating", "ratingScale"]),
                  })}
                />
                {errors.ratingScale ? (
                  <small className="text-red-700 text-sm font-medium">
                    {errors.ratingScale.message}
                  </small>
                ) : null}
              </div>
            </fieldset>

            <div className="flex flex-col gap-1.5">
              <Label.Root className="font-medium" htmlFor="review">
                Review <span className="text-red-700">*</span>
              </Label.Root>

              <textarea
                className="flex max-h-[480px] min-h-[240px] resize-y items-center rounded-lg border border-neutral-300 bg-neutral-50 bg-transparent p-2.5 placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:placeholder:text-neutral-600"
                id="review"
                placeholder="ex. Great experience, would recommend it again!"
                {...register("review")}
              />
              {errors.review ? (
                <small className="text-red-700 text-sm font-medium">
                  {errors.review.message}
                </small>
              ) : null}
            </div>
          </fieldset>

          <legend className="text-sm font-medium text-neutral-400 dark:text-neutral-600">
            Fields marked with <span className="text-red-700 text-base">*</span>{" "}
            are required.
          </legend>
        </section>

        <nav className="flex items-center gap-4">
          <button
            className="flex cursor-not-allowed items-center justify-center rounded-lg border border-neutral-700 px-4 py-2 font-bold opacity-40"
            disabled={disabled}
            type="button"
          >
            Save as draft
          </button>
          <button
            className="flex items-center justify-center rounded-lg border border-primary-600 bg-primary-600 px-4 py-2 font-bold text-neutral-200 disabled:cursor-not-allowed disabled:opacity-40 dark:border-primary-300 dark:bg-primary-300 dark:text-neutral-800"
            disabled={disabled}
            type="submit"
          >
            Publish review
          </button>
        </nav>
      </fetcher.Form>
    </main>
  );
}
