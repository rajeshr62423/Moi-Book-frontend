"use client";

import { useRef, useState } from "react";
import type { FilterGroup, SortFilterState, SortOption } from "@/lib/useSortFilter";
import { useOutsideClose } from "@/lib/useOutsideClose";
import Checkbox from "@/components/ui/Checkbox";
import { CloseIcon, FilterIcon, SearchIcon, SortIcon } from "@/components/icons";

interface SortFilterBarProps<T> {
  state: SortFilterState<T>;
  filterGroups?: FilterGroup<T>[];
  sortOptions?: SortOption<T>[];
  searchPlaceholder?: string;
}

export default function SortFilterBar<T>({
  state,
  filterGroups = [],
  sortOptions = [],
  searchPlaceholder = "Search...",
}: SortFilterBarProps<T>) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Each panel closes independently when a click lands outside its own
  // container; Escape closes whichever panel(s) are currently open.
  useOutsideClose([filterRef], () => setFilterOpen(false));
  useOutsideClose([sortRef], () => setSortOpen(false));

  const hasActive = state.activeFilterCount > 0 || state.search.trim().length > 0;

  return (
    <div className="sfbar">
      <div className="sfbar-search">
        <SearchIcon />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={state.search}
          onChange={(e) => state.setSearch(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div className="sfbar-actions">
        {filterGroups.length > 0 && (
          <span className="sfbar-group" ref={filterRef}>
            <button
              type="button"
              className={`sfbar-btn${state.activeFilterCount > 0 ? " active" : ""}`}
              aria-expanded={filterOpen}
              aria-haspopup="true"
              onClick={(e) => {
                e.stopPropagation();
                setSortOpen(false);
                setFilterOpen((v) => !v);
              }}
            >
              <FilterIcon />
              <span>Filter</span>
              <span className="sfbar-badge" hidden={state.activeFilterCount === 0}>
                {state.activeFilterCount}
              </span>
              <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className={`sf-backdrop${filterOpen ? " open" : ""}`} onClick={() => setFilterOpen(false)} />
            <div className={`sf-panel sf-panel-filter${filterOpen ? " open" : ""}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Filter">
              <div className="sf-panel-handle" />
              <div className="sf-panel-head">
                <span>Filter</span>
                <button type="button" className="sf-panel-close" onClick={() => setFilterOpen(false)}>
                  <CloseIcon />
                </button>
              </div>
              <div className="sf-panel-body">
                {filterGroups.map((group) => (
                  <div className="sf-group" key={group.key}>
                    <div className="sf-group-label">{group.label}</div>
                    {group.options.map((opt) => (
                      <Checkbox
                        key={opt.value}
                        className="sf-option"
                        label={opt.label}
                        checked={state.filters[group.key]?.has(opt.value) ?? false}
                        onChange={() => state.toggleFilter(group.key, opt.value)}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="sf-panel-foot">
                <button type="button" className="btn ghost" onClick={() => state.clearFilters()}>
                  Clear
                </button>
                <button type="button" className="btn" onClick={() => setFilterOpen(false)}>
                  Apply
                </button>
              </div>
            </div>
          </span>
        )}
        {sortOptions.length > 0 && (
          <span className="sfbar-group" ref={sortRef}>
            <button
              type="button"
              className="sfbar-btn"
              aria-expanded={sortOpen}
              aria-haspopup="true"
              onClick={(e) => {
                e.stopPropagation();
                setFilterOpen(false);
                setSortOpen((v) => !v);
              }}
            >
              <SortIcon />
              <span>Sort</span>
              <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className={`sf-backdrop${sortOpen ? " open" : ""}`} onClick={() => setSortOpen(false)} />
            <div className={`sf-panel sf-panel-sort${sortOpen ? " open" : ""}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Sort">
              <div className="sf-panel-handle" />
              <div className="sf-panel-head">
                <span>Sort By</span>
                <button type="button" className="sf-panel-close" onClick={() => setSortOpen(false)}>
                  <CloseIcon />
                </button>
              </div>
              <div className="sf-panel-body">
                {sortOptions.map((opt) => (
                  <label className="sf-option" key={opt.value}>
                    <input
                      type="radio"
                      name="sf-sort"
                      checked={state.sort === opt.value}
                      onChange={() => {
                        state.setSort(opt.value);
                        setSortOpen(false);
                      }}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </span>
        )}
        <button type="button" className="sfbar-clear" hidden={!hasActive} onClick={() => state.clearAll()}>
          <CloseIcon />
          <span>Clear Filters</span>
        </button>
      </div>
    </div>
  );
}
