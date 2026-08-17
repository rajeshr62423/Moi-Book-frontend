/**
 * A handful of document-level attributes are driven by client-only state
 * (theme accent/appearance, language) that lives in React context providers
 * nested well below `<html>`. The App Router gives no way for a nested
 * client component to control props on the root layout's `<html>` element,
 * so setting these attributes imperatively from a `useEffect` — after the
 * relevant state changes — is the correct, idiomatic escape hatch (the same
 * technique libraries like next-themes use internally), not a legacy
 * leftover. These tiny helpers just give that one pattern a single home
 * instead of repeating `document.documentElement.setAttribute(...)` inline
 * in every provider.
 */
export function setDocumentAttribute(name: string, value: string) {
  document.documentElement.setAttribute(name, value);
}

export function setMetaThemeColor(color: string) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
}
