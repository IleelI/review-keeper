import { faker } from "@faker-js/faker";
import { createCookie, redirect, redirectDocument } from "@remix-run/node";
import { compare, hashSync } from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";

import { AppUser, getUserById } from "~/models/user";

import { prisma } from "./db.server";
import { env } from "./env.server";

export const credentialsSchema = z.object({
  email: z
    .string()
    .email("Invalid email address.")
    .trim()
    .min(1, "Email cannot be empty."),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 chracters long."),
});
export type Credentials = z.infer<typeof credentialsSchema>;

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

export const refreshTokenDuration = 60 * 60 * 24 * 7;

export const refreshTokenCookie = createCookie("refreshToken", {
  sameSite: "lax",
  httpOnly: true,
  secrets: [env().APP_SECRET],
  maxAge: refreshTokenDuration,
  secure: env().NODE_ENV === "production",
});

export const accessTokenDuration = 60 * 5;

export const accessTokenCookie = createCookie("accessToken", {
  sameSite: "lax",
  httpOnly: true,
  secrets: [env().APP_SECRET],
  maxAge: accessTokenDuration,
  secure: env().NODE_ENV === "production",
});

export const lookForUser = async (email: string) => {
  return await prisma.user.findFirst({
    where: {
      email,
    },
  });
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string,
) => {
  return await compare(password, hashedPassword);
};

export const createUser = async (credentials: Credentials) => {
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

export const createRefreshToken = async ({ email, id, username }: AppUser) => {
  return await createJWT(refreshTokenDuration, {
    email,
    id,
    username,
  } as AppUser);
};

export const createAccessToken = async ({ email, id, username }: AppUser) => {
  return await createJWT(accessTokenDuration, {
    email,
    id,
    username,
  } as AppUser);
};

export const login = async (refreshToken: string, accessToken: string) => {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    await refreshTokenCookie.serialize(refreshToken),
  );
  headers.append("Set-Cookie", await accessTokenCookie.serialize(accessToken));

  return redirect("/", {
    headers,
  });
};

export const logout = async () => {
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
    const verifiedToken = await jwtVerify(token, secret);
    const userToken = verifiedToken.payload as AppUser;
    return userToken;
  } catch {
    return null;
  }
};

export const getUser = async (request: Request) => {
  const cookies = request.headers.get("Cookie");
  const accessToken = await accessTokenCookie.parse(cookies);
  const refreshToken = await refreshTokenCookie.parse(cookies);
  if (!accessToken && refreshToken) {
    throw redirectDocument("/refresh");
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
  if (!user) throw await logout();
  return user;
};

export const returnPathSearchParam = "return-path";
export const requireUser = async (request: Request) => {
  const cookies = request.headers.get("Cookie");
  const [accessToken, refreshToken] = await Promise.all([
    accessTokenCookie.parse(cookies),
    refreshTokenCookie.parse(cookies),
  ]);

  if (accessToken) {
    const userToken = await getUserToken(accessToken);
    if (!userToken) throw await logout();
    return userToken;
  } else if (!refreshToken) {
    throw await logout();
  } else {
    const returnPath = new URL(request.url).pathname;
    throw redirectDocument(`/refresh?${returnPathSearchParam}=${returnPath}`);
  }
};
