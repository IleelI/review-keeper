import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher, useSearchParams } from "@remix-run/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import {
  credentialsSchema,
  type CredentialsSchema,
} from "~/schema/auth.schema";
import { getSafeRedirect } from "~/utils/routing";

import type { action } from "../server/action";

export const signUpSchema = credentialsSchema.extend({
  redirectTo: z.string().optional(),
});
export type SignUpSchema = z.infer<typeof signUpSchema>;

const useSignUpPage = () => {
  const fetcher = useFetcher<typeof action>();
  const [searchParams] = useSearchParams();
  const form = useForm<SignUpSchema>({
    defaultValues: {
      email: "",
      password: "",
      redirectTo: getSafeRedirect(searchParams.get("redirectTo")),
    },
    resolver: zodResolver(signUpSchema),
  });
  const backendError = fetcher.data?.error;

  const handleSubmitSuccess: SubmitHandler<CredentialsSchema> = (data) => {
    fetcher.submit(data, { method: "post" });
  };

  return {
    backendError,
    form,
    handleSubmitSuccess,
    searchParams,
  };
};

export default useSignUpPage;
