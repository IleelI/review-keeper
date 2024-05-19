import { Filter } from "iconoir-react";
import { FormProvider } from "react-hook-form";

import Button from "~/components/atoms/Button";
import { Combobox } from "~/components/molecules/Combobox";
import Dialog from "~/components/molecules/Dialog";
import { FormField } from "~/components/molecules/FormField";
import Select from "~/components/molecules/Select";

import { useAuthorFilter } from "../../hooks/useAuthorFilter";
import { useCategoryFilter } from "../../hooks/useCategoryFilter";
import {
  ratingFilterOpions,
  reactionsFilterOptions,
} from "../../schema/filters.schema";

import { useFiltersDialog } from "./useFiltersDialog";

const FiltersDialog = () => {
  const {
    filters,
    form,
    isDialogOpen,
    onSubmit,
    reviewAuthors,
    reviewCategories,
    setIsDialogOpen,
  } = useFiltersDialog();

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
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Dialog.Trigger asChild>
        <Button className="lg:w-max">
          <Filter />
          <span>Filters</span>
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="md:max-w-screen-sm">
          <Dialog.Header>
            <Dialog.Title>Filters</Dialog.Title>
            <Dialog.Description>
              Filter results based on your preferences.
            </Dialog.Description>
          </Dialog.Header>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormField.Item className="col-span-full">
                      <FormField.Label>Author</FormField.Label>
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
                                  onClick={() =>
                                    onChange(handleAuthorChange(value, id))
                                  }
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
                    <FormField.Item className="col-span-full">
                      <FormField.Label>Category</FormField.Label>
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
                                  onClick={() =>
                                    onChange(handleCategoryChange(value, id))
                                  }
                                >
                                  {name}
                                  <Combobox.ItemIndicator
                                    isSelected={value.includes(id)}
                                  />
                                </Combobox.Item>
                              ))}
                              <p className="sticky bottom-0 z-10 border-t border-neutral-200 bg-white px-1.5 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 ">
                                Showing {filteredCategories.length} results out
                                of {reviewCategories.length}. Type to filter.
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
                  render={({ field: { onChange, ref, ...field } }) => (
                    <FormField.Item className="col-span-full">
                      <FormField.Label>Rating</FormField.Label>
                      <Select onValueChange={onChange} {...field}>
                        <FormField.Control>
                          <Select.Trigger ref={ref}>
                            <Select.Value placeholder="Rating..." />
                          </Select.Trigger>
                        </FormField.Control>

                        <Select.Content className="z-50">
                          {ratingFilterOpions.map(({ label, value }) => (
                            <Select.Item key={value} value={value}>
                              {label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    </FormField.Item>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reactions"
                  render={({ field: { ref, onChange, ...field } }) => (
                    <FormField.Item className="col-span-full">
                      <FormField.Label>Reactions</FormField.Label>
                      <Select onValueChange={onChange} {...field}>
                        <FormField.Control>
                          <Select.Trigger ref={ref}>
                            <Select.Value placeholder="Reactions..." />
                          </Select.Trigger>
                        </FormField.Control>

                        <Select.Content className="z-50">
                          {reactionsFilterOptions.map(({ label, value }) => (
                            <Select.Item key={value} value={value}>
                              {label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    </FormField.Item>
                  )}
                />
              </div>

              <Dialog.Footer className="mt-6">
                <Dialog.Close asChild>
                  <Button className="md:w-max" intent="secondary">
                    Close
                  </Button>
                </Dialog.Close>
                <Button className="md:w-max" type="submit">
                  Apply filters
                </Button>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export { FiltersDialog };
