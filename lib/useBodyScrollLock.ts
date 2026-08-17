"use client";

import { useEffect, useRef } from "react";

/**
 * Locks page scroll behind a fixed-position overlay (modal, bottom sheet)
 * while `locked` is true, and restores the exact scroll position on
 * unlock. There's no CSS-only way to stop the page behind a fixed overlay
 * from scrolling on iOS Safari, so this is one of the few places direct
 * `document.body` mutation is genuinely required rather than a legacy
 * leftover — kept here as a single reusable hook instead of duplicated
 * per-component effects.
 */
export function useBodyScrollLock(locked: boolean) {
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (locked) {
      scrollYRef.current = window.scrollY || window.pageYOffset || 0;
      document.body.classList.add("modal-open");
      document.body.style.top = `-${scrollYRef.current}px`;
    } else {
      document.body.classList.remove("modal-open");
      document.body.style.top = "";
      window.scrollTo(0, scrollYRef.current);
    }
  }, [locked]);
}
