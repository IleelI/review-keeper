import { SafeParseReturnType, ZodSchema } from "zod";

export const parseFormData = <T>(
  formData: FormData,
  schema: ZodSchema<T>,
): SafeParseReturnType<T, T> => {
  const formDataObject = Object.fromEntries(formData ?? []);
  return schema.safeParse(formDataObject);
};
