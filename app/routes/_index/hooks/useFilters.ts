import { useSearchParams } from "@remix-run/react";
import { useMemo } from "react";

import { PAGE_SEARCH_PARAM } from "~/components/molecules/Pagination";

import { filtersSchema, type FiltersSchema } from "../schema/filters.schema";

const useFiltersParams = () => {
  const [serachParams, setSearchParams] = useSearchParams();

  const filters = useMemo((): FiltersSchema => {
    const authorParam = serachParams.get("author");
    const author = authorParam?.length ? authorParam.split(";") : [];

    const categoryParam = serachParams.get("category");
    const category = categoryParam?.length ? categoryParam.split(";") : [];

    const rating =
      filtersSchema.shape.rating.safeParse(serachParams.get("rating")).data ??
      undefined;

    const reactions =
      filtersSchema.shape.reactions.safeParse(serachParams.get("reactions"))
        .data ?? undefined;

    return {
      category,
      author,
      rating,
      reactions,
    };
  }, [serachParams]);

  const handleFilterDelete = (filterName: string) => {
    const params = new URLSearchParams(serachParams);
    params.delete(PAGE_SEARCH_PARAM);
    params.delete(filterName);
    setSearchParams(params);
  };

  return {
    filters,
    handleFilterDelete,
  };
};

export { useFiltersParams };
