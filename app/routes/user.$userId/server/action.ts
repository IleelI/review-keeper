import { invariant } from "@epic-web/invariant";
import { json, type ActionFunctionArgs } from "@remix-run/node";

import { requireUser, getRequiredUser } from "~/.server/service/auth";
import { prisma } from "~/.server/service/db";

import { userProfileSchema } from "../components/UserProfile";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.userId, "userId is required.");
  await requireUser(request);
  switch (request.method) {
    case "POST": {
      try {
        const {
          email: oldEmail,
          id,
          username: oldUsername,
        } = await getRequiredUser(request);
        const formData = Object.fromEntries(await request.formData());
        const parsedUserProfile = userProfileSchema.safeParse(formData);
        if (parsedUserProfile.error) {
          return {
            status: "error" as const,
            message: "Invalide email/username.",
          };
        }

        const { email: newEmail, username: newUsername } =
          parsedUserProfile.data;

        const emailAlreadyInUse =
          newEmail !== oldEmail &&
          Boolean(
            await prisma.user.findFirst({
              where: { email: newEmail },
            }),
          );
        if (emailAlreadyInUse) {
          return json({
            status: "error" as const,
            message: "Email is already in use.",
          });
        }

        const usernameAlreadyInUse =
          newUsername !== oldUsername &&
          Boolean(
            await prisma.user.findFirst({ where: { username: newUsername } }),
          );
        if (usernameAlreadyInUse) {
          return json({
            status: "error" as const,
            message: "Username is already in use.",
          });
        }

        const { email: updatedEmail, username: updatedUsername } =
          await prisma.user.update({
            where: { id },
            data: { email: newEmail, username: newUsername },
          });

        return json({
          status: "success" as const,
          message: "Account updated successfully.",
          data: {
            email: updatedEmail,
            redirect: false,
            username: updatedUsername,
          },
        });
      } catch (error) {
        console.error(error);
        return json({
          status: "error" as const,
          message: "Something went wrong while updating user profile.",
        });
      }
    }
    case "DELETE": {
      try {
        const { email, id, username } = await getRequiredUser(request);
        await prisma.user.delete({ where: { id } });
        return json({
          status: "success" as const,
          message: "Account removed successfully, redirecting to the homepage.",
          data: {
            redirect: true,
            email,
            username,
          },
        });
      } catch (error) {
        console.error(error);
        return json({
          status: "error" as const,
          message: "Something went wrong while deleting user profile.",
        });
      }
    }
    default: {
      console.error("Unknown method!");
      return null;
    }
  }
};
