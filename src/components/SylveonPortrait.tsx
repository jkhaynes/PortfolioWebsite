"use client";

import Image from "next/image";
import { useId } from "react";
import { useTheme } from "@/lib/theme-store";
import RibbonRoundupLauncher from "@/components/RibbonRoundupLauncher";

export default function SylveonPortrait() {
  const theme = useTheme();
  const clipId = useId().replace(/:/g, "");
  return (
    <aside className="sylveon-portrait" aria-label="Sylveon theme illustration">
      <span className="sylveon-ribbon" aria-hidden="true" />
      <div className="sylveon-portrait__art">
        {theme === "pokemon" && (
          <>
            <Image
              unoptimized
              style={{ clipPath: `url(#${clipId}-body)` }}
              src="/images/pokemon/sylveon.png"
              alt="Sylveon with pink bows and flowing pink-and-blue ribbons"
              width={475}
              height={475}
              sizes="(min-width: 1024px) 300px, 240px"
            />
            <svg
              className="sylveon-ear-layer"
              viewBox="0 0 475 475"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <clipPath
                  id={`${clipId}-body`}
                  clipPathUnits="objectBoundingBox"
                >
                  <path
                    clipRule="evenodd"
                    d="M0 0H1V1H0Z M.411 .371 .393 .30 .52 .155 .66 .145 .66 .27 .55 .363Z"
                  />
                </clipPath>
                <clipPath
                  id={`${clipId}-ear`}
                  clipPathUnits="objectBoundingBox"
                >
                  <path d="M.411 .371 .393 .30 .52 .155 .66 .145 .66 .27 .55 .363Z" />
                </clipPath>
              </defs>
              <g className="sylveon-twitching-ear">
                <image
                  href="/images/pokemon/sylveon.png"
                  width="475"
                  height="475"
                  clipPath={`url(#${clipId}-ear)`}
                />
              </g>
            </svg>
          </>
        )}
      </div>
      <p className="font-display text-sm text-accent-secondary">
        A little fairy-type charm.
      </p>
      <RibbonRoundupLauncher />
    </aside>
  );
}
