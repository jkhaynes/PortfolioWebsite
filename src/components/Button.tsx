"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { track } from "@vercel/analytics";
import ExternalLinkMark from "@/components/ExternalLinkMark";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
  trackEvent?: string;
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
  onClick,
  ...props
}: ButtonProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (trackEvent) {
      track(trackEvent);
    }
    onClick?.(event);
  };

  return (
    <a
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
      {props.target === "_blank" && <ExternalLinkMark />}
    </a>
  );
}
