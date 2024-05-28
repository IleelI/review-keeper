import { faker } from "@faker-js/faker";
import { json, type LoaderFunctionArgs } from "@remix-run/node";

import { getReviewCategoriesFilter } from "~/.server/data/reviews";
import { env } from "~/.server/utils/env";

const isDevMode = env().NODE_ENV === "development";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { searchParams } = new URL(request.url);
    const categoryQuery = searchParams.get("category") ?? undefined;

    const { categories, categoriesCount } =
      await getReviewCategoriesFilter(categoryQuery);

    isDevMode &&
      (await new Promise((resolve) => {
        setTimeout(
          () => resolve({}),
          faker.number.int({ min: 250, max: 2000 }),
        );
      }));

    return json({
      categories,
      categoriesCount,
    });
  } catch (error) {
    console.error(error);

    return json({
      categories: [],
      categoriesCount: 0,
    });
  }
};
