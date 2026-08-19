"use client";

import { useCallback, useMemo, useState } from "react";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterGroup<T> {
  key: string;
  label: string;
  options: FilterOption[];
  getValue: (item: T) => string;
}

export interface SortOption<T> {
  value: string;
  label: string;
  compare: (a: T, b: T) => number;
}

export interface SortFilterConfig<T> {
  searchFields: (item: T) => string;
  filterGroups?: FilterGroup<T>[];
  sortOptions?: SortOption<T>[];
}

export function useSortFilter<T>(items: T[], config: SortFilterConfig<T>) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, Set<string>>>({});
  const [sort, setSort] = useState<string>(config.sortOptions?.[0]?.value ?? "");

  const toggleFilter = useCallback((key: string, value: string) => {
    setFilters((prev) => {
      const next = { ...prev };
      const set = new Set(next[key] ?? []);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      next[key] = set;
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => setFilters({}), []);
  const replaceFilters = useCallback((next: Record<string, Set<string>>) => setFilters(next), []);
  const clearAll = useCallback(() => {
    setSearch("");
    setFilters({});
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = items.filter((item) => {
      const matchesSearch = !q || config.searchFields(item).toLowerCase().includes(q);
      if (!matchesSearch) return false;
      for (const group of config.filterGroups ?? []) {
        const set = filters[group.key];
        if (set && set.size > 0 && !set.has(group.getValue(item))) return false;
      }
      return true;
    });
    const sortDef = config.sortOptions?.find((s) => s.value === sort);
    if (sortDef) list = [...list].sort(sortDef.compare);
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, search, filters, sort]);

  const activeFilterCount = useMemo(
    () => Object.values(filters).reduce((n, s) => n + (s ? s.size : 0), 0),
    [filters]
  );

  return {
    search,
    setSearch,
    filters,
    toggleFilter,
    clearFilters,
    replaceFilters,
    clearAll,
    sort,
    setSort,
    filtered,
    activeFilterCount,
  };
}

export type SortFilterState<T> = ReturnType<typeof useSortFilter<T>>;
