"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import { useOutsideClose } from "@/lib/useOutsideClose";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "@/components/icons";

// useLayoutEffect warns during SSR ("does nothing on the server"); this
// component only ever measures DOM after mount, so fall back to a no-op
// effect there instead of suppressing the warning globally.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

function optionText(opt: SelectOption): string {
  return typeof opt.label === "string" ? opt.label : String(opt.value);
}

export interface SelectOption {
  value: string;
  label: ReactNode;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
  className?: string;
  "aria-label"?: string;
  /** Shows a search input at the top of the panel that filters options by label. */
  searchable?: boolean;
  searchPlaceholder?: string;
}

interface PanelRect {
  top: number;
  left: number;
  width: number;
  openUp: boolean;
}

/**
 * Themed replacement for the browser's native <select>, matching the I Moi
 * Book input styling (cream field, gold accent) across every accent theme
 * and light/dark mode. The option panel renders through a portal to
 * document.body with position:fixed so it can float above modal footers
 * and never gets clipped by a scrollable ancestor (e.g. .modal-body).
 *
 * A visually-hidden native <select> mirrors the value when `required`/`name`
 * is set, so existing HTML5 required-validation and plain <form> submission
 * keep working without wiring up a separate validation path. The trigger
 * also accepts a forwarded ref (a focusable element), so it can be dropped
 * into React Hook Form's <Controller render={({ field }) => ... } /> as-is.
 */
const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    value,
    onChange,
    options,
    placeholder = "Select…",
    name,
    id,
    required,
    disabled,
    onBlur,
    className,
    "aria-label": ariaLabel,
    searchable = false,
    searchPlaceholder = "Search…",
  },
  forwardedRef
) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [rect, setRect] = useState<PanelRect | null>(null);
  const [mounted, setMounted] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const reactId = useId();
  const listboxId = id ? `${id}-listbox` : `tsel-${reactId}`;

  const filteredOptions =
    searchable && query.trim()
      ? options.filter((o) => optionText(o).toLowerCase().includes(query.trim().toLowerCase()))
      : options;

  useEffect(() => setMounted(true), []);

  useOutsideClose([triggerRef, panelRef], () => setOpen(false), { active: open });

  useEffect(() => {
    if (open) {
      setQuery("");
      const idx = options.findIndex((o) => o.value === value);
      setActiveIndex(idx >= 0 ? idx : 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open || !searchable) return;
    const t = setTimeout(() => searchRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open, searchable]);

  useIsomorphicLayoutEffect(() => {
    if (!open) return;

    function reposition() {
      const el = triggerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const searchBarHeight = searchable ? 48 : 0;
      const estimatedPanelHeight = Math.min(320, options.length * 40 + 14 + searchBarHeight);
      const spaceBelow = window.innerHeight - r.bottom;
      const openUp = spaceBelow < estimatedPanelHeight + 12 && r.top > estimatedPanelHeight;
      setRect({ top: openUp ? r.top : r.bottom, left: r.left, width: r.width, openUp });
    }

    reposition();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open, options.length, searchable]);

  useEffect(() => {
    if (!open) return;
    document.getElementById(`${listboxId}-opt-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open, listboxId]);

  function commit(opt: SelectOption | undefined) {
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleNavKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (disabled) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(filteredOptions.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      commit(filteredOptions[activeIndex]);
    }
  }

  function handleTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (!searchable && e.key === " ") {
      // Space selects the highlighted option, matching native <select>. Only
      // when there's no search box to type a literal space into.
      e.preventDefault();
      commit(filteredOptions[activeIndex]);
      return;
    }
    handleNavKeyDown(e);
  }

  const selected = options.find((o) => o.value === value);

  return (
    <div className={`tsel${className ? ` ${className}` : ""}`} ref={wrapRef}>
      <button
        type="button"
        ref={mergeRefs(triggerRef, forwardedRef)}
        id={id}
        className={`tsel-trigger${disabled ? " disabled" : ""}`}
        disabled={disabled}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open ? `${listboxId}-opt-${activeIndex}` : undefined}
        aria-label={ariaLabel}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={handleTriggerKeyDown}
        onBlur={() => {
          if (!open) onBlur?.();
        }}
      >
        <span className={`tsel-value${selected ? "" : " tsel-placeholder"}`}>{selected ? selected.label : placeholder}</span>
        <ChevronDownIcon className={`tsel-chevron${open ? " open" : ""}`} />
      </button>

      {(required || name) && (
        <select
          className="tsel-native-shadow"
          tabIndex={-1}
          aria-hidden="true"
          name={name}
          required={required}
          value={value}
          onChange={() => {}}
        >
          <option value="" hidden={value !== ""} />
          {options.map((o) => (
            <option key={o.value} value={o.value} />
          ))}
        </select>
      )}

      {mounted &&
        open &&
        rect &&
        createPortal(
          <div
            ref={panelRef}
            className={`tsel-panel${rect.openUp ? " up" : ""}`}
            style={{
              position: "fixed",
              top: rect.top,
              left: rect.left,
              width: rect.width,
              transform: rect.openUp ? "translateY(-100%)" : undefined,
            }}
          >
            {searchable && (
              <div className="tsel-search">
                <SearchIcon />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleNavKeyDown}
                  placeholder={searchPlaceholder}
                  autoComplete="off"
                  aria-label={searchPlaceholder}
                  aria-controls={listboxId}
                  aria-activedescendant={filteredOptions.length ? `${listboxId}-opt-${activeIndex}` : undefined}
                />
              </div>
            )}
            <ul className="tsel-list" role="listbox" id={listboxId} aria-label={ariaLabel}>
              {filteredOptions.length === 0 && <li className="tsel-empty">No matches</li>}
              {filteredOptions.map((opt, i) => {
                const isSelected = opt.value === value;
                return (
                  <li
                    key={opt.value}
                    id={`${listboxId}-opt-${i}`}
                    role="option"
                    aria-selected={isSelected}
                    className={`tsel-option${isSelected ? " selected" : ""}${i === activeIndex ? " active" : ""}`}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => commit(opt)}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <CheckIcon className="tsel-check" />}
                  </li>
                );
              })}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
});

export default Select;
