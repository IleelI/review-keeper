import { compare, hash } from "bcrypt";
import { z } from "zod";

import { prisma } from "./db.server";
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

export const register = async ({
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

export const login = async ({
  email,
  password,
}: Credentials): Promise<BackendAction> => {
  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (!existingUser) {
    return {
      type: "error",
      origin: "client",
      message: "Account with given email doesn't exist.",
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
      message: "Successfully logged in.",
    };
  } catch (error) {
    return {
      type: "error",
      origin: "server",
      message: "Something went wrong while logging in.",
    };
  }
};
