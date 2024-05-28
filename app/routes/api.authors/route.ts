import { faker } from "@faker-js/faker";
import { json, type LoaderFunctionArgs } from "@remix-run/node";

import { getReviewAuthorFilter } from "~/.server/data/reviews";
import { env } from "~/.server/utils/env";

const isDevMode = env().NODE_ENV === "development";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { searchParams } = new URL(request.url);
    const authorQuery = searchParams.get("author") ?? undefined;

    const { authors, authorsCount } = await getReviewAuthorFilter(
      authorQuery?.toLocaleLowerCase(),
    );

    isDevMode &&
      (await new Promise((resolve) => {
        setTimeout(
          () => resolve({}),
          faker.number.int({ min: 250, max: 2000 }),
        );
      }));

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
