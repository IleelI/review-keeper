import Label from "~/components/atoms/Label";
import Select from "~/components/molecules/Select";

import { sortOptions } from "../../hooks/useSortOptions";
import { ActiveFilters } from "../ActiveFilters";
import { DesktopFilters } from "../DesktopFilters";
import { FiltersDialog } from "../FiltersDialog";

import { useNavigation } from "./useNavigation";

const Navigation = () => {
  const {
    activeFiltres,
    handleFilterDelete,
    handleSortOptionChange,
    sortOption,
  } = useNavigation();

  return (
    <nav className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-[1fr_auto]">
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-medium leading-none">Filter by</p>

          <div className="items-start lg:grid lg:grid-cols-[auto,1fr] lg:gap-4">
            <FiltersDialog />
            <DesktopFilters />
          </div>
        </div>

        <ActiveFilters
          activeFilters={activeFiltres}
          handleFilterDelete={handleFilterDelete}
        />
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
