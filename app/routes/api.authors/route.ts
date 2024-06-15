import { json, type LoaderFunctionArgs } from "@vercel/remix";

import { getReviewAuthorFilter } from "~/.server/data/reviews";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { searchParams } = new URL(request.url);
    const authorQuery = searchParams.get("author") ?? undefined;

    const { authors, authorsCount } = await getReviewAuthorFilter(
      authorQuery?.toLocaleLowerCase(),
    );

    return json({
      authors,
      authorsCount,
    });
  } catch (error) {
    console.error(error);

    return json({
      authors: [],
      authorsCount: 0,
    });
  }
};
