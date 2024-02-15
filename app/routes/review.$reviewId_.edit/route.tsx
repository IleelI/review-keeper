import { invariant } from "@epic-web/invariant";
import { LoaderFunctionArgs } from "@remix-run/node";

import { getRequiredUser } from "~/server/auth.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.reviewId, "reviewId is required.");
  const { reviewId } = params;
  const { id: userId } = await getRequiredUser(request);

  console.log({ reviewId, userId });
  return null;
};

const ReviewEditPage = () => {
  return <div>Review edit page</div>;
};

export default ReviewEditPage;
