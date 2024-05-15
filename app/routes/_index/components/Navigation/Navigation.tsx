import { Xmark } from "iconoir-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import Label from "~/components/atoms/Label";
import Select from "~/components/molecules/Select";

import { sortOptions, useSortOptions } from "../../hooks/useSortOptions";
import { DesktopFilters } from "../DesktopFilters/DesktopFilters";
import { FiltersDialog } from "../FiltersDialog/FiltersDialog";

const Navigation = () => {
  const { handleSortOptionChange, sortOption } = useSortOptions();
  const form = useForm();
  const filters = form.watch();

  const activeFiltres = useMemo(
    () =>
      Object.entries(filters)
        .map(([key, value]) => {
          if (typeof value === "object") {
            return value.length ? key : null;
          } else {
            return value ? key : null;
          }
        })
        .filter((value): value is keyof typeof filters => value !== null),
    [filters],
  );

  return (
    <nav className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-[1fr_auto]">
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-medium leading-none">Filter by</p>
          <div className="items-start lg:grid lg:grid-cols-[auto,1fr] lg:gap-4">
            <FiltersDialog />
            <DesktopFilters form={form} />
          </div>
        </div>
        {activeFiltres.length ? (
          <div className="flex flex-col gap-2">
            <p className="font-medium">Active filters</p>
            <ul className="flex flex-wrap gap-2">
              {activeFiltres.map((filter) => (
                <li
                  className="flex max-h-6 items-center gap-1 rounded border border-neutral-200 bg-white px-2 py-1.5 text-xs capitalize  leading-none dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-none"
                  key={filter}
                >
                  {filter}
                  <button type="button">
                    <Xmark className="h-4 w-4" strokeWidth={2} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="flex flex-col gap-2 lg:min-w-[280px]">
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
      </section>
    </nav>
  );
};

export default Navigation;
