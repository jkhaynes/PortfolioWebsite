"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Holds the project cards as a hand and deals them in once, when the hand is
// 40% of the way up the screen, so the deal is seen rather than missed
// below the fold. Until then the cards wait hidden ("pending"). Without
// JavaScript, or with reduced motion, the cards simply rest in place.
export default function ProjectHand({ children }: { children: ReactNode }) {
  const handRef = useRef<HTMLDivElement>(null);
  const [dealt, setDealt] = useState<"pending" | "true">();

  useEffect(() => {
    const hand = handRef.current;
    if (!hand) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDealt("true");
          observer.disconnect();
        } else {
          setDealt((state) => state ?? "pending");
        }
      },
      { rootMargin: "0px 0px -40% 0px" },
    );
    observer.observe(hand);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={handRef} className="project-hand" data-dealt={dealt}>
      {children}
    </div>
  );
}
