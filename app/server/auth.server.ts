import { User } from "@prisma/client";
import { createCookie, redirect } from "@remix-run/node";
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { z } from "zod";

import { createSuccessResponse, createErrorResponse } from "utils/server";
import { AppUser, getUserById } from "~/models/user";

import {
  createEmptyCookie,
  getAuthCookieHeaders,
  getCookieData,
} from "./cookie.server";
import { prisma } from "./db.server";
import { env } from "./env.server";

// Login/Register Form Helpers

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

// JWT Helper Functions and JWT Settings

export type TokenizedUser = Pick<User, "id">;
export type TokenPayload = JWTPayload & TokenizedUser;

export const ISSUER = "review-keeper";
export const AUDIENCE = "review-keeper";
/**
 * Helper function that creates a signed JSON Web Token encoded with HS256 algorithm.
 * @param payload any valid object that can be serialized
 * @param duration measured in seconds
 * @returns a valid and signed JWT or throws an error.
 */
export const createJWT = async (duration: number, payload: TokenizedUser) => {
  const alg = "HS256";
  const secret = new TextEncoder().encode(env().JWT_SECRET);
  const timestamp = Math.floor(Date.now() / 1000);
  const expirationTime = timestamp + duration;

  return await new SignJWT({
    ...payload,
  })
    .setProtectedHeader({ alg, typ: "JWT" })
    .setAudience(AUDIENCE)
    .setIssuer(ISSUER)
    .setIssuedAt(timestamp)
    .setExpirationTime(expirationTime)
    .sign(secret);
};

/**
 * Helper function that verifies a signed JSON Web Token.
 * @param tokenString token that's being verified.
 * @returns decoded token or null if token is invalid.
 */
