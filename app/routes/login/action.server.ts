import { json } from "@remix-run/node";

import {
  comparePasswords,
  createAccessToken,
  createRefreshToken,
  credentialsSchema,
  login,
  lookForUser,
} from "~/server/auth.server";
import { prisma } from "~/server/db.server";

export const handleLogin = async (request: Request) => {
  try {
    const formData = await request.formData();
    const parsedData = await credentialsSchema.safeParseAsync(
      Object.fromEntries(formData),
    );
    if (!parsedData.success) {
      return json({ type: "error", error: parsedData.error });
    }
    const credentials = parsedData.data;

    const user = await lookForUser(credentials.email);
    if (!user) {
      return json({ type: "error", error: "Email not found." });
    }

    const arePasswordsSame = await comparePasswords(
      credentials.password,
      user.hash,
    );
    if (!arePasswordsSame) {
      return json({ type: "error", error: "Incorrect password." });
    }

    const refreshToken = await createRefreshToken(user);
    const accessToken = await createAccessToken(user);
    await prisma.user.update({
      where: { email: user.email },
      data: { refreshToken },
    });

    return await login(refreshToken, accessToken);
  } catch {
    return null;
  }
};
