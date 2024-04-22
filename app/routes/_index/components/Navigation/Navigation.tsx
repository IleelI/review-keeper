import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher } from "@remix-run/react";
import { Filter, Xmark } from "iconoir-react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import type { ReviewCategory } from "~/.server/data/review";
import type { ReviewAuthor } from "~/.server/data/reviews";
import Button from "~/components/atoms/Button";
import Label from "~/components/atoms/Label";
import Dialog from "~/components/molecules/Dialog";
import { FormField } from "~/components/molecules/FormField";
import Select from "~/components/molecules/Select";

import { sortOptions, useSortOptions } from "../../hooks/useSortOptions";

const filtersSchema = z.object({
  author: z.string().optional(),
  category: z.string().optional(),
  rating: z
    .union([
      z.literal("Any rating"),
      z.literal("Low"),
      z.literal("Medicore"),
      z.literal("High"),
    ])
    .optional(),
  reactions: z
    .union([
      z.literal("Any reaction"),
      z.literal("Popular"),
      z.literal("Known"),
      z.literal("Unknown"),
    ])
    .optional(),
});
type FiltersSchema = z.infer<typeof filtersSchema>;

const ratingFilterOpions: Exclude<FiltersSchema["rating"], undefined>[] = [
  "Any rating",
  "Low",
  "Medicore",
  "High",
];
const reactionsFilterOptions: Exclude<FiltersSchema["reactions"], undefined>[] =
  ["Any reaction", "Popular", "Known", "Unknown"];

interface NavigationProps {
  reviewAuthors: ReviewAuthor[];
  reviewCategories: ReviewCategory[];
}
const Navigation = ({ reviewAuthors, reviewCategories }: NavigationProps) => {
  const { handleSortOptionChange, sortOption } = useSortOptions();
  const form = useForm<FiltersSchema>({
    defaultValues: {
      author: "",
      category: "",
      rating: "Any rating",
      reactions: "Any reaction",
    },
    resolver: zodResolver(filtersSchema),
  });
  const fetcher = useFetcher();

  const onSubmit: SubmitHandler<FiltersSchema> = async (data) => {
    fetcher.submit(data, { method: "POST" });
  };

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
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <div className="grid grid-cols-2 gap-4">
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
                                  {reviewAuthors.map(({ id, username }) => (
                                    <Select.Item key={id} value={id}>
                                      {username}
                                    </Select.Item>
                                  ))}
                                </Select.Content>
                              </Select>
                            </FormField.Item>
                          )}
                        />

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
                                  {reviewCategories.map(({ id, name }) => (
                                    <Select.Item key={id} value={id}>
                                      {name}
                                    </Select.Item>
                                  ))}
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
                                  {ratingFilterOpions.map((name) => (
                                    <Select.Item key={name} value={name}>
                                      {name}
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
                                  {reactionsFilterOptions.map((name) => (
                                    <Select.Item key={name} value={name}>
                                      {name}
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
