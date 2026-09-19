import type { ReactNode } from "react";
import type { Project } from "@/data/projects";

type CaseStudyHeroProps = {
  project: Project;
  kicker: string;
  summary: string;
  role: string;
  status: string;
  stack: string;
  actions: ReactNode;
  art: ReactNode;
};

// The case study opens as the back of the project's homepage card.
export default function CaseStudyHero({
  project,
  kicker,
  summary,
  role,
  status,
  stack,
  actions,
  art,
}: CaseStudyHeroProps) {
  const tldr = [
    { label: "Role", value: role },
    { label: "Status", value: status },
    { label: "Outcome", value: project.outcome },
    { label: "Stack", value: stack },
  ];

  return (
    <header
      data-accent-tone={project.accentTone}
      className="project-specimen-card case-card-back"
    >
      <div className="project-specimen-card__surface case-card-back__face">
        <div className="project-specimen-card__register case-card-back__register">
          <p className="project-feature-marker">
            <span aria-hidden="true" className="specimen-facet" />
            <span>Featured build · {kicker}</span>
          </p>
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-accent">
            {project.status}
          </span>
        </div>
        <div className="min-w-0">
          <h1 className="max-w-3xl text-balance font-display text-5xl font-semibold leading-[1.02] text-foreground sm:text-6xl">
            {project.title}
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-xl leading-relaxed text-accent-secondary sm:text-2xl">
            {summary}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
        </div>
        <div className="min-w-0">{art}</div>
        <dl className="case-tldr">
          {tldr.map(({ label, value }) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
