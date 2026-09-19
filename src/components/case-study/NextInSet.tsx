import Button from "@/components/Button";
import ProjectShowcase from "@/components/ProjectShowcase";
import { projects, type Project } from "@/data/projects";

// Deals the rest of the set after a case study, looping back to the start.
export default function NextInSet({ current }: { current: Project }) {
  const index = projects.indexOf(current);
  const next = projects[(index + 1) % projects.length];
  const other = projects[(index + 2) % projects.length];
  const card = (project: Project) => (
    <ProjectShowcase
      {...project}
      media={project.media && { ...project.media, priority: false }}
      imageSizes="(min-width: 1024px) 34rem, calc(100vw - 4rem)"
    />
  );

  return (
    <section aria-labelledby="next-in-set-heading" className="next-set">
      <h2 id="next-in-set-heading" className="next-set__heading">
        <span aria-hidden="true" className="specimen-facet" />
        Next in the set
      </h2>
      <div className="next-set__row">
        {card(next)}
        <div className="grid content-start gap-4">
          <p className="text-sm text-muted">
            Case study {index + 1} of {projects.length}. Up next: {next.title}.
          </p>
          {card(other)}
        </div>
      </div>
      <div className="next-set__connect">
        <div>
          <p className="font-display text-lg font-semibold text-foreground">
            Let&apos;s connect
          </p>
          <p className="mt-1 text-sm text-muted">
            If you&apos;re hiring, have a project in mind, or want to talk
            shop, I&apos;d love to hear from you.
          </p>
        </div>
        <Button href="mailto:jkhaynes2390@gmail.com" trackEvent="email_click">
          Email Me
        </Button>
      </div>
    </section>
  );
}
