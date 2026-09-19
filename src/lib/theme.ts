export const THEME_STORAGE_KEY = "jessbuilds-theme";

export type Theme = "light" | "dark" | "pokemon";

export const THEME_COLORS: Record<Theme, string> = {
  light: "#fdf6f6",
  dark: "#1a1220",
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
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", ${JSON.stringify(THEME_COLORS)}[theme]);
})();`;
