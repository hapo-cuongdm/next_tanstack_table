import { OnChangeFn, SortingState } from "@tanstack/react-table";
import { useState } from "react";

export const useSortingStateFromUrl = () => {
  const [sortingList, setSortingList] = useState<SortingState>([]);
  const sorting: SortingState = [];

  const onSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    let newSort: SortingState;
    if (typeof updaterOrValue === "function") {
      newSort = updaterOrValue(sorting);
    } else {
      newSort = updaterOrValue;
    }
    setSortingList(newSort);
  };
  return { sortingList, sorting, onSortingChange };
};
