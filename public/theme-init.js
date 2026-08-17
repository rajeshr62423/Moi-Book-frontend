/*
 * Sets data-accent / data-theme / data-appearance on <html> before the
 * page paints, so the correct theme is visible on first frame instead of
 * flashing the default and then snapping to the saved one.
 *
 * This must run before hydration and before any CSS-affecting paint, which
 * is earlier than any React code can execute — there is no React tree yet
 * at this point, so this genuinely cannot be a component or a hook. It is
 * loaded via <Script strategy="beforeInteractive"> from
 * components/ThemeInitScript.tsx, which is the one place that references
 * this file.
 *
 * The localStorage keys read here are the same ones ThemeProvider
 * (lib/theme.tsx) reads after mount to sync its React state — keep them in
 * sync if either side changes.
 */
(function () {
  try {
    var accent =
      localStorage.getItem("imoibook-color-theme") ||
      localStorage.getItem("imoibook-theme-color") ||
      "original";
    document.documentElement.setAttribute("data-accent", accent);

    var appearance =
      localStorage.getItem("imoibook-appearance") ||
      localStorage.getItem("moi-theme") ||
      "light";
    var mode = appearance;
    if (appearance === "system") {
      mode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else if (appearance !== "dark" && appearance !== "light") {
      mode = "light";
    }
    document.documentElement.setAttribute("data-theme", mode);
    document.documentElement.setAttribute("data-appearance", appearance);
  } catch (e) {
    document.documentElement.setAttribute("data-accent", "original");
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.setAttribute("data-appearance", "light");
  }
})();
