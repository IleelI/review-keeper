import { FormProvider, type UseFormReturn } from "react-hook-form";

import { Combobox } from "~/components/molecules/Combobox";
import { FormField } from "~/components/molecules/FormField";
import Select from "~/components/molecules/Select";

interface DesktopFiltersProps {
  form: UseFormReturn;
}
const DesktopFilters = ({ form }: DesktopFiltersProps) => {
  return (
    <FormProvider {...form}>
      <form className="hidden lg:grid lg:grid-cols-3 lg:gap-4">
        <FormField
          name="author"
          render={({ field: { ...field } }) => (
            <FormField.Item>
              <Combobox>
                <FormField.Control>
                  <Combobox.Trigger {...field}>
                    <Combobox.Value placeholder="Authors..."></Combobox.Value>
                    <Combobox.TriggerIcon />
                  </Combobox.Trigger>
                </FormField.Control>

                <Combobox.Content className="z-50">
                  <Combobox.Search className="sticky top-0 z-10" />

                  <Combobox.EmptyContent />
                </Combobox.Content>
              </Combobox>
            </FormField.Item>
          )}
        />

        <FormField
          name="rating"
          render={({ field: { onChange, ref, ...field } }) => (
            <FormField.Item>
              <Select onValueChange={onChange} {...field}>
                <FormField.Control>
                  <Select.Trigger ref={ref}>
                    <Select.Value placeholder="Rating..." />
                  </Select.Trigger>
                </FormField.Control>

                <Select.Content className="z-50">
                  <Select.EmptyList />
                </Select.Content>
              </Select>
            </FormField.Item>
          )}
        />
        <FormField
          name="reactions"
          render={({ field: { ref, onChange, ...field } }) => (
            <FormField.Item>
              <Select onValueChange={onChange} {...field}>
                <FormField.Control>
                  <Select.Trigger ref={ref}>
                    <Select.Value placeholder="Reactions..." />
                  </Select.Trigger>
                </FormField.Control>
                <Select.Content className="z-50">
                  <Select.EmptyList />
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
