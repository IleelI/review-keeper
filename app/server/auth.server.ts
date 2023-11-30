import { createCookie } from "@remix-run/node";
import { compare, hash } from "bcrypt";
import { SignJWT } from "jose";
import { z } from "zod";

import { prisma } from "./db.server";
import { env } from "./env.server";
import { BackendAction } from "./utils";

export const credentialsSchema = z.object({
  email: z.string().trim().email().min(1, "Login cannot be empty"),
  password: z
    .string()
    .trim()
    .min(8, "Password cannot be less 8 chracters long"),
});
type Credentials = z.infer<typeof credentialsSchema>;

const handleAsyncHashing = (password: string, saltRounds = 10) => {
  return new Promise<string>((resolve, reject) =>
    hash(password, saltRounds, async (error, hash) => {
      if (error) reject(error);
      try {
        resolve(hash);
      } catch {
        reject(error);
      }
    }),
  );
};

export const createAccount = async ({
  email,
  password,
}: Credentials): Promise<BackendAction> => {
  try {
    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser)
      return {
        type: "error",
        origin: "client",
        message: "Account with given email already exists.",
      };

    const hash = await handleAsyncHashing(password);
    await prisma.user.create({
      data: {
        email,
        hash,
      },
    });

    return {
      type: "success",
      message: "Account created successfully.",
    };
  } catch (error) {
    return {
      type: "error",
      origin: "server",
      message: "Something went wrong while creating account.",
    };
  }
};

export const checkCredentials = async ({
  email,
  password,
}: Credentials): Promise<BackendAction> => {
  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (!existingUser) {
    return {
      type: "error",
      origin: "client",
      message: "Account with a given email doesn't exist.",
    };
  }
  try {
    const validPassword = await compare(password, existingUser.hash);
    if (!validPassword) {
      return {
        type: "error",
        origin: "client",
        message: "Invalid password.",
      };
    }

    return {
      type: "success",
      message: "Valid credentials.",
    };
  } catch (error) {
    return {
      type: "error",
      origin: "server",
      message: "Something went wrong while checking credentials.",
    };
  }
};

export const JWTCookieName = "jwt-token";
export const JWTCookie = createCookie(JWTCookieName, {
  // Two hours
  maxAge: 60 * 60 * 2,
  sameSite: "lax",
  httpOnly: true,
  secrets: [env().APP_SECRET],
});

export const createJWT = async () => {
  const alg = "HS256";
  const secret = new TextEncoder().encode(env().JWT_SECRET);
  const token = await new SignJWT({
    testField: "test",
  })
    .setProtectedHeader({ alg, typ: "JWT" })
    .setIssuedAt()
    .setSubject("review-keeper")
    .setAudience("review-keeper")
    .setIssuer("review-keeper")
    .setExpirationTime("2h")
    .sign(secret);

  return token;
};

export const login = async (credentials: Credentials) => {
  const credentialsResponse = await checkCredentials(credentials);
  if (credentialsResponse.type === "error") {
    return credentialsResponse;
  }
  const token = await createJWT();
  return token;
};
