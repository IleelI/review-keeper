import { json, type LoaderFunctionArgs } from "@remix-run/node";

import { getReviewCategories } from "~/.server/data/review";
import { getRequiredUser } from "~/.server/service/auth";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await getRequiredUser(request);

  const categories = await getReviewCategories();

  return json({ categories });
};
