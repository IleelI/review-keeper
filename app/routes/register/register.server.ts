import { hash } from "bcrypt";

import { createErrorResponse, createSuccessResponse } from "utils/server";
import { Credentials, TokenizedUser } from "~/server/auth.server";
import { prisma } from "~/server/db.server";

const handlePasswordHashing = (password: string, saltRounds = 10) => {
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

export const registerUser = async ({ email, password }: Credentials) => {
  try {
    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      return createErrorResponse({
        origin: "email" as const,
        error: "Email already in use.",
      });
    }

    const hash = await handlePasswordHashing(password);
    const createdUser = await prisma.user.create({
      data: {
        email,
        hash,
      },
    });
    const tokenizedUser: TokenizedUser = { id: createdUser.id };
    return createSuccessResponse(tokenizedUser);
  } catch (error) {
    return createErrorResponse({
      origin: "other" as const,
      error: "Failed to create a new account.",
    });
  }
};
