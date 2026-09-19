"use client";

import { selectTheme } from "@/lib/theme-store";

export default function PokemonModeHint() {
  return (
    <p className="pokemon-hint">
      Psst, there&apos;s a Pokémon mode.{" "}
      <button
        type="button"
        className="pokemon-hint__button"
        onClick={() => {
          selectTheme("pokemon");
          // The hint hides in Pokémon mode; keep focus from falling to <body>.
          document.getElementById("about-heading")?.focus();
        }}
      >
        Try Pokémon mode
      </button>
    </p>
  );
}
