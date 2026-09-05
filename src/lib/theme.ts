export const THEME_STORAGE_KEY = "jessbuilds-theme";

export type Theme = "light" | "dark" | "pokemon";

export const THEME_COLORS: Record<Theme, string> = {
  light: "#fdf6f6",
  dark: "#1e1e2e",
  pokemon: "#fff5f5",
};

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "pokemon";
}

export const themeInitScript = `(() => {
  const key = "${THEME_STORAGE_KEY}";
  let stored = null;
  try { stored = localStorage.getItem(key); } catch {}
  const theme = stored === "light" || stored === "dark" || stored === "pokemon"
    ? stored
    : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme === "dark" ? "dark" : "light";
  document.querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", ${JSON.stringify(THEME_COLORS)}[theme]);
})();`;
