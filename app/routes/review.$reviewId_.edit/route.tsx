import { FormProvider } from "react-hook-form";

import Button from "~/components/atoms/Button";
import MainLayout from "~/components/layouts/MainLayout";

import FormFields from "../review/components/FormFields";

import useEditPage, { CHARACTER_LIMIT } from "./hooks/useEditReviewPage";
import { loader } from "./server/loader";

export { loader };

const ReviewEditPage = () => {
  const { categories, editor, form, handleFormReset } = useEditPage();

  return (
    <MainLayout>
      <FormProvider {...form}>
        <form className="flex flex-col gap-12">
          <FormFields
            categories={categories}
            characterLimit={CHARACTER_LIMIT}
            editor={editor}
          />

          <nav className="flex flex-col gap-4 sm:flex-row sm:gap-8">
            <Button intent="secondary" onClick={handleFormReset} type="reset">
              Restore Initial Values
            </Button>
            <Button type="submit">Update Review</Button>
          </nav>
        </form>
      </FormProvider>
    </MainLayout>
  );
};

export default ReviewEditPage;
