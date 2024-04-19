import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher } from "@remix-run/react";
import { Filter, Xmark } from "iconoir-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import Button from "~/components/atoms/Button";
import Input from "~/components/atoms/Input";
import Label from "~/components/atoms/Label";
import Dialog from "~/components/molecules/Dialog";
import { FormField } from "~/components/molecules/FormField";
import Select from "~/components/molecules/Select";

import { sortOptions, useSortOptions } from "../../hooks/useSortOptions";

const filtersSchema = z.object({
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  category: z.string().optional(),
  rating: z.string().optional(),
  reactions: z.string().optional(),
  author: z.string().optional(),
});
type FiltersSchema = z.infer<typeof filtersSchema>;

const Navigation = () => {
  const { handleSortOptionChange, sortOption } = useSortOptions();
  const form = useForm<FiltersSchema>({
    defaultValues: {
      author: "",
      category: "",
      createdAt: "",
      rating: "",
      reactions: "",
      updatedAt: "",
    },
    resolver: zodResolver(filtersSchema),
  });
  const fetcher = useFetcher({ key: "filters" });

  useEffect(() => {
    if (!fetcher.data || fetcher.state !== "idle") {
      console.log("running request");
    }
    // Based on data return from fetcher do things.
    console.log("Request resolved and data is available");
  }, [fetcher.data, fetcher.state]);

  return (
    <nav className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-[1fr_auto]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-medium leading-none">Filter by</p>

          <div className="items-start lg:grid lg:grid-cols-[auto,1fr] lg:gap-4">
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
                    <fetcher.Form className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field: { ref, onChange, ...field } }) => (
                          <FormField.Item className="col-span-full">
                            <FormField.Label>Category</FormField.Label>
                            <FormField.Message />
                            <Select onValueChange={onChange} {...field}>
                              <FormField.Control>
                                <Select.Trigger ref={ref}>
                                  <Select.Value placeholder="Category..." />
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
                        control={form.control}
                        name="rating"
                        render={({ field: { ref, onChange, ...field } }) => (
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
                                <Select.EmptyList />
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
                                <Select.EmptyList />
                              </Select.Content>
                            </Select>
                          </FormField.Item>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="author"
                        render={({ field: { ref, onChange, ...field } }) => (
                          <FormField.Item className="col-span-full">
                            <FormField.Label>Author</FormField.Label>
                            <FormField.Message />
                            <Select onValueChange={onChange} {...field}>
                              <FormField.Control>
                                <Select.Trigger ref={ref}>
                                  <Select.Value placeholder="Author..." />
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
                        control={form.control}
                        name="createdAt"
                        render={({ field }) => (
                          <FormField.Item>
                            <FormField.Label>Created at</FormField.Label>
                            <FormField.Message />
                            <FormField.Control>
                              <Input type="date" {...field} />
                            </FormField.Control>
                          </FormField.Item>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="updatedAt"
                        render={({ field }) => (
                          <FormField.Item>
                            <FormField.Label>Updated at</FormField.Label>
                            <FormField.Message />
                            <FormField.Control>
                              <Input type="date" {...field} />
                            </FormField.Control>
                          </FormField.Item>
                        )}
                      />
                    </fetcher.Form>
                  </FormProvider>

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
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog>

            <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4">
              <div className="flex flex-col gap-2">
                <Select>
                  <Select.Trigger className="w-full" id="sortBy">
                    <Select.Value placeholder="Category..." />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.EmptyList />
                  </Select.Content>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Select>
                  <Select.Trigger className="w-full" id="sortBy">
                    <Select.Value placeholder="Rating..." />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.EmptyList />
                  </Select.Content>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Select>
                  <Select.Trigger className="w-full" id="sortBy">
                    <Select.Value placeholder="Reactions..." />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.EmptyList />
                  </Select.Content>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-medium">Active filters</p>
          <ul className="flex flex-wrap gap-2">
            <li className="flex max-h-6 items-center gap-1 rounded border border-neutral-200 bg-white px-2 py-1.5 text-xs leading-none  dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-none">
              Reactions
              <button type="button">
                <Xmark className="h-4 w-4" strokeWidth={2} />
              </button>
            </li>
            <li className="flex max-h-6 items-center gap-1 rounded border border-neutral-200 bg-white px-2 py-1.5 text-xs leading-none  dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-none">
              Rating
              <button type="button">
                <Xmark className="h-4 w-4" strokeWidth={2} />
              </button>
            </li>
            <li className="flex max-h-6 items-center gap-1 rounded border border-neutral-200 bg-white px-2 py-1.5 text-xs leading-none  dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-none">
              Date
              <button type="button">
                <Xmark className="h-4 w-4" strokeWidth={2} />
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-2 lg:min-w-[280px]">
        <Label htmlFor="sort">Sort by</Label>
        <Select
          name="sort"
          onValueChange={handleSortOptionChange}
          value={sortOption}
        >
          <Select.Trigger className="w-full" id="sort">
            <Select.Value placeholder="Sort by..." />
          </Select.Trigger>
          <Select.Content>
            {sortOptions.length ? (
              sortOptions.map(({ name, value }) => (
                <Select.Item key={name} value={value}>
                  {name}
                </Select.Item>
              ))
            ) : (
              <Select.EmptyList />
            )}
          </Select.Content>
        </Select>
      </div>
    </nav>
  );
};

export default Navigation;
