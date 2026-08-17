import type { ReactNode } from "react";

type GridProps = {
  children: ReactNode;
  className?: string;
};

// Single column on mobile, expanding to multiple columns on larger
// viewports. Later features (e.g. Featured Projects) should use this
// rather than re-inventing a grid layout per section.
export default function Grid({ children, className = "" }: GridProps) {
  return (
    <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${className}`}>
      {children}
    </div>
  );
}
