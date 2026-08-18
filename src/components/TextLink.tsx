"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { track } from "@vercel/analytics";
import ExternalLinkMark from "@/components/ExternalLinkMark";

type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  trackEvent?: string;
};

export default function TextLink({
  children,
  className = "",
  target = "_blank",
  rel = "noopener noreferrer",
  trackEvent,
  onClick,
  ...props
}: TextLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (trackEvent) {
      track(trackEvent);
    }
    onClick?.(event);
  };

  return (
    <a
      target={target}
      rel={rel}
      className={`rounded text-sm font-medium text-muted transition-colors duration-200 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
      {target === "_blank" && <ExternalLinkMark />}
    </a>
  );
}
