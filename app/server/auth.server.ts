import { User } from "@prisma/client";
import { createCookie } from "@remix-run/node";
import { SignJWT } from "jose";
import { z } from "zod";

import { createSuccessResponse, createErrorResponse } from "utils/server";

import { env } from "./env.server";

export const createJWT = async ({ email, id, username }: IdentifiedUser) => {
  const alg = "HS256";
  const secret = new TextEncoder().encode(env().JWT_SECRET);
  return await new SignJWT({
    email,
    id,
    username: username ?? undefined,
  })
    .setProtectedHeader({ alg, typ: "JWT" })
    .setIssuedAt()
    .setSubject(`user-${id}`)
    .setAudience(`review-keeper`)
    .setIssuer("review-keeper")
    .setExpirationTime("1h")
    .sign(secret);
};

export const JWTCookieName = "JWT";
export const JWTCookie = createCookie(JWTCookieName, {
  sameSite: "lax",
  httpOnly: true,
  secure: true,
  // 1 Hour
  maxAge: 60 * 60 * 1,
  secrets: [env().APP_SECRET],
});

export type IdentifiedUser = Pick<User, "email" | "username" | "id">;

export const credentialsSchema = z.object({
  email: z.string().trim().email("This is not a valid email."),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long."),
});
export type Credentials = z.infer<typeof credentialsSchema>;

/**
 * Function that validates credentials against credentialsSchema
 * @param request
 * @returns validatedData is everything formData is valid or validationErrors it's not.
 */
export const validateCredentials = async (request: Request) => {
  const formData = Object.fromEntries((await request.formData()) ?? []);
  const validateResult = await credentialsSchema.safeParseAsync(formData);
  return validateResult.success
    ? createSuccessResponse(validateResult.data)
    : createErrorResponse(validateResult.error.flatten().fieldErrors);
};

// TODO -> Add helper function that will check, validate and renew JWT.
