import type { AnchorHTMLAttributes, ReactNode } from "react";
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
  ...props
}: TextLinkProps) {
  return (
    <a
      target={target}
      rel={rel}
      className={`rounded text-sm font-medium text-muted transition-colors duration-200 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
      data-umami-event={trackEvent}
      {...props}
    >
      {children}
      {target === "_blank" && <ExternalLinkMark />}
    </a>
  );
}
