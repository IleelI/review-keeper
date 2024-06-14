import { invariant } from "@epic-web/invariant";
import { type LoaderFunctionArgs, json } from "@remix-run/node";

import { getReviewsForUserProfile } from "~/.server/data/reviews";
import { getUserStatistics } from "~/.server/data/user";
import { getRequiredUser } from "~/.server/service/auth";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.userId, "userId is required.");
  const user = await getRequiredUser(request);
  const reviews = await getReviewsForUserProfile(user.id);
  const statistics = await getUserStatistics(user.id);

  return json({ reviews, statistics, user });
};
