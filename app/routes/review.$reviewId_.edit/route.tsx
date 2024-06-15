import type { MetaFunction } from "@vercel/remix";
import { FormProvider } from "react-hook-form";

import MainLayout from "~/components/layouts/MainLayout";

import FormFields from "../review/components/FormFields";

import ReviewEditFormActions from "./components/ReviewEditFormActions";
import ReviewEditHeader from "./components/ReviewEditHeader";
import useEditPage, { CHARACTER_LIMIT } from "./hooks/useEditReviewPage";
import { action } from "./server/action";
import { loader } from "./server/loader";

export { action, loader };

export const meta: MetaFunction = () => [
  { title: "Review Page Edit | Review Keeper" },
];

const ReviewEditPage = () => {
  const {
    categories,
    editor,
    form,
    handleFormReset,
    isFormDisabled,
    isFormResetDisabled,
    reviewId,
    onSubmit,
  } = useEditPage();

  return (
    <MainLayout>
      <article className="flex flex-col gap-10 lg:gap-12">
        <ReviewEditHeader reviewId={reviewId} />
        <FormProvider {...form}>
          <form
            className="relative flex flex-col gap-10 lg:gap-12"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormFields
              categories={categories}
              characterLimit={CHARACTER_LIMIT}
              editor={editor}
            />
            <ReviewEditFormActions
              handleFormReset={handleFormReset}
              isFormDisabled={isFormDisabled}
              isFormResetDisabled={isFormResetDisabled}
            />
          </form>
        </FormProvider>
      </article>
    </MainLayout>
  );
};

export default ReviewEditPage;
