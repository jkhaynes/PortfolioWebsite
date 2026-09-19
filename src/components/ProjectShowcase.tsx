import Image from "next/image";
import Link from "next/link";
import Tag from "@/components/Tag";
import type { Project } from "@/data/projects";

export default function ProjectShowcase({
  title,
  status,
  cardSummary,
  tags,
  caseStudyUrl,
  media,
  imageSizes = "(min-width: 1024px) 296px, 82vw",
}: Project & { imageSizes?: string }) {
  return (
    <article data-project-card className="project-specimen-card">
      <span className="project-sylveon-peek" aria-hidden="true">
        <span />
      </span>
      <div className="project-specimen-card__surface">
        <div className="project-specimen-card__register">
          <p className="project-feature-marker">
            <span aria-hidden="true" className="specimen-facet" />
            <span>Featured build</span>
          </p>
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-accent">
            {status}
          </span>
        </div>
        {media && (
          <div className="project-specimen-card__media relative mb-4 aspect-[16/10] overflow-hidden rounded-2xl bg-product-ink">
            <Image
              src={media.src}
              alt={media.alt}
              fill
              priority={media.priority}
              sizes={imageSizes}
              className={media.objectClassName}
            />
          </div>
        )}
        <h3 className="font-display text-xl font-semibold text-foreground">
          {caseStudyUrl ? (
            // Stretched over the whole card, so the card is one link named by its title.
            <Link
              href={caseStudyUrl}
              className="project-card-link"
              data-umami-event="project_case_study_click"
            >
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{cardSummary}</p>
        <ul aria-label="Tech stack" className="mt-3 flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <li key={tag} data-tag>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>
        {caseStudyUrl && (
          <span
            aria-hidden="true"
            className="mt-4 block text-sm font-semibold text-accent"
          >
            View case study →
          </span>
        )}
      </div>
    </article>
  );
}
