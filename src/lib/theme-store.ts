"use client";

import { useSyncExternalStore } from "react";
import { isTheme, THEME_COLORS, THEME_STORAGE_KEY, type Theme } from "./theme";

// Keep explicit choices authoritative even when browser storage is blocked.
let sessionChoice: Theme | null = null;

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme =
    theme === "dark" ? "dark" : "light";
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute("content", THEME_COLORS[theme]);
  });
}

export function selectTheme(theme: Theme) {
  sessionChoice = theme;
  applyTheme(theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
  window.dispatchEvent(new Event("themechange"));
}

function getSnapshot(): Theme | null {
  const value = document.documentElement.dataset.theme;
  return isTheme(value) ? value : null;
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const followSystem = () => {
    let stored: unknown = null;
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {}
    if (sessionChoice === null && !isTheme(stored)) {
      applyTheme(media.matches ? "dark" : "light");
      onChange();
    }
  };
  const followStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
    try {
      if (event.storageArea !== localStorage) return;
    } catch {
      return;
    }
    sessionChoice = isTheme(event.newValue) ? event.newValue : null;
    applyTheme(sessionChoice ?? (media.matches ? "dark" : "light"));
    onChange();
  };
  media.addEventListener("change", followSystem);
  window.addEventListener("storage", followStorage);
  window.addEventListener("themechange", onChange);
  return () => {
    media.removeEventListener("change", followSystem);
    window.removeEventListener("storage", followStorage);
    window.removeEventListener("themechange", onChange);
  };
}

const getServerSnapshot = () => null;

export function useTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
