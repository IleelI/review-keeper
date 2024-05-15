import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher, useRouteLoaderData } from "@remix-run/react";
import { Filter } from "iconoir-react";
import { useMemo, useState } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import Button from "~/components/atoms/Button";
import { Combobox } from "~/components/molecules/Combobox";
import Dialog from "~/components/molecules/Dialog";
import { FormField } from "~/components/molecules/FormField";
import Select from "~/components/molecules/Select";

import { loader } from "../../loader";

const filtersSchema = z.object({
  author: z.string().array(),
  category: z.string().array(),
  rating: z
    .union([
      z.literal("any-rating"),
      z.literal("low"),
      z.literal("medicore"),
      z.literal("high"),
    ])
    .optional(),
  reactions: z
    .union([
      z.literal("any-reaction"),
      z.literal("popular"),
      z.literal("known"),
      z.literal("unknown"),
    ])
    .optional(),
});
type FiltersSchema = z.infer<typeof filtersSchema>;

const ratingFilterOpions: {
  label: string;
  value: Exclude<FiltersSchema["rating"], undefined>;
}[] = [
  { label: "Any rating", value: "any-rating" },
  { label: "Low", value: "low" },
  { label: "Medicore", value: "medicore" },
  { label: "High", value: "high" },
];

const reactionsFilterOptions: {
  label: string;
  value: Exclude<FiltersSchema["reactions"], undefined>;
}[] = [
  { label: "Any reaction", value: "any-reaction" },
  { label: "Unknown", value: "unknown" },
  { label: "Known", value: "known" },
  { label: "Popular", value: "popular" },
];

const defaultValues: FiltersSchema = {
  author: [],
  category: [],
};
const FiltersDialog = () => {
  const data = useRouteLoaderData<typeof loader>("routes/_index");
  const { reviewAuthors, reviewCategories } = useMemo(
    () => ({
      reviewAuthors: data?.reviewAuthors ?? [],
      reviewCategories: data?.reviewCategories ?? [],
    }),
    [data?.reviewAuthors, data?.reviewCategories],
  );
  const form = useForm<FiltersSchema>({
    defaultValues: defaultValues,
    resolver: zodResolver(filtersSchema),
  });

  const [authorQuery, setAuthorQuery] = useState("");
  const [isAuthorComboboxOpen, setIsAuthorComboboxOpen] = useState(false);
  const [isCategoryComboboxOpen, setIsCategoryComboboxOpen] = useState(false);
  const [categoryQuery, setCategoryQuery] = useState("");
  const fetcher = useFetcher();

  const filters = form.getValues();

  const { filteredAuthors, selectedAuthors } = useMemo(() => {
    const filteredAuthors = reviewAuthors
      .filter(({ username }) =>
        username.toLowerCase().includes(authorQuery.toLowerCase()),
      )
      .slice(0, 10);

    const selectedAuthors = reviewAuthors
      .filter(({ id }) => filters.author.includes(id))
      .map(({ username }) => username)
      .join(", ");

    return { filteredAuthors, selectedAuthors };
  }, [authorQuery, filters, reviewAuthors]);

  const handleAuthorChange = (authors: string[], authorId: string) =>
    authors.includes(authorId)
      ? authors.filter((id) => id !== authorId)
      : [...authors, authorId];

  const { filteredCategories, selectedCategories } = useMemo(() => {
    const filteredCategories = reviewCategories
      .filter(({ name }) =>
        name.toLowerCase().includes(categoryQuery.toLowerCase()),
      )
      .slice(0, 10);

    const selectedCategories = reviewCategories
      .filter(({ id }) => filters.category.includes(id))
      .map(({ name }) => name)
      .join(", ");

    return { filteredCategories, selectedCategories };
  }, [categoryQuery, filters, reviewCategories]);

  const handleCategoryChange = (categories: string[], categoryId: string) =>
    categories.includes(categoryId)
      ? categories.filter((id) => id !== categoryId)
      : [...categories, categoryId];

  const onSubmit: SubmitHandler<FiltersSchema> = async (data) => {
    fetcher.submit(data, { method: "POST" });
  };

  return (
    <Dialog>
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
                      <FormField.Message />
                      <Combobox
                        open={isAuthorComboboxOpen}
                        onOpenChange={(open) => {
                          setIsAuthorComboboxOpen(open);
                          open && setAuthorQuery("");
                        }}
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
                            onChange={({ target }) =>
                              setAuthorQuery(target.value)
                            }
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
                      <FormField.Message />
                      <Combobox
                        open={isCategoryComboboxOpen}
                        onOpenChange={(open) => {
                          setIsCategoryComboboxOpen(open);
                          open && setCategoryQuery("");
                        }}
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
                            onChange={({ target }) =>
                              setCategoryQuery(target.value)
                            }
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
                      <FormField.Message />
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
                      <FormField.Message />
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
