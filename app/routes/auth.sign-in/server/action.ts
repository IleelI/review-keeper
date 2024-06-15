import { type ActionFunctionArgs, json } from "@vercel/remix";
import { z } from "zod";

import type { AppUser } from "~/.server/data/user";
import {
  lookForUser,
  comparePasswords,
  createRefreshToken,
  createAccessToken,
  signIn,
} from "~/.server/service/auth";
import { prisma } from "~/.server/service/db";
import { credentialsSchema } from "~/schema/auth.schema";
import { getSafeRedirect } from "~/utils/routing";

const signInServerSchema = credentialsSchema.extend({
  redirectTo: z.string().optional(),
  rememberMe: z.union([z.literal("true"), z.literal("false")]).optional(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();
    const parsedData = signInServerSchema.safeParse(
      Object.fromEntries(formData),
    );
    if (!parsedData.success) {
      return json({ error: "Invalid email and/or password." });
    }

    const { email, password, redirectTo, rememberMe } = parsedData.data;
    const user = await lookForUser(email);
    if (!user) {
      return json({ error: "Email not found." });
    }

    const arePasswordsSame = await comparePasswords(password, user.hash);
    if (!arePasswordsSame) {
      return json({ error: "Incorrect password." });
    }
    const { createdAt, id, username } = user;
    const tokenUser: AppUser = {
      createdAt: createdAt.toISOString(),
      email,
      id,
      username,
    };
    const refreshToken = await createRefreshToken(
      tokenUser,
      rememberMe === "true",
    );
    const accessToken = await createAccessToken(tokenUser);
    await prisma.user.update({
      where: { email: user.email },
      data: { refreshToken },
    });

    return await signIn(refreshToken, accessToken, getSafeRedirect(redirectTo));
  } catch {
    return json({
      error: "Something went wrong while signing in.",
    });
  }
};
