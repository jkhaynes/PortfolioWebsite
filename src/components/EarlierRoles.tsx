"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Folds the earlier roles behind one toggle. A link to a role inside (a
// career-line stop, or a shared URL) opens the fold and lands on that role.
export default function EarlierRoles({
  count,
  years,
  children,
}: {
  count: number;
  years: string;
  children: ReactNode;
}) {
  const groupRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    function openForHash(moveFocus: boolean) {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (!group || !target || !group.contains(target)) return;
      group.open = true;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      if (moveFocus) target.focus({ preventScroll: true });
    }

    openForHash(false);
    const onHashChange = () => openForHash(true);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <details ref={groupRef} className="earlier-roles">
      <summary>
        Earlier roles ({count})
        <span className="earlier-roles__years">{years}</span>
      </summary>
      <div className="earlier-roles__body space-y-10">{children}</div>
    </details>
  );
}
