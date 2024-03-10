import { FormProvider } from "react-hook-form";

import Button from "~/components/atoms/Button";
import MainLayout from "~/components/layouts/MainLayout";

import FormFields from "../review/components/FormFields";

import useEditPage, { CHARACTER_LIMIT } from "./hooks/useEditReviewPage";
import { action } from "./server/action";
import { loader } from "./server/loader";

export { loader };

export { action };

const ReviewEditPage = () => {
  const {
    categories,
    editor,
    form,
    handleFormReset,
    isFormDisabled,
    onSubmit,
  } = useEditPage();

  return (
    <MainLayout>
      <FormProvider {...form}>
        <form
          className="relative flex flex-col gap-8"
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
              Restore Initial Values
            </Button>
            <Button disabled={isFormDisabled} type="submit">
              Update Review
            </Button>
          </nav>
        </form>
      </FormProvider>
    </MainLayout>
  );
};

export default ReviewEditPage;
