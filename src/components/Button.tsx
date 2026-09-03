"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import ExternalLinkMark from "@/components/ExternalLinkMark";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
  trackEvent?: string;
  /** When set, clicking the button smooth-scrolls to this element id and moves keyboard focus to it, instead of relying on the plain anchor jump. */
  scrollFocusTargetId?: string;
};

const baseStyles =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold transition-all duration-300 ease-out motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-accent text-white shadow-soft motion-safe:hover:shadow-soft-hover",
  secondary: "border border-accent text-accent hover:bg-accent-soft",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  trackEvent,
  scrollFocusTargetId,
  onClick,
  ...props
}: ButtonProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (!scrollFocusTargetId) return;

    const target = document.getElementById(scrollFocusTargetId);
    if (!target) return;

    event.preventDefault();

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
    target.focus();
  };

  return (
    <a
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      data-umami-event={trackEvent}
      onClick={scrollFocusTargetId ? handleClick : onClick}
      {...props}
    >
      {children}
      {props.target === "_blank" && <ExternalLinkMark />}
    </a>
  );
}