export const getVerifiedJWT = async (tokenString: string) => {
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

// Auth cookie definitions, constants and function helpers

/**
 * Access token duration measured in seconds (5 minutes)
 */
export const accessTokenDuration = 60 * 5;
export const accessTokenCookieName = "accessToken";
export const accessTokenCookie = createCookie(accessTokenCookieName, {
  httpOnly: true,
  maxAge: accessTokenDuration,
  sameSite: "lax",
  secrets: [env().APP_SECRET],
});

/**
 * Helper function that extracts access token from cookie
 * @param request
 * @returns string token or null if cookie or value doesn't exist.
 */
export const getAccessTokenFromCookie = async (request: Request) => {
  const cookieData = await getCookieData(request, accessTokenCookie);
  const accessToken = cookieData?.[accessTokenCookieName];
  return typeof accessToken === "string" ? accessToken : null;
};

/**
 * Refresh token duration measured in seconds (1 week)
 */
export const refreshTokenDuration = 60 * 60 * 7;
export const refreshTokenCookieName = "refreshToken";
export const refreshTokenCookie = createCookie(refreshTokenCookieName, {
  httpOnly: true,
  maxAge: refreshTokenDuration,
  sameSite: "lax",
  secrets: [env().APP_SECRET],
});

/**
 * Helper function that extracts refresh token from cookie
 * @param request
 * @returns string token or null if cookie or value doesn't exist.
 */
export const getRefreshTokenFromCookie = async (request: Request) => {
  const cookieData = await getCookieData(request, refreshTokenCookie);
  const refreshToken = cookieData?.[refreshTokenCookieName];
  return typeof refreshToken === "string" ? refreshToken : null;
};

// Initial Auth helper functions (only to be used once)

export const invalidateRefreshToken = async (request: Request) => {
  const refreshTokenFromCookie = await getRefreshTokenFromCookie(request);
  if (!refreshTokenFromCookie) {
    return null;
  }

  const verifiedRefreshToken = await getVerifiedJWT(refreshTokenFromCookie);
  if (!verifiedRefreshToken) {
    throw await logout();
  }

  const { id } = verifiedRefreshToken.payload as TokenPayload;
  const userWithToken = await prisma.user.findFirst({
    where: { id },
    select: { refreshToken: true },
  });
  if (!userWithToken || userWithToken.refreshToken !== refreshTokenFromCookie) {
    throw await logout();
  }

  return { id, verifiedRefreshToken, refreshTokenFromCookie };
};

/**
 * Helper function that tries to retrieve access token.
 * @param request
 * @returns a valid access token or null if access token cannot be obtained/created
 */
export const getInitialAccessToken = async (request: Request) => {
  const invalidatedData = await invalidateRefreshToken(request);
  if (!invalidatedData) {
    return null;
  }

  const accessTokenFromCookie = await getAccessTokenFromCookie(request);
  if (accessTokenFromCookie && (await getVerifiedJWT(accessTokenFromCookie))) {
    return accessTokenFromCookie;
  }
  const { id } = invalidatedData;
  return await createJWT(accessTokenDuration, { id });
};

/**
 * Helper function that tries to get a user with current access token.
 * @param request
 * @return User with access token if they exist, logout is thrown when user is not found in database, else null is returned.
 */
export const getInitialUserWithAccessToken = async (request: Request) => {
  const accessToken = await getInitialAccessToken(request);
  if (!accessToken) return null;

  const token = await getVerifiedJWT(accessToken);
  if (!token) return null;

  const tokenPayload = token.payload as TokenPayload;
  const user = await getUserById(tokenPayload.id);
  if (!user) throw await logout();

  return { accessToken, user };
};

// Generic Auth helper function

/**
 * Helepr function that helps to get tokenized user info from the access token.
 * This function doesn't make any connection to the database.
 * @param request
 * @returns TokenizedUser or null
 */
export const getTokenizedUser = async (
  request: Request,
): Promise<TokenizedUser | null> => {
  const accessToken = await getAccessTokenFromCookie(request);
  if (!accessToken) {
    return null;
  }

  const tokenWithPayload = await getVerifiedJWT(accessToken);
  if (!tokenWithPayload) {
    return null;
  }

  const { id } = tokenWithPayload.payload as TokenPayload;
  return {
    id,
  };
};

/**
 * Helepr function that is a protected version of getTokenizedUser.
 * If user is not found then the client is redirected to the login page.
 * @param request
 * @param redirectTo, a place in the application to redirect user back once login is successful
 * @returns TokenizedUser or null
 */
export const getRequiredTokenizedUser = async (
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

/**
 * Helper function that gets the user data from the database
 * @param request
 * @returns AppUser or null if user cannot be found.
 */
export const getUser = async (request: Request): Promise<AppUser | null> => {
  const tokenizedUser = await getTokenizedUser(request);
  if (!tokenizedUser) return null;

  const user = await getUserById(tokenizedUser.id);
  if (!user) {
    throw await logout();
  }

  return user;
};

/**
 * Helper function that generates a pair of [accessToken, refreshToken], additionally refresh token is replaced in database
 * @param user
 * @returns object {accessToken, refreshToken}
 */
export const generateAuthTokens = async (user: TokenizedUser) => {
  const accessToken = await createJWT(accessTokenDuration, user);
  const refreshToken = await createJWT(refreshTokenDuration, user);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken,
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const login = async (
  accessToken: string,
  refreshToken: string,
  redirectPath = "/",
) => {
  const serializedAccessToken = await accessTokenCookie.serialize({
    [accessTokenCookieName]: accessToken,
  });
  const serializedRefreshToken = await refreshTokenCookie.serialize({
    [refreshTokenCookieName]: refreshToken,
  });
  const authCookieHeaders = getAuthCookieHeaders(
    serializedAccessToken,
    serializedRefreshToken,
  );

  return redirect(redirectPath, {
    headers: authCookieHeaders,
  });
};

export const logout = async () => {
  const serializedAccessToken = await createEmptyCookie(accessTokenCookie);
  const serializedRefreshToken = await createEmptyCookie(refreshTokenCookie);
  const authCookieHeaders = getAuthCookieHeaders(
    serializedAccessToken,
    serializedRefreshToken,
  );

  return redirect("/", {
    headers: authCookieHeaders,
  });
};
