import { XMarkIcon } from "~/assets/icons/X Mark.icon";

interface ActiveFiltersProps {
  activeFilters: string[];
  handleFilterDelete: (filterName: string) => void;
}
const ActiveFilters = ({
  activeFilters,
  handleFilterDelete,
}: ActiveFiltersProps) => {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-medium">Active filters</h2>
      {activeFilters.length ? (
        <ul className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <li
              className="flex max-h-6 items-center gap-1 rounded border border-neutral-200 bg-white px-2 py-1.5 text-xs capitalize  leading-none dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-none"
              key={filter}
            >
              {filter}
              <button type="button" onClick={() => handleFilterDelete(filter)}>
                <XMarkIcon className="h-4 w-4" strokeWidth={2} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="h-6 text-sm font-medium text-neutral-500 dark:text-neutral-500">
          No filters applied.
        </p>
      )}
    </section>
  );
};

export { ActiveFilters };
