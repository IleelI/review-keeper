import { z } from "zod";

export const credentialsSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Invalid email address."),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 chracters long."),
});
export type CredentialsSchema = z.infer<typeof credentialsSchema>;
