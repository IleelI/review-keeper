import { zodResolver } from "@hookform/resolvers/zod";
import { useRouteLoaderData, useSearchParams } from "@remix-run/react";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { z } from "zod";

import { Combobox } from "~/components/molecules/Combobox";
import { FormField } from "~/components/molecules/FormField";
import Select from "~/components/molecules/Select";

import { useAuthorFilter } from "../../hooks/useAuthorFilter";
import { useCategoryFilter } from "../../hooks/useCategoryFilter";
import { useFiltersParams } from "../../hooks/useFilters";
import type { loader } from "../../loader";
import { filtersSchema, ratingFilterOpions } from "../../schema/filters.schema";

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
  const data = useRouteLoaderData<typeof loader>("routes/_index");
  const [searchParams, setSearchParams] = useSearchParams();
  const { reviewAuthors, reviewCategories } = useMemo(
    () => ({
      reviewAuthors: data?.reviewAuthors ?? [],
      reviewCategories: data?.reviewCategories ?? [],
    }),
    [data?.reviewAuthors, data?.reviewCategories],
  );
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
  const filters = form.watch();

  const {
    authorQuery,
    filteredAuthors,
    handleAuthorChange,
    handleAuthorComboboxOpen,
    handleAuthorComboboxSearch,
    isAuthorComboboxOpen,
    selectedAuthors,
  } = useAuthorFilter(filters.author, reviewAuthors);

  const {
    categoryQuery,
    filteredCategories,
    handleCategoryChange,
    handleCategoryComboboxOpen,
    handleCategoryComboboxSearch,
    isCategoryComboboxOpen,
    selectedCategories,
  } = useCategoryFilter(filters.category, reviewCategories);

  return (
    <FormProvider {...form}>
      <form className="hidden lg:grid lg:grid-cols-3 lg:gap-4">
        <FormField
          control={form.control}
          name="author"
          render={({ field: { onChange, value, ...field } }) => (
            <FormField.Item>
              <Combobox
                open={isAuthorComboboxOpen}
                onOpenChange={handleAuthorComboboxOpen}
              >
                <FormField.Control>
                  <Combobox.Trigger {...field}>
                    <Combobox.Value placeholder="Select authors...">
                      {selectedAuthors}
                    </Combobox.Value>
                    <Combobox.TriggerIcon />
                  </Combobox.Trigger>
                </FormField.Control>

                <Combobox.Content className="z-50">
                  <Combobox.Search
                    className="sticky top-0 z-10"
                    onChange={handleAuthorComboboxSearch}
                    value={authorQuery}
                  />
                  {filteredAuthors.length ? (
                    <>
                      {filteredAuthors.map(({ id, username }) => (
                        <Combobox.Item
                          key={id}
                          onClick={() => {
                            const newAuthors = handleAuthorChange(value, id);
                            const params = new URLSearchParams(searchParams);
                            params.set("author", newAuthors.join(";"));
                            setSearchParams(params);
                            onChange(newAuthors);
                          }}
                        >
                          {username}
                          <Combobox.ItemIndicator
                            isSelected={value.includes(id)}
                          />
                        </Combobox.Item>
                      ))}
                      <p className="sticky bottom-0 z-10 border-t border-neutral-200 bg-white px-1.5 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 ">
                        Showing {filteredAuthors.length} results out of{" "}
                        {reviewAuthors.length}. Type to filter.
                      </p>
                    </>
                  ) : (
                    <Combobox.EmptyContent />
                  )}
                </Combobox.Content>
              </Combobox>
            </FormField.Item>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field: { onChange, value, ...field } }) => (
            <FormField.Item>
              <Combobox
                open={isCategoryComboboxOpen}
                onOpenChange={handleCategoryComboboxOpen}
              >
                <FormField.Control>
                  <Combobox.Trigger {...field}>
                    <Combobox.Value placeholder="Select categories...">
                      {selectedCategories}
                    </Combobox.Value>
                    <Combobox.TriggerIcon />
                  </Combobox.Trigger>
                </FormField.Control>

                <Combobox.Content className="z-50">
                  <Combobox.Search
                    className="sticky top-0 z-10"
                    onChange={handleCategoryComboboxSearch}
                    value={categoryQuery}
                  />
                  {filteredCategories.length ? (
                    <>
                      {filteredCategories.map(({ id, name }) => (
                        <Combobox.Item
                          key={id}
                          onClick={() => {
                            const newCategories = handleCategoryChange(
                              value,
                              id,
                            );
                            const params = new URLSearchParams(searchParams);
                            params.set("category", newCategories.join(";"));
                            setSearchParams(params);
                            onChange(newCategories);
                          }}
                        >
                          {name}
                          <Combobox.ItemIndicator
                            isSelected={value.includes(id)}
                          />
                        </Combobox.Item>
                      ))}
                      <p className="sticky bottom-0 z-10 border-t border-neutral-200 bg-white px-1.5 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 ">
                        Showing {filteredCategories.length} results out of{" "}
                        {reviewCategories.length}. Type to filter.
                      </p>
                    </>
                  ) : (
                    <Combobox.EmptyContent />
                  )}
                </Combobox.Content>
              </Combobox>
            </FormField.Item>
          )}
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
