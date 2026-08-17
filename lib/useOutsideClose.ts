"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

/**
 * Closes a panel/menu on outside pointer-down or Escape. There is no CSS or
 * declarative-React equivalent for "did the user click outside this
 * element" — every popover/dropdown/menu library resolves it the same way,
 * with a single document-level listener. Pass every container ref that
 * should count as "inside" (e.g. a trigger button plus its panel); a click
 * only closes the layer when it lands outside all of them.
 *
 * Reused by SortFilterBar (filter panel, sort panel) and UserMenu (bell +
 * avatar dropdowns) instead of each owning its own copy of this effect.
 */
export function useOutsideClose(
  refs: RefObject<HTMLElement | null>[],
  onClose: () => void,
  options?: { active?: boolean }
) {
  const active = options?.active ?? true;

  useEffect(() => {
    if (!active) return;

    function handlePointerDown(e: MouseEvent) {
      if (refs.length === 0) return;
      const target = e.target as Node;
      const insideAny = refs.some((ref) => ref.current?.contains(target));
      if (!insideAny) onClose();
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("click", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, onClose]);
}
