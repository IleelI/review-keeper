import { json, type LoaderFunctionArgs } from "@remix-run/node";

import { getReviewCategoriesFilter } from "~/.server/data/reviews";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { searchParams } = new URL(request.url);
    const categoryQuery = searchParams.get("category") ?? undefined;

    const { categories, categoriesCount } =
      await getReviewCategoriesFilter(categoryQuery);

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
