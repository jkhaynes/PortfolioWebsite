"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Work", section: "projects" },
  { label: "Experience", section: "experience" },
  { label: "About", section: "about" },
  { label: "Contact", section: "contact" },
] as const;

export default function NavLinks() {
  const pathname = usePathname();
  const [current, setCurrent] = useState<string | null>(null);

  // Highlight the homepage section crossing the middle of the viewport.
  useEffect(() => {
    if (pathname !== "/") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const { section } of navLinks) {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <ul className="site-nav-links">
      {navLinks.map(({ label, section }) => (
        <li key={section}>
          <Link
            href={`/#${section}`}
            className="site-nav-link"
            aria-current={
              pathname === "/" && current === section ? "location" : undefined
            }
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
