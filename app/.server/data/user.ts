import { User } from "@prisma/client";

import { prisma } from "../service/db";

export type AppUser = Pick<User, "email" | "id" | "username">;

export const getUserById = async (userId: string): Promise<AppUser | null> => {
  try {
    return prisma.user.findFirst({
      where: { id: userId },
      select: { email: true, id: true, username: true },
    });
  } catch {
    return null;
  }
};

export const getUserReviews = async (userId: string) => {
  try {
    return await prisma.review.findMany({
      where: {
        authorId: userId,
      },
    });
  } catch {
    return [];
  }
};
