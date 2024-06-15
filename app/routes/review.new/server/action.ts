import { type ActionFunctionArgs, json } from "@remix-run/node";

import { requireUser } from "~/.server/service/auth";
import { prisma } from "~/.server/service/db";
import { reviewServerSchema } from "~/routes/review/helpers/helpers.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireUser(request);

  const formData = Object.fromEntries(await request.formData());
  const validatedData = reviewServerSchema.safeParse(formData);
  if (!validatedData.success) {
    return json({
      message: "Incorrect data sent, please try again.",
      status: "error" as const,
    });
  }

  try {
    const newReview = await prisma.review.create({
      data: {
        authorId: user.id,
        ...validatedData.data,
      },
    });
    return json({
      message: "Review created successfully!",
      status: "success" as const,
      newReview,
    });
  } catch {
    return json({
      message: "Something went wrong, please try again.",
      status: "error" as const,
    });
  }
};
