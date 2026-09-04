export const THEME_STORAGE_KEY = "jessbuilds-theme";

export type Theme = "light" | "dark";

export const THEME_COLORS: Record<Theme, string> = {
  light: "#fdf6f6",
  dark: "#1e1e2e",
};

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export const themeInitScript = `(() => {
  const key = "${THEME_STORAGE_KEY}";
  let stored = null;
  try { stored = localStorage.getItem(key); } catch {}
  const theme = stored === "light" || stored === "dark"
    ? stored
    : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "${THEME_COLORS.dark}" : "${THEME_COLORS.light}");
})();`;
