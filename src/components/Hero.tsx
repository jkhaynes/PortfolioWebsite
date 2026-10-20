import Button from "@/components/Button";
import Container from "@/components/Container";
import SylveonPortrait from "@/components/SylveonPortrait";
import TextLink from "@/components/TextLink";

export default function Hero() {
  return (
    <section className="portfolio-hero py-24">
      <Container className="hero-container">
        <div className="hero-copy">
          <p className="hero-role mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
            Senior Software Engineer · C#/.NET · Backend + Full Stack
          </p>
          <h1 className="font-display text-5xl font-semibold leading-tight text-foreground sm:text-6xl">
            Hi, I&apos;m Jessica
          </h1>
          <div className="motif-divider" aria-hidden="true">
            <span />
          </div>
          <p className="hero-tagline mt-4 font-display text-2xl leading-snug text-accent-secondary sm:text-3xl">
            I build reliable software for messy, real-world problems.
          </p>
          <p className="hero-bio mt-6 text-lg leading-relaxed text-muted">
            9+ years building and modernizing production .NET systems, with AI
            used inside a disciplined engineering process.
          </p>
          <div className="hero-actions mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <Button
              href="#projects"
              variant="primary"
              scrollFocusTargetId="projects-heading"
              trackEvent="view_featured_work_click"
              className="w-full sm:w-auto"
            >
              View Featured Work
            </Button>
            <Button
              href="/Jessica_Haynes_Resume.pdf"
              variant="secondary"
              target="_blank"
              rel="noopener noreferrer"
              trackEvent="resume_download"
              className="w-full sm:w-auto"
            >
              Download Resume
            </Button>
          </div>
          <div className="hero-contact mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted">
            <TextLink
              href="mailto:jkhaynes2390@gmail.com"
              target="_self"
              trackEvent="email_click"
            >
              Email
            </TextLink>
            <TextLink
              href="https://github.com/jkhaynes"
              trackEvent="github_click"
            >
              GitHub
            </TextLink>
            <TextLink
              href="https://linkedin.com/in/jesshaynes"
              trackEvent="linkedin_click"
            >
              LinkedIn
            </TextLink>
          </div>
        </div>
        <SylveonPortrait />
      </Container>
    </section>
  );
}
