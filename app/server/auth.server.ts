import { faker } from "@faker-js/faker";
import { createCookie, redirect, redirectDocument } from "@remix-run/node";
import { compare, hashSync } from "bcrypt";
import { SignJWT, jwtVerify } from "jose";

import { AppUser, getUserById } from "~/models/user";
import { CredentialsSchema } from "~/schema/auth.schema";
import { getSafeRedirect } from "~/utils/routing/routing";

import { prisma } from "./db.server";
import { env } from "./env.server";

export const createJWT = async (
  duration: number,
  payload?: Record<string, unknown>,
) => {
  const alg = "HS512";
  const secret = new TextEncoder().encode(env().JWT_SECRET);

  const timestamp = Math.floor(Date.now() / 1000);
  const expiration = timestamp + duration;

  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg })
    .setAudience("review-keeper")
    .setExpirationTime(expiration)
    .setIssuedAt(timestamp)
    .setIssuer("review-keeper")
    .setSubject("review-keeper")
    .sign(secret);
};

// One week
export const refreshTokenDuration = 60 * 60 * 24 * 7;
// One hour
export const shortRefreshTokenDuration = 60 * 60;

export const refreshTokenCookie = createCookie("refreshToken", {
  sameSite: "lax",
  httpOnly: true,
  secrets: [env().APP_SECRET],
  maxAge: refreshTokenDuration,
  secure: env().NODE_ENV === "production",
});

// Five minutes
export const accessTokenDuration = 60 * 5;

export const accessTokenCookie = createCookie("accessToken", {
  sameSite: "lax",
  httpOnly: true,
  secrets: [env().APP_SECRET],
  maxAge: accessTokenDuration,
  secure: env().NODE_ENV === "production",
});

export const lookForUser = async (email: string) => {
  try {
    return await prisma.user.findFirst({
      where: {
        email,
      },
    });
  } catch {
    return null;
  }
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string,
) => {
  try {
    return await compare(password, hashedPassword);
  } catch {
    return false;
  }
};

export const createUser = async (credentials: CredentialsSchema) => {
  try {
    const hashedPassword = hashSync(credentials.password, 10);
    const user = await prisma.user.create({
      data: {
        email: credentials.email,
        hash: hashedPassword,
        username: `${faker.word.adjective()}-${faker.animal.type()}${faker.number.int(
          { max: 10_000 },
        )}`,
      },
    });
    return user;
  } catch {
    return null;
  }
};

export const createRefreshToken = async (
  { email, id, username }: AppUser,
  rememberUser = true,
) => {
  return await createJWT(
    rememberUser ? refreshTokenDuration : shortRefreshTokenDuration,
    {
      email,
      id,
      username,
    } as AppUser,
  );
};

export const createAccessToken = async ({ email, id, username }: AppUser) => {
  return await createJWT(accessTokenDuration, {
    email,
    id,
    username,
  } as AppUser);
};

export const signIn = async (
  refreshToken: string,
  accessToken: string,
  redirectTo = "/",
) => {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    await refreshTokenCookie.serialize(refreshToken),
  );
  headers.append("Set-Cookie", await accessTokenCookie.serialize(accessToken));

  return redirect(redirectTo, {
    headers,
  });
};

export const signOut = async () => {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    await refreshTokenCookie.serialize("", { maxAge: 0 }),
  );
  headers.append(
    "Set-Cookie",
    await accessTokenCookie.serialize("", { maxAge: 0 }),
  );

  return redirect("/", {
    headers,
  });
};

export const getUserToken = async (token: string) => {
  try {
    const secret = new TextEncoder().encode(env().JWT_SECRET);
    const verifiedToken = await jwtVerify(token, secret, { clockTolerance: 0 });
    if (!verifiedToken) return null;
    return verifiedToken.payload as AppUser;
  } catch {
    return null;
  }
};

export const getUser = async (request: Request) => {
  const cookies = request.headers.get("Cookie");
  const accessToken = await accessTokenCookie.parse(cookies);
  const refreshToken = await refreshTokenCookie.parse(cookies);

  if (!accessToken && refreshToken) {
    const { searchParams, pathname } = new URL(request.url);
    const redirectTo = getSafeRedirect(
      searchParams.get("redirectTo") || pathname,
    );
    const newSearchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirectDocument(`/refresh?${newSearchParams}`);
  }

  const userToken = await getUserToken(accessToken);
  if (!userToken) return null;

  try {
    return await getUserById(userToken.id);
  } catch {
    return null;
  }
};

export const getRequiredUser = async (request: Request) => {
  const user = await getUser(request);
  if (!user) throw await signOut();
  return user;
};

export const requireUser = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) => {
  const cookies = request.headers.get("Cookie");
  const [accessToken, refreshToken] = await Promise.all([
    accessTokenCookie.parse(cookies),
    refreshTokenCookie.parse(cookies),
  ]);
  const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);

  if (accessToken) {
    const userToken = await getUserToken(accessToken);
    if (!userToken) throw redirect(`/sign-in?${searchParams}`);
    return userToken;
  } else if (!refreshToken) {
    throw redirect(`/sign-in?${searchParams}`);
  } else {
    throw redirectDocument(`/refresh?${searchParams}`);
  }
};
