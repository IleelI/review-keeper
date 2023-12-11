import { faker } from "@faker-js/faker";
import { json } from "@remix-run/node";
import { hashSync } from "bcrypt";

import {
  createAccessToken,
  createRefreshToken,
  credentialsSchema,
  login,
  lookForUser,
} from "~/server/auth.server";
import { prisma } from "~/server/db.server";

export const handleRegister = async (request: Request) => {
  try {
    const formData = await request.formData();
    const parsedCredentials = credentialsSchema.safeParse(
      Object.fromEntries(formData),
    );
    if (!parsedCredentials.success) {
      return json({ type: "error", error: parsedCredentials.error });
    }
    const credentials = parsedCredentials.data;

    const existingUser = await lookForUser(credentials.email);
    if (existingUser) {
      return json({
        type: "error",
        error: "Account with this email already exists.",
      });
    }

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
