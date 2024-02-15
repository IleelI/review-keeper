import { User } from "@prisma/client";

import { prisma } from "~/server/db.server";

export type AppUser = Pick<User, "email" | "id" | "username">;

export const getUserById = async (userId: string): Promise<AppUser | null> => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  return user
    ? {
        email: user.email,
        id: user.id,
        username: user.username,
      }
    : null;
};
