import { FormProvider } from "react-hook-form";

import BackButton from "../auth/components/BackButton";
import Header from "../auth/components/Header";

import SignUpFormActions from "./components/SignUpFormActions";
import SignUpFormFields from "./components/SignUpFormFields";
import useSignUpPage from "./hooks/useSignUpPage";
import { action } from "./server/action";
import { loader } from "./server/loader";

export { action, loader };

export default function SignUpPage() {
  const { backendError, form, handleSubmitSuccess, searchParams } =
    useSignUpPage();

  return (
    <article className="grid lg:place-content-center">
      <div className="relative flex flex-col gap-12 pt-16 lg:w-[480px] lg:p-0">
        <BackButton />
        <Header
          firstMessage="Welcome to Review Keeper."
          secondMessage="Great to see you here!"
          title="Let's sign you up"
        />
        <FormProvider {...form}>
          <form
            className="flex flex-[2] flex-col justify-between gap-12 lg:gap-20"
            onSubmit={form.handleSubmit(handleSubmitSuccess)}
          >
            <SignUpFormFields />
            <SignUpFormActions
              backendError={backendError}
              searchParams={searchParams}
            />
          </form>
        </FormProvider>
      </div>
    </article>
  );
}
