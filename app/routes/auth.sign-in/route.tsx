import { FormProvider } from "react-hook-form";

import BackButton from "../auth/components/BackButton";
import Header from "../auth/components/Header";

import SignInFormActions from "./components/SignInFormActions";
import SignInFormFields from "./components/SignInFormFields";
import useSignInPage from "./hooks/useSignInPage";
import { action } from "./server/action";
import { loader } from "./server/loader";

export { action, loader };

export default function SignIn() {
  const { backendError, form, handleSubmitSuccess, searchParams } =
    useSignInPage();

  return (
    <article className="grid lg:place-content-center">
      <div className="relative flex flex-col gap-12  pt-16 lg:w-[480px] lg:p-0">
        <BackButton />
        <Header
          firstMessage="Welcome back."
          secondMessage="You've been missed!"
          title="Let's sign you in"
        />
        <FormProvider {...form}>
          <form
            className="flex flex-[2] flex-col justify-between gap-12 lg:gap-20"
            onSubmit={form.handleSubmit(handleSubmitSuccess)}
          >
            <SignInFormFields />
            <SignInFormActions
              backendError={backendError}
              searchParams={searchParams}
            />
          </form>
        </FormProvider>
      </div>
    </article>
  );
}
