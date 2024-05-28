import { Restart } from "iconoir-react";
import type { Control } from "react-hook-form";

import { Combobox } from "~/components/molecules/Combobox";
import { FormField } from "~/components/molecules/FormField";

import type { FiltersSchema } from "../../schema/filters.schema";
import type { DesktopFiltersSchema } from "../DesktopFilters/DesktopFilters";

import { useCategoryFilter } from "./useCategoryFilter";

interface CategoryFilterProps {
  callback?: (newCategories: string[]) => void;
  control: Control<FiltersSchema | DesktopFiltersSchema>;
  variant?: "dialog" | "inline";
}
export const CategoryFilter = ({
  callback,
  control,
  variant = "dialog",
}: CategoryFilterProps) => {
  const {
    categories,
    categoriesCount,
    categoryQuery,
    handleCategoryChange,
    handleCategoryComboboxOpen,
    handleCategoryComboboxSearch,
    isCategoryComboboxOpen,
    isLoadingCategories,
  } = useCategoryFilter();

  const isDialog = variant === "dialog";

  return (
    <FormField
      control={control}
      name="category"
      render={({ field: { onChange, value, ...field } }) => (
        <FormField.Item className={isDialog ? "col-span-full" : ""}>
          {isDialog ? <FormField.Label>Category</FormField.Label> : null}
          <Combobox
            open={isCategoryComboboxOpen}
            onOpenChange={handleCategoryComboboxOpen}
          >
            <FormField.Control>
              <Combobox.Trigger {...field}>
                <Combobox.Value placeholder="Select categories...">
                  {value.join(", ")}
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
              {isLoadingCategories ? (
                <div className="grid place-content-center p-12">
                  <Restart className="animate-spin" />
                </div>
              ) : categories.length ? (
                <>
                  {categories.map(({ id, name }) => (
                    <Combobox.Item
                      key={id}
                      onClick={() => {
                        const newCategories = handleCategoryChange(value, name);
                        onChange(newCategories);
                        callback?.(newCategories);
                      }}
                    >
                      {name}
                      <Combobox.ItemIndicator
                        isSelected={value.includes(name)}
                      />
                    </Combobox.Item>
                  ))}
                  <p className="sticky bottom-0 z-10 border-t border-neutral-200 bg-white px-1.5 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 ">
                    Showing {categories.length} results out of {categoriesCount}
                    . Type to filter.
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
  );
};
