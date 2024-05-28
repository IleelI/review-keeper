import { Filter } from "iconoir-react";
import { FormProvider } from "react-hook-form";

import Button from "~/components/atoms/Button";
import Dialog from "~/components/molecules/Dialog";
import { FormField } from "~/components/molecules/FormField";
import Select from "~/components/molecules/Select";

import {
  ratingFilterOpions,
  reactionsFilterOptions,
} from "../../schema/filters.schema";
import { AuthorFilter } from "../AuthorFilter";
import { CategoryFilter } from "../CategoryFilter";

import { useFiltersDialog } from "./useFiltersDialog";

const FiltersDialog = () => {
  const { form, isDialogOpen, onSubmit, setIsDialogOpen } = useFiltersDialog();

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
                <AuthorFilter control={form.control} />

                <CategoryFilter control={form.control} />

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
