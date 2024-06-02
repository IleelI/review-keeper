import type { MetaFunction } from "@remix-run/node";
import { FormProvider } from "react-hook-form";

import Button from "~/components/atoms/Button";
import MainLayout from "~/components/layouts/MainLayout";

import FormFields from "../review/components/FormFields";

import useNewReviewPage, { CHARACTER_LIMIT } from "./hooks/useNewReviewPage";
import { action } from "./server/action";
import { loader } from "./server/loader";

export { action, loader };

export const meta: MetaFunction = () => [
  { title: "Review Creator | Review Keeper" },
];

const NewReviewPage = () => {
  const { categories, editor, form, handleFormReset, onSubmit } =
    useNewReviewPage();

  return (
    <MainLayout>
      <article className="flex w-full flex-col gap-8">
        <header className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
            Review Creator
          </h2>
        </header>
        <FormProvider {...form}>
          <form
            className="flex flex-col gap-10 lg:gap-12"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormFields
              categories={categories}
              characterLimit={CHARACTER_LIMIT}
              editor={editor}
            />

            <nav className="flex flex-col gap-4 sm:flex-row sm:gap-8">
              <Button
                disabled={!form.formState.isDirty}
                intent="text"
                onClick={handleFormReset}
                type="reset"
              >
                Reset Fields
              </Button>
              <Button disabled={!form.formState.isValid} type="submit">
                Create Review
              </Button>
            </nav>
          </form>
        </FormProvider>
      </article>
    </MainLayout>
  );
};

export default NewReviewPage;
