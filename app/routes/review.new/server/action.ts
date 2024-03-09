import { type ActionFunctionArgs, json } from "@remix-run/node";

import { requireUser } from "~/.server/service/auth";
import { prisma } from "~/.server/service/db";
import { reviewServerSchema } from "~/routes/review/helpers/helpers.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireUser(request);

  const formData = Object.fromEntries(await request.formData());
  const validatedData = reviewServerSchema.safeParse(formData);
  if (!validatedData.success) {
    return json({ error: "Incorrect data sent, please try again." });
  }

  try {
    const newReview = await prisma.review.create({
      data: {
        authorId: user.id,
        ...validatedData.data,
      },
    });
    return json({
      success: true as const,
      message: "Review created successfully!",
      newReview,
    });
  } catch {
    return json({
      error: "Something went wrong, please try again.",
    });
  }
};
