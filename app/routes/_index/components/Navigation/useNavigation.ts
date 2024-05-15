import { useMemo } from "react";

import { useFiltersParams } from "../../hooks/useFilters";
import { useSortOptions } from "../../hooks/useSortOptions";

const useNavigation = () => {
  const { filters, handleFilterDelete } = useFiltersParams();
  const { handleSortOptionChange, sortOption } = useSortOptions();

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
  return {
    activeFiltres,
    handleFilterDelete,
    handleSortOptionChange,
    sortOption,
  };
};

export { useNavigation };
