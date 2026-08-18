import Tag from "@/components/Tag";
import TextLink from "@/components/TextLink";

type ProjectCardProps = {
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
};

export default function ProjectCard({
  title,
  description,
  tags,
  demoUrl,
  githubUrl,
}: ProjectCardProps) {
  return (
    <div className="h-full rounded-3xl bg-gradient-to-br from-accent via-accent-secondary to-accent-soft p-[2px] shadow-soft transition-all duration-300 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-soft-hover">
      <div className="flex h-full flex-col rounded-[calc(1.5rem-2px)] bg-surface/95 p-6 backdrop-blur-md">
        <h3 className="font-display text-xl font-semibold text-foreground">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        {(demoUrl || githubUrl) && (
          <div className="mt-4 flex flex-wrap gap-4">
            {demoUrl && (
              <TextLink href={demoUrl} trackEvent="project_demo_click">
                Live Demo
              </TextLink>
            )}
            {githubUrl && (
              <TextLink href={githubUrl} trackEvent="project_github_click">
                GitHub
              </TextLink>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
