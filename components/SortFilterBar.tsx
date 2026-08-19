"use client";

import { useRef, useState } from "react";
import type { FilterGroup, SortFilterState, SortOption } from "@/lib/useSortFilter";
import { useOutsideClose } from "@/lib/useOutsideClose";
import Checkbox from "@/components/ui/Checkbox";
import Radio from "@/components/ui/Radio";
import { CloseIcon, FilterIcon, SearchIcon, SortIcon } from "@/components/icons";

interface SortFilterBarProps<T> {
  state: SortFilterState<T>;
  filterGroups?: FilterGroup<T>[];
  sortOptions?: SortOption<T>[];
  searchPlaceholder?: string;
}

function cloneFilters(filters: Record<string, Set<string>>): Record<string, Set<string>> {
  const next: Record<string, Set<string>> = {};
  for (const [key, set] of Object.entries(filters)) next[key] = new Set(set);
  return next;
}

export default function SortFilterBar<T>({
  state,
  filterGroups = [],
  sortOptions = [],
  searchPlaceholder = "Search...",
}: SortFilterBarProps<T>) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  // Checkbox edits are staged here and only committed to `state.filters`
  // (which drives the live-filtered list) when "Apply" is clicked — so
  // ticking a box previews nothing until you actually apply it.
  const [pendingFilters, setPendingFilters] = useState<Record<string, Set<string>>>({});
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  function openFilterPanel() {
    setPendingFilters(cloneFilters(state.filters));
    setSortOpen(false);
    setFilterOpen(true);
  }

  function closeFilterPanelWithoutApplying() {
    setFilterOpen(false);
  }

  function togglePending(key: string, value: string) {
    setPendingFilters((prev) => {
      const next = cloneFilters(prev);
      const set = new Set(next[key] ?? []);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      next[key] = set;
      return next;
    });
  }

  function applyPending() {
    state.replaceFilters(pendingFilters);
    setFilterOpen(false);
  }

  function clearPending() {
    setPendingFilters({});
    state.clearFilters();
  }

  // Each panel closes independently when a click lands outside its own
  // container; Escape closes whichever panel(s) are currently open.
  // Closing this way discards any unapplied checkbox edits.
  useOutsideClose([filterRef], closeFilterPanelWithoutApplying);
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
                if (filterOpen) closeFilterPanelWithoutApplying();
                else openFilterPanel();
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
            <div className={`sf-backdrop${filterOpen ? " open" : ""}`} onClick={closeFilterPanelWithoutApplying} />
            <div className={`sf-panel sf-panel-filter${filterOpen ? " open" : ""}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Filter">
              <div className="sf-panel-handle" />
              <div className="sf-panel-head">
                <span>Filter</span>
                <button type="button" className="sf-panel-close" onClick={closeFilterPanelWithoutApplying}>
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
                        checked={pendingFilters[group.key]?.has(opt.value) ?? false}
                        onChange={() => togglePending(group.key, opt.value)}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="sf-panel-foot">
                <button type="button" className="btn ghost" onClick={clearPending}>
                  Clear
                </button>
                <button type="button" className="btn" onClick={applyPending}>
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
                  <Radio
                    key={opt.value}
                    className="sf-option"
                    name="sf-sort"
                    label={opt.label}
                    checked={state.sort === opt.value}
                    onChange={() => {
                      state.setSort(opt.value);
                      setSortOpen(false);
                    }}
                  />
                ))}
              </div>
            </div>
          </span>
        )}
        <button
          type="button"
          className="sfbar-clear"
          hidden={!hasActive}
          onClick={() => {
            setPendingFilters({});
            state.clearAll();
          }}
        >
          <CloseIcon />
          <span>Clear Filters</span>
        </button>
      </div>
    </div>
  );
}
