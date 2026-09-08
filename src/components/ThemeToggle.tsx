"use client";

import { selectTheme, useTheme } from "@/lib/theme-store";
import { useEffect, useId, useRef, useState } from "react";

const choices = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "pokemon", label: "Pokémon" },
] as const;

export default function ThemeToggle() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const mobileRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!mobileRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const resize = () => {
      if (desktop.matches) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    desktop.addEventListener("change", resize);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      desktop.removeEventListener("change", resize);
    };
  }, [open]);

  return (
    <>
      <div
        className="theme-mobile"
        ref={mobileRef}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            event.preventDefault();
            setOpen(false);
            triggerRef.current?.focus();
          }
        }}
      >
        <button
          type="button"
          className="theme-mobile-trigger"
          ref={triggerRef}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(!open)}
        >
          Theme{" "}
          <svg
            className="theme-mobile-chevron"
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="m4 6 4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <fieldset id={panelId} className="theme-mobile-panel" hidden={!open}>
          <legend className="sr-only">Color theme</legend>
          {choices.map(({ value, label }) => (
            <label key={value} className="theme-mobile-option">
              <input
                type="radio"
                name="mobile-color-theme"
                value={value}
                checked={theme === value}
                onChange={() => selectTheme(value)}
                onClick={() => {
                  selectTheme(value);
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
              />
              <span>{label}</span>
              <span className="theme-mobile-check" aria-hidden="true">
                ✓
              </span>
            </label>
          ))}
        </fieldset>
      </div>
      <fieldset className="theme-selector">
        <legend className="sr-only">Color theme</legend>
        {choices.map(({ value, label }) => (
          <label key={value} className="theme-choice">
            <input
              type="radio"
              name="color-theme"
              value={value}
              checked={theme === value}
              onClick={() => {
                if (theme === value) selectTheme(value);
              }}
              onChange={() => selectTheme(value)}
            />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
    </>
  );
}
