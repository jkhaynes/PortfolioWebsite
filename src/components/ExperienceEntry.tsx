import Tag from "@/components/Tag";

export type ExperienceRole = {
  role: string;
  period: string;
  bullets: Array<string | ExperienceBullet>;
  /** Present only on roles that need a stable, focusable link target (e.g. for Impact-metric deep links). */
  anchorId?: string;
};

export type ExperienceBullet = {
  text: string;
  anchorId?: string;
};

type ExperienceEntryProps = {
  company: string;
  location: string;
  tags: string[];
  roles: ExperienceRole[];
};

const roleHeadingFocusStyles =
  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

function ExperienceBulletList({
  bullets,
}: {
  bullets: ExperienceRole["bullets"];
}) {
  return (
    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
      {bullets.map((bullet) => {
        const text = typeof bullet === "string" ? bullet : bullet.text;
        const anchorId =
          typeof bullet === "string" ? undefined : bullet.anchorId;

        return (
          <li
            key={text}
            id={anchorId}
            tabIndex={anchorId ? -1 : undefined}
            className={anchorId ? "impact-target" : undefined}
          >
            {text}
          </li>
        );
      })}
    </ul>
  );
}

export default function ExperienceEntry({
  company,
  location,
  tags,
  roles,
}: ExperienceEntryProps) {
  const isSingleRole = roles.length === 1;

  return (
    <div className="border-t border-border pt-8 first:border-t-0 first:pt-0">
      {isSingleRole ? (
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3
            id={roles[0].anchorId}
            tabIndex={roles[0].anchorId ? -1 : undefined}
            className={`font-display text-lg font-semibold text-foreground ${roles[0].anchorId ? roleHeadingFocusStyles : ""}`}
          >
            {roles[0].role}, {company}
          </h3>
          <p className="text-sm text-muted">{roles[0].period}</p>
        </div>
      ) : (
        <h3 className="font-display text-lg font-semibold text-foreground">
          {company}
        </h3>
      )}
      <p className="text-sm text-muted">{location}</p>

      {isSingleRole ? (
        <ExperienceBulletList bullets={roles[0].bullets} />
      ) : (
        <div className="mt-4 space-y-6">
          {roles.map((role, index) => (
            <div key={role.role}>
              {index > 0 && (
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" aria-hidden="true" />
                  <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-accent">
                    Promoted
                  </span>
                  <span className="h-px flex-1 bg-border" aria-hidden="true" />
                </div>
              )}
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h4
                  id={role.anchorId}
                  tabIndex={role.anchorId ? -1 : undefined}
                  className={`font-semibold text-foreground ${role.anchorId ? roleHeadingFocusStyles : ""}`}
                >
                  {role.role}
                </h4>
                <p className="text-sm text-muted">{role.period}</p>
              </div>
              <ExperienceBulletList bullets={role.bullets} />
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    </div>
  );
}
