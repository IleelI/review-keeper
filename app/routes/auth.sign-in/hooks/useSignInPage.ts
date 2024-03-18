import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher, useSearchParams } from "@remix-run/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { credentialsSchema } from "~/schema/auth.schema";
import { getSafeRedirect } from "~/utils/routing";

import type { action } from "../server/action";

export const signInSchema = credentialsSchema.extend({
  redirectTo: z.string().optional(),
  rememberMe: z.boolean().optional(),
});
export type SignInSchema = z.infer<typeof signInSchema>;

const useSignInPage = () => {
  const fetcher = useFetcher<typeof action>();
  const [searchParams] = useSearchParams();
  const form = useForm<SignInSchema>({
    defaultValues: {
      email: "",
      password: "",
      redirectTo: getSafeRedirect(searchParams.get("redirectTo")),
      rememberMe: true,
    },
    resolver: zodResolver(signInSchema),
  });
  const backendError = fetcher.data?.error;

  const handleSubmitSuccess: SubmitHandler<SignInSchema> = (data) =>
    fetcher.submit(data, { method: "post" });

  return {
    backendError,
    form,
    handleSubmitSuccess,
    searchParams,
  };
};

export default useSignInPage;
