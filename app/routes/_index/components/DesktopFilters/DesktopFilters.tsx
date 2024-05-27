import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "@remix-run/react";
import { FormProvider, useForm } from "react-hook-form";
import type { z } from "zod";

import { FormField } from "~/components/molecules/FormField";
import { PAGE_SEARCH_PARAM } from "~/components/molecules/Pagination";
import Select from "~/components/molecules/Select";

import { useFiltersParams } from "../../hooks/useFilters";
import { filtersSchema, ratingFilterOpions } from "../../schema/filters.schema";
import { AuthorFilter } from "../AuthorFilter";
import { CategoryFilter } from "../CategoryFilter";

export const desktopFiltersSchema = filtersSchema.pick({
  author: true,
  category: true,
  rating: true,
});
export type DesktopFiltersSchema = z.infer<typeof desktopFiltersSchema>;

const defaultValues: DesktopFiltersSchema = {
  author: [],
  category: [],
};

const DesktopFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters: filtersParams } = useFiltersParams();
  const form = useForm<DesktopFiltersSchema>({
    defaultValues,
    resolver: zodResolver(desktopFiltersSchema),
    values: {
      author: filtersParams.author,
      category: filtersParams.category,
      rating: filtersParams.rating,
    },
  });

  const authorFilterCallback = (newAuthors: string[]) => {
    const params = new URLSearchParams(searchParams);
    newAuthors.length
      ? params.set("author", newAuthors.join(";"))
      : params.delete("author");
    params.delete(PAGE_SEARCH_PARAM);
    setSearchParams(params);
  };

  const categoryFilterCallback = (newCategories: string[]) => {
    const params = new URLSearchParams(searchParams);
    newCategories.length
      ? params.set("category", newCategories.join(";"))
      : params.delete("category");
    params.delete(PAGE_SEARCH_PARAM);
    setSearchParams(params);
  };

  return (
    <FormProvider {...form}>
      <form className="hidden lg:grid lg:grid-cols-3 lg:gap-4">
        <AuthorFilter
          callback={authorFilterCallback}
          control={form.control}
          variant="inline"
        />

        <CategoryFilter
          callback={categoryFilterCallback}
          control={form.control}
          variant="inline"
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field: { ref, onChange, ...field } }) => (
            <FormField.Item>
              <Select
                onValueChange={(newRating) => {
                  const params = new URLSearchParams(searchParams);
                  params.set("rating", newRating);
                  params.delete(PAGE_SEARCH_PARAM);
                  setSearchParams(params);
                  onChange(newRating);
                }}
                {...field}
              >
                <FormField.Control>
                  <Select.Trigger ref={ref}>
                    <Select.Value placeholder="Rating..." />
                  </Select.Trigger>
                </FormField.Control>
                <Select.Content className="z-50">
                  {ratingFilterOpions.length ? (
                    ratingFilterOpions.map(({ label, value }) => (
                      <Select.Item key={value} value={value}>
                        {label}
                      </Select.Item>
                    ))
                  ) : (
                    <Select.EmptyList />
                  )}
                </Select.Content>
              </Select>
            </FormField.Item>
          )}
        />
      </form>
    </FormProvider>
  );
};

export { DesktopFilters };
