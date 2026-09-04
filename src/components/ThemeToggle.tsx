"use client";

import { useSyncExternalStore } from "react";
import {
  isTheme,
  THEME_COLORS,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute("content", THEME_COLORS[theme]));
}

function getThemeSnapshot(): Theme | null {
  const theme = document.documentElement.dataset.theme;
  return isTheme(theme) ? theme : null;
}

function subscribeToTheme(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const followSystem = (event: MediaQueryListEvent) => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {}

    if (!isTheme(stored)) {
      applyTheme(event.matches ? "dark" : "light");
      onChange();
    }
  };
  const followStoredTheme = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    const nextTheme = isTheme(event.newValue)
      ? event.newValue
      : media.matches
        ? "dark"
        : "light";
    applyTheme(nextTheme);
    onChange();
  };

  media.addEventListener("change", followSystem);
  window.addEventListener("storage", followStoredTheme);
  window.addEventListener("themechange", onChange);
  queueMicrotask(() => {
    const theme = getThemeSnapshot();
    if (theme) applyTheme(theme);
    onChange();
  });
  return () => {
    media.removeEventListener("change", followSystem);
    window.removeEventListener("storage", followStoredTheme);
    window.removeEventListener("themechange", onChange);
  };
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => null,
  );

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {}
    window.dispatchEvent(new Event("themechange"));
  }

  const dark = theme === "dark";
  const actionLabel = theme
    ? `Switch to ${dark ? "light" : "dark"} theme`
    : "Change color theme";

  return (
    <button
      type="button"
      aria-label={actionLabel}
      aria-pressed={dark}
      onClick={toggleTheme}
      className="theme-toggle"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        {dark ? (
          <>
            <circle cx="12" cy="12" r="3.5" />
            <path d="M12 2.5v2M12 19.5v2M4.5 12h-2M21.5 12h-2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
          </>
        ) : (
          <path d="M20.1 15.2A8.2 8.2 0 0 1 8.8 3.9 8.2 8.2 0 1 0 20.1 15.2Z" />
        )}
      </svg>
      <span>{theme ? (dark ? "Light" : "Dark") : "Theme"}</span>
    </button>
  );
}
