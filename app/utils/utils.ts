import { SafeParseReturnType, ZodSchema } from "zod";

export const parseFormData = <T>(
  formData: FormData,
  schema: ZodSchema<T>,
): SafeParseReturnType<T, T> => {
  const formDataObject = Object.fromEntries(formData ?? []);
  return schema.safeParse(formDataObject);
};

const DEFAULT_REDIRECT = "/";

export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}
