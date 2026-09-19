import type { ExperienceCompany } from "@/data/experience";

type Stop = {
  role: string;
  company: string;
  year: string;
  href: string;
  promoted: boolean;
};

// Every role as a stop, oldest first. A role is a promotion when the role
// before it is at the same company entry.
function careerStops(experience: ExperienceCompany[]): Stop[] {
  return experience
    .flatMap(({ company, roles }) =>
      roles.map((role, index) => ({
        role: role.shortRole,
        company: company.replace(/\.net$/, ""),
        year: role.period.match(/\d{4}/)?.[0] ?? "",
        href: `#${role.anchorId}`,
        // Roles are listed newest first, so the older role comes after.
        promoted: index < roles.length - 1,
      })),
    )
    .reverse();
}

// A metro line of every role, with "promoted" written on the track.
export default function CareerLine({
  experience,
}: {
  experience: ExperienceCompany[];
}) {
  const stops = careerStops(experience);
  const current = stops.length - 1;

  return (
    <ol
      className="career-line"
      aria-label={`Career path, ${stops[0].year} to now`}
    >
      {stops.map((stop, index) => (
        <li key={stop.href} className="career-stop">
          {stop.promoted && (
            <span className="career-stop__why" aria-hidden="true">
              promoted
            </span>
          )}
          <a
            href={stop.href}
            className="career-stop__link"
            aria-current={index === current ? "step" : undefined}
          >
            <span className="career-stop__dot" aria-hidden="true" />
            <span className="career-stop__role">{stop.role}</span>
            <span className="career-stop__meta">
              {stop.company} · {stop.year}
              {index === current && " – now"}
            </span>
            {stop.promoted && <span className="sr-only">, promoted</span>}
          </a>
        </li>
      ))}
    </ol>
  );
}
