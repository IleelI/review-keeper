import { zodResolver } from "@hookform/resolvers/zod";
import {
  useRouteLoaderData,
  useSearchParams,
  useFetcher,
} from "@remix-run/react";
import { useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { useFiltersParams } from "../../hooks/useFilters";
import type { loader } from "../../loader";
import { type FiltersSchema, filtersSchema } from "../../schema/filters.schema";

export const defaultValues: FiltersSchema = {
  author: [],
  category: [],
};

const useFiltersDialog = () => {
  const data = useRouteLoaderData<typeof loader>("routes/_index");
  const { reviewAuthors, reviewCategories } = useMemo(
    () => ({
      reviewAuthors: data?.reviewAuthors ?? [],
      reviewCategories: data?.reviewCategories ?? [],
    }),
    [data?.reviewAuthors, data?.reviewCategories],
  );

  const { filters: filtersParams } = useFiltersParams();
  const [serachParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher();
  const form = useForm<FiltersSchema>({
    defaultValues: defaultValues,
    resolver: zodResolver(filtersSchema),
    values: filtersParams,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleDialogOpen = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);

  const filters = form.watch();

  const onSubmit: SubmitHandler<FiltersSchema> = async (data) => {
    const params = new URLSearchParams(serachParams);

    data.author.length
      ? params.set("author", data.author.join(";"))
      : params.delete("author");

    data.category.length
      ? params.set("category", data.category.join(";"))
      : params.delete("category");

    data.rating && data.rating !== "any-rating"
      ? params.set("rating", data.rating)
      : params.delete("rating");

    data.reactions && data.reactions !== "any-reaction"
      ? params.set("reactions", data.reactions)
      : params.delete("reactions");

    setSearchParams(params);
    handleDialogClose();

    fetcher.submit(data, { method: "POST" });
  };

  return {
    fetcher,
    filters,
    form,
    isDialogOpen,
    handleDialogClose,
    handleDialogOpen,
    onSubmit,
    reviewAuthors,
    reviewCategories,
    setIsDialogOpen,
  };
};

export { useFiltersDialog };
