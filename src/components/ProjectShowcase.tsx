import Tag from "@/components/Tag";
import TextLink from "@/components/TextLink";
import CaseStudyMedia from "@/components/case-study/CaseStudyMedia";
import type { Project } from "@/data/projects";

export default function ProjectShowcase({
  title,
  status,
  accentTone,
  problemStatement,
  solutionSummary,
  tags,
  githubUrl,
  demoUrl,
  caseStudyUrl,
  media,
}: Project) {
  return (
    <article
      data-project-card
      data-accent-tone={accentTone}
      className="project-specimen-card"
    >
      <span className="project-sylveon-peek" aria-hidden="true">
        <span />
      </span>
      <div className="project-specimen-card__surface">
        <div className="project-specimen-card__register">
          <p className="project-feature-marker">
            <span aria-hidden="true" className="specimen-facet" />
            <span>Featured build</span>
          </p>
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-accent">
            {status}
          </span>
        </div>
        {media && (
          <CaseStudyMedia
            {...media}
            sizes="(min-width: 768px) 50vw, calc(100vw - 5rem)"
            aspectClassName="project-specimen-card__media mb-5 aspect-[16/9] rounded-2xl"
          />
        )}
        <h3 className="font-display text-xl font-semibold text-foreground">
          {title}
        </h3>
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
    </article>
  );
}
