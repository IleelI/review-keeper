import { FormProvider } from "react-hook-form";

import Button from "~/components/atoms/Button";
import MainLayout from "~/components/layouts/MainLayout";

import FormFields from "../review/components/FormFields";

import useNewReviewPage, { CHARACTER_LIMIT } from "./hooks/useNewReviewPage";
import { action } from "./server/action";
import { loader } from "./server/loader";

export { action, loader };

const NewReviewPage = () => {
  const { categories, editor, form, handleFormReset, onSubmit } =
    useNewReviewPage();

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
              Reset Fields
            </Button>
            <Button size="lg" type="submit">
              Create Review
            </Button>
          </nav>
        </form>
      </FormProvider>
    </MainLayout>
  );
};

export default NewReviewPage;
