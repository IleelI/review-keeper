import { Restart } from "iconoir-react";
import type { Control } from "react-hook-form";

import { Combobox } from "~/components/molecules/Combobox";
import { FormField } from "~/components/molecules/FormField";

import type { FiltersSchema } from "../../schema/filters.schema";
import type { DesktopFiltersSchema } from "../DesktopFilters/DesktopFilters";

import { useAuthorFilter } from "./useAuthorFilter";

interface AuthorFilterProps {
  callback?: (newAuthors: string[]) => void;
  control: Control<FiltersSchema | DesktopFiltersSchema>;
  variant?: "dialog" | "inline";
}
export const AuthorFilter = ({
  callback,
  control,
  variant = "dialog",
}: AuthorFilterProps) => {
  const {
    authors,
    authorsCount,
    authorQuery,
    handleAuthorChange,
    handleAuthorComboboxOpen,
    handleAuthorComboboxSearch,
    isAuthorComboboxOpen,
    isLoadingAuthors,
  } = useAuthorFilter();

  const isDialog = variant === "dialog";

  return (
    <FormField
      control={control}
      name="author"
      render={({ field: { onChange, value, ...field } }) => (
        <FormField.Item className={isDialog ? "col-span-full" : ""}>
          {isDialog ? <FormField.Label>Author</FormField.Label> : null}
          <Combobox
            open={isAuthorComboboxOpen}
            onOpenChange={handleAuthorComboboxOpen}
          >
            <FormField.Control>
              <Combobox.Trigger {...field}>
                <Combobox.Value placeholder="Select authors...">
                  {value.join(", ")}
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
              {isLoadingAuthors ? (
                <div className="grid place-content-center p-12">
                  <Restart className="animate-spin" />
                </div>
              ) : authors.length ? (
                <>
                  {authors.map(({ id, username }) => (
                    <Combobox.Item
                      key={id}
                      onClick={() => {
                        const newAuthors = handleAuthorChange(value, username);
                        onChange(newAuthors);
                        callback?.(newAuthors);
                      }}
                    >
                      {username}
                      <Combobox.ItemIndicator
                        isSelected={value.includes(username)}
                      />
                    </Combobox.Item>
                  ))}
                  <p className="sticky bottom-0 z-10 border-t border-neutral-200 bg-white px-1.5 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 ">
                    Showing {authors.length} results out of {authorsCount}. Type
                    to filter.
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
