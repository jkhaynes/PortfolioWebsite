"use client";

import { selectTheme, useTheme } from "@/lib/theme-store";

const choices = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "pokemon", label: "Pokémon" },
] as const;

export default function ThemeToggle() {
  const theme = useTheme();
  return (
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
  );
}
