import { User } from "@prisma/client";
import { createCookie, redirect } from "@remix-run/node";
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { z } from "zod";

import { createSuccessResponse, createErrorResponse } from "utils/server";
import { getUserById } from "~/models/user";

import { env } from "./env.server";

export type TokenizedUser = Pick<User, "id">;
export type JWTTokenPayload = JWTPayload & TokenizedUser;

export const ISSUER = "review-keeper";
export const AUDIENCE = "review-keeper";
export const createJWT = async ({ id }: TokenizedUser) => {
  const alg = "HS256";
  const secret = new TextEncoder().encode(env().JWT_SECRET);
  return await new SignJWT({
    id,
  })
    .setProtectedHeader({ alg, typ: "JWT" })
    .setIssuedAt()
    .setSubject(`user-${id}`)
    .setAudience(AUDIENCE)
    .setIssuer(ISSUER)
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

export const getTokenFromCookie = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await JWTCookie.parse(cookieHeader)) || {};
  if ("token" in cookie && typeof cookie.token === "string") {
    return cookie.token as string;
  } else {
    return null;
  }
};

export const verifyToken = async (tokenString: string) => {
  try {
    const secret = new TextEncoder().encode(env().JWT_SECRET);
    return await jwtVerify(tokenString, secret, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
  } catch (error) {
    console.log("Invalid JWT");
    return null;
  }
};

export const getTokenizedUser = async (request: Request) => {
  const tokenString = await getTokenFromCookie(request);
  if (!tokenString) return null;

  const token = await verifyToken(tokenString);
  if (!token) return null;

  const tokenPayload = token.payload as JWTTokenPayload;
  const user: TokenizedUser = {
    id: tokenPayload.id,
  };

  return user;
};

export const getUser = async (request: Request) => {
  const tokenizedUser = await getTokenizedUser(request);
  if (!tokenizedUser) return null;

  const user = await getUserById(tokenizedUser.id);
  if (user) return user;

  throw await logout();
};

export const requireUser = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) => {
  const jwtUser = await getTokenizedUser(request);
  if (!jwtUser) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return jwtUser;
};

export const login = async (token: string, redirectPath = "/") => {
  return redirect(redirectPath, {
    headers: {
      "Set-Cookie": await JWTCookie.serialize({
        token,
      }),
    },
  });
};

export const logout = async () => {
  return redirect("/", {
    headers: {
      "Set-Cookie": await JWTCookie.serialize("", {
        maxAge: 0,
      }),
    },
  });
};
