"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Holds the project cards as a hand and deals them in once, when the
// section first nears the viewport. Reduced motion skips the deal.
export default function ProjectHand({ children }: { children: ReactNode }) {
  const handRef = useRef<HTMLDivElement>(null);
  const [dealt, setDealt] = useState(false);

  useEffect(() => {
    const hand = handRef.current;
    if (!hand) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDealt(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px 15% 0px" },
    );
    observer.observe(hand);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={handRef}
      className="project-hand"
      data-dealt={dealt ? "true" : undefined}
    >
      {children}
    </div>
  );
}
