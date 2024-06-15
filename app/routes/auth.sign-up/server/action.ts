import { json, type ActionFunctionArgs } from "@vercel/remix";
import { z } from "zod";

import type { AppUser } from "~/.server/data/user";
import {
  lookForUser,
  createUser,
  createRefreshToken,
  createAccessToken,
  signIn,
} from "~/.server/service/auth";
import { prisma } from "~/.server/service/db";
import { credentialsSchema } from "~/schema/auth.schema";
import { getSafeRedirect } from "~/utils/routing";

const signUpSchema = credentialsSchema.extend({
  redirectTo: z.string().optional(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();
    const parsedForm = signUpSchema.safeParse(Object.fromEntries(formData));
    if (!parsedForm.success) {
      return json({
        error: "Invalid email and/or password",
      });
    }

    const { redirectTo, ...credentials } = parsedForm.data;
    const existingUser = await lookForUser(credentials.email);
    if (existingUser) {
      return json({
        error: "Account with this email already exists.",
      });
    }

    const user = await createUser(credentials);
    if (!user) {
      return json({
        error: "Something went wrong while creating account.",
      });
    }
    const { createdAt, email, id, username } = user;
    const tokenUser: AppUser = {
      createdAt: createdAt.toISOString(),
      email,
      id,
      username,
    };
    const refreshToken = await createRefreshToken(tokenUser);
    const accessToken = await createAccessToken(tokenUser);
    await prisma.user.update({
      where: { email: user.email },
      data: { refreshToken },
    });

    return await signIn(refreshToken, accessToken, getSafeRedirect(redirectTo));
  } catch {
    return json({
      error: "Something went wrong while signing up.",
    });
  }
};
