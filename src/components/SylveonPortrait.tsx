"use client";

import Image from "next/image";
import { useTheme } from "@/lib/theme-store";
import RibbonRoundupLauncher from "@/components/RibbonRoundupLauncher";

export default function SylveonPortrait() {
  const theme = useTheme();
  return (
    <aside className="sylveon-portrait" aria-label="Sylveon theme illustration">
      <span className="sylveon-ribbon" aria-hidden="true" />
      <div className="sylveon-portrait__art">
        {theme === "pokemon" && (
          <Image
            src="/images/pokemon/sylveon.png"
            alt="Sylveon with pink bows and flowing pink-and-blue ribbons"
            width={475}
            height={475}
            sizes="(min-width: 1024px) 300px, 240px"
          />
        )}
      </div>
      <p className="font-display text-sm text-accent-secondary">
        A little fairy-type charm.
      </p>
      <RibbonRoundupLauncher />
    </aside>
  );
}
