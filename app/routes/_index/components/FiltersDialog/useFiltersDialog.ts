import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "@remix-run/react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { PAGE_SEARCH_PARAM } from "~/components/molecules/Pagination";

import { useFiltersParams } from "../../hooks/useFilters";
import { type FiltersSchema, filtersSchema } from "../../schema/filters.schema";

export const defaultValues: FiltersSchema = {
  author: [],
  category: [],
};

const useFiltersDialog = () => {
  const [serachParams, setSearchParams] = useSearchParams();
  const { filters } = useFiltersParams();
  const form = useForm<FiltersSchema>({
    defaultValues: defaultValues,
    resolver: zodResolver(filtersSchema),
    values: filters,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleDialogOpen = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);

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

    params.delete(PAGE_SEARCH_PARAM);

    setSearchParams(params);
    handleDialogClose();
  };

  return {
    form,
    isDialogOpen,
    handleDialogClose,
    handleDialogOpen,
    onSubmit,
    setIsDialogOpen,
  };
};

export { useFiltersDialog };
