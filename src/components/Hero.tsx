import Button from "@/components/Button";
import Container from "@/components/Container";
import HeroFairy from "@/components/HeroFairy";
import ImpactMetricLink from "@/components/ImpactMetricLink";
import RibbonRoundupLauncher from "@/components/RibbonRoundupLauncher";
import TextLink from "@/components/TextLink";
import { impactMetrics } from "@/data/impact";

export default function Hero() {
  return (
    <section className="portfolio-hero">
      <HeroFairy />
      <Container className="hero-container">
        <div className="hero-body">
          <div className="hero-copy">
            <div className="hero-game">
              <RibbonRoundupLauncher />
            </div>
            <h1 className="hero-title font-display">Hi, I&apos;m Jessica</h1>
            <p className="hero-role">
              Senior Software Engineer · C#/.NET · Backend + Full Stack
            </p>
            <p className="hero-tagline font-display text-foreground">
              I build reliable software for messy, real-world problems.
            </p>
            <p className="hero-bio text-muted">
              9+ years building and modernizing production .NET systems, with AI
              used inside a disciplined engineering process.
            </p>
            <div className="hero-actions">
              <Button
                href="#projects"
                variant="primary"
                scrollFocusTargetId="projects-heading"
                trackEvent="view_featured_work_click"
                className="hero-primary w-full sm:w-auto"
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
            <div className="hero-contact text-muted">
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
          <div className="hero-stats">
            <div className="motif-divider" aria-hidden="true">
              <span />
            </div>
            <div className="hero-stats-grid">
              {impactMetrics.map((metric) => (
                <ImpactMetricLink
                  key={metric.label}
                  variant="hero"
                  {...metric}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="hero-scroll-cue" aria-hidden="true">
          <span />
        </div>
      </Container>
    </section>
  );
}
