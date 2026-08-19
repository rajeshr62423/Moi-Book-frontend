import { useCallback, useEffect, useRef } from "react";

/**
 * Returns a debounced version of `callback` — repeated calls within `delayMs`
 * of each other collapse into a single invocation after the last one settles.
 * Always calls the latest `callback` passed in (no stale-closure risk), and
 * cancels any pending call on unmount.
 */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number
): (...args: Args) => void {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return useCallback(
    (...args: Args) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callbackRef.current(...args), delayMs);
    },
    [delayMs]
  );
}
