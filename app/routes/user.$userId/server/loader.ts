import { invariant } from "@epic-web/invariant";
import { type LoaderFunctionArgs, json } from "@remix-run/node";

import { getReviewsForUserProfile } from "~/.server/data/reviews";
import { getUserById, getUserStatistics } from "~/.server/data/user";
import { getUser } from "~/.server/service/auth";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.userId, "userId is required.");
  const user = await getUserById(params.userId);
  if (user === null) {
    throw new Response("User doesn't exist.", {
      status: 404,
      statusText: "User doesn't exist.",
    });
  }
  const reviews = await getReviewsForUserProfile(user.id);
  const statistics = await getUserStatistics(user.id);

  const loggedUser = await getUser(request);
  const isLoggedUserAccountOwner = loggedUser?.id === user.id;

  return json({ isLoggedUserAccountOwner, reviews, statistics, user });
};
