import Tag from "@/components/Tag";
import TextLink from "@/components/TextLink";

export type ProjectShowcaseData = {
  title: string;
  status: string;
  problemStatement: string;
  solutionSummary: string;
  /** Reserved for the future case-study page (Features 11/12); not rendered on the card. */
  technicalDecisions: string;
  /** Reserved for the future case-study page (Features 11/12); not rendered on the card. */
  buildApproach: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  caseStudyUrl?: string;
};

export default function ProjectShowcase({
  title,
  status,
  problemStatement,
  solutionSummary,
  tags,
  githubUrl,
  demoUrl,
  caseStudyUrl,
}: ProjectShowcaseData) {
  return (
    <div className="h-full rounded-3xl bg-gradient-to-br from-accent via-accent-secondary to-accent-soft p-[2px] shadow-soft transition-all duration-300 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-soft-hover">
      <div className="flex h-full flex-col rounded-[calc(1.5rem-2px)] bg-surface/95 p-6 backdrop-blur-md">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h3 className="font-display text-xl font-semibold text-foreground">
            {title}
          </h3>
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-accent">
            {status}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {problemStatement}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {solutionSummary}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        {(caseStudyUrl || demoUrl || githubUrl) && (
          <div className="mt-4 flex flex-wrap gap-4">
            {caseStudyUrl && (
              <TextLink
                href={caseStudyUrl}
                target="_self"
                trackEvent="project_case_study_click"
              >
                View Case Study
              </TextLink>
            )}
            {demoUrl && (
              <TextLink href={demoUrl} trackEvent="project_demo_click">
                Live Demo
              </TextLink>
            )}
            {githubUrl && (
              <TextLink href={githubUrl} trackEvent="project_github_click">
                View GitHub
              </TextLink>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
