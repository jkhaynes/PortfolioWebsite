export function SectionHeading({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-accent">{label}</p>
      <h2
        id={id}
        className="mt-2 scroll-mt-24 text-balance font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl"
      >
        {children}
      </h2>
    </div>
  );
}

export function StateLabel({
  label,
  tone,
}: {
  label: string;
  tone: "done" | "planned";
}) {
  const done = tone === "done";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${done ? "bg-foreground text-white" : "border border-risk/40 bg-risk-soft text-risk-strong"}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${done ? "bg-accent-soft" : "bg-risk"}`}
      />
      {label}
    </span>
  );
}

export function FlowStep({
  step,
  label,
  detail,
  accent = false,
}: {
  step: string;
  label: string;
  detail: string;
  accent?: boolean;
}) {
  return (
    <li
      className={`relative min-w-0 border-t-2 px-1 pt-5 ${accent ? "border-risk" : "border-accent-soft"}`}
    >
      <span
        aria-hidden="true"
        className={`absolute -top-2 left-0 h-3.5 w-3.5 rounded-full border-4 border-background ${accent ? "bg-risk" : "bg-accent"}`}
      />
      <p className="text-xs font-semibold text-muted">Step {step}</p>
      <h3 className="mt-2 text-pretty font-display text-lg font-semibold text-foreground">
        {label}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{detail}</p>
    </li>
  );
}
