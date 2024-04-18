import { Filter, Xmark } from "iconoir-react";

import Button from "~/components/atoms/Button";
import Select from "~/components/molecules/Select";

import { sortOptions, useSortOptions } from "../../hooks/useSortOptions";

const Navigation = () => {
  const { handleSortOptionChange, sortOption } = useSortOptions();

  return (
    <nav className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-[1fr_auto]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-medium">Filter by</p>

          <div className="items-start lg:grid lg:grid-cols-[auto,1fr] lg:gap-4">
            <Button className="lg:w-max">
              <Filter />
              <span>Filters (3)</span>
            </Button>

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
        <label htmlFor="sort">Sort by</label>
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
