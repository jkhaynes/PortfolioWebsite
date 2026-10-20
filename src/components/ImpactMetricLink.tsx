"use client";

import type { MouseEvent } from "react";

type ImpactMetricLinkProps = {
  value: string;
  label: string;
  category: string;
  href: `#${string}`;
  variant?: "default" | "hero";
};

export default function ImpactMetricLink({
  value,
  label,
  category,
  href,
  variant = "default",
}: ImpactMetricLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const target = document.getElementById(href.slice(1));
    if (!target) return;

    event.preventDefault();

    if (window.location.hash !== href) {
      window.location.hash = href;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!prefersReducedMotion && window.location.hash === href) {
      target.style.animation = "none";
      void target.offsetWidth;
      target.style.removeProperty("animation");
    }
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
    target.focus({ preventScroll: true });
  }

  const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  if (variant === "hero") {
    return (
      <a
        href={href}
        onClick={handleClick}
        aria-label={`Impact metric: ${value} ${label}. Category: ${category}`}
        className={`group flex flex-col items-center gap-0.5 rounded-2xl px-1 py-2 text-center transition-[background-color,transform] duration-300 hover:bg-accent-soft/45 motion-safe:hover:-translate-y-0.5 ${focusRing}`}
      >
        <span className="font-display text-[2rem] font-bold leading-[1.1] tabular-nums text-accent sm:text-[2.5rem]">
          {value}
        </span>
        <span className="text-[0.84rem] text-muted">{label}</span>
        <span className="mt-1 text-xs font-semibold text-accent">
          View evidence <span aria-hidden="true">↓</span>
        </span>
      </a>
    );
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      aria-label={`Impact metric: ${value} ${label}. Category: ${category}`}
      className={`group flex h-full min-h-40 flex-col items-center justify-center rounded-2xl px-3 py-5 text-center transition-[background-color,box-shadow,transform] duration-300 hover:bg-accent-soft/45 motion-safe:hover:-translate-y-0.5 ${focusRing}`}
    >
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-accent-secondary">
        {category}
      </span>
      <span className="mt-2 font-display text-3xl font-semibold text-accent sm:text-4xl">
        {value}
      </span>
      <span className="mt-2 text-sm text-muted">{label}</span>
      <span className="mt-3 text-xs font-semibold text-accent">
        View evidence <span aria-hidden="true">↓</span>
      </span>
    </a>
  );
}
