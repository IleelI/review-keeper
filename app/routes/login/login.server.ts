import { compare } from "bcrypt";

import { createErrorResponse, createSuccessResponse } from "utils/server";
import { Credentials, IdentifiedUser } from "~/server/auth.server";
import { prisma } from "~/server/db.server";

/**
 * Functio that identifies user and check if credentials are matching.
 * @returns identifiedUser is everything is ok, errorResponse if something went wrong.
 */
export const identifyUser = async ({ email, password }: Credentials) => {
  try {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return createErrorResponse({
        origin: "email" as const,
        error: "Invalid Email Address",
      });
    }

    const hashedPassword = user.hash;
    const areCredentialsValid = await compare(password, hashedPassword);
    if (!areCredentialsValid) {
      return createErrorResponse({
        origin: "password" as const,
        error: "Invalid Password.",
      });
    }

    const identifiedUser: IdentifiedUser = {
      email,
      id: user.id,
      username: user.username,
    };
    return createSuccessResponse(identifiedUser);
  } catch {
    return createErrorResponse({
      origin: "other" as const,
      error: "Something went wrong during login.",
    });
  }
};
