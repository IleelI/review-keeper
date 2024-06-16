import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().min(1),
  APP_SECRET: z.string().min(1),
  JWT_SECRET: z.string().min(1),
});

const env = envSchema.parse(process.env);

export { env };
