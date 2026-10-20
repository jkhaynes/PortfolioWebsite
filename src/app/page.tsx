import Button from "@/components/Button";
import Card from "@/components/Card";
import CareerLine from "@/components/CareerLine";
import Container from "@/components/Container";
import EarlierRoles from "@/components/EarlierRoles";
import ExperienceEntry from "@/components/ExperienceEntry";
import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import ImpactMetricLink from "@/components/ImpactMetricLink";
import Nav from "@/components/Nav";
import ProjectHand from "@/components/ProjectHand";
import ProjectShowcase from "@/components/ProjectShowcase";
import TextLink from "@/components/TextLink";
import PokemonModeHint from "@/components/PokemonModeHint";
import { experience } from "@/data/experience";
import { impactMetrics } from "@/data/impact";
import { projects } from "@/data/projects";

const workPrinciples = [
  {
    label: "Problem-Solving & Collaboration",
    body: (
      <>
        I like understanding the problem I&apos;m solving, asking questions when
        something doesn&apos;t make sense, and working with the people around me
        to find a good solution. When I notice the same problem coming up or
        something making work harder than it needs to be, I work on fixing it.
      </>
    ),
  },
  {
    label: "Staying Current",
    body: (
      <>
        I enjoy learning new technologies, evaluating how I work, and adopting
        tools and approaches that improve my development process. Recently,
        I&apos;ve been exploring how AI-assisted development can help me work
        more efficiently while maintaining the technical understanding and
        engineering judgment needed to deliver reliable software.
      </>
    ),
  },
];

const learningThemes = [
  "Agentic engineering workflows",
  "AI evaluation & reliability",
  "Human-in-the-loop product design",
] as const;

const recentExperience = experience.filter((entry) => !entry.earlier);
const earlierExperience = experience.filter((entry) => entry.earlier);
const earlierPeriods = earlierExperience
  .flatMap((entry) => entry.roles)
  .flatMap((role) => role.period.match(/\d{4}/g) ?? [])
  .map(Number);
const earlierYears = `${Math.min(...earlierPeriods)} – ${Math.max(...earlierPeriods)}`;

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content" className="portfolio-home" tabIndex={-1}>
        <div id="top" className="scroll-mt-24" />
        <Hero />

        <section id="impact" className="pb-24">
          <Container>
            <h2 className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Impact &amp; Highlights
            </h2>
            <div className="grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
              {impactMetrics.map((metric) => (
                <ImpactMetricLink key={metric.label} {...metric} />
              ))}
            </div>
          </Container>
        </section>

        <section id="projects" className="pb-24">
          <Container>
            <h2
              id="projects-heading"
              tabIndex={-1}
              className="mb-10 text-center font-display text-2xl font-semibold text-foreground focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Featured Projects
            </h2>
            <ProjectHand>
              {projects.map((project) => (
                <ProjectShowcase key={project.title} {...project} />
              ))}
            </ProjectHand>
          </Container>
        </section>

        <section id="experience" className="pb-24">
          <Container className="max-w-3xl">
            <h2
              id="experience-heading"
              tabIndex={-1}
              className="impact-target mb-10 font-display text-2xl font-semibold text-foreground"
            >
              Experience
            </h2>
            <CareerLine experience={experience} />
            <div className="space-y-10">
              {recentExperience.map((entry) => (
                <ExperienceEntry
                  key={`${entry.company}-${entry.roles[0].role}`}
                  {...entry}
                />
              ))}
            </div>
            <EarlierRoles
              count={earlierExperience.flatMap((entry) => entry.roles).length}
              years={earlierYears}
            >
              {earlierExperience.map((entry) => (
                <ExperienceEntry
                  key={`${entry.company}-${entry.roles[0].role}`}
                  {...entry}
                />
              ))}
            </EarlierRoles>
            <TextLink
              href="/Jessica_Haynes_Resume.pdf"
              trackEvent="resume_download"
              className="experience-resume"
            >
              View full résumé
            </TextLink>
          </Container>
        </section>

        <section id="about" aria-labelledby="about-heading" className="pb-24">
          <Container>
            <h2
              id="about-heading"
              tabIndex={-1}
              className="font-display text-2xl font-semibold text-foreground focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              About
            </h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted">
              I&apos;m a senior software engineer who builds and modernizes
              full-stack enterprise applications, mostly C#/.NET backends, APIs
              and Entity Framework, with MySQL, Angular and TypeScript
              alongside. I&apos;ve led technical projects, mentored engineers,
              written technical designs, and worked closely with Product, QA and
              DevOps.
            </p>
            <p className="about-pull-quote">
              I try to bring curiosity to my work, keep learning, and leave
              things better than I found them.
            </p>

            <section
              id="how-i-work"
              aria-labelledby="how-i-work-heading"
              className="mt-10"
            >
              <h3 id="how-i-work-heading" className="about-subheading">
                How I work
              </h3>
              <Grid className="mt-4">
                {workPrinciples.map((principle) => (
                  <Card key={principle.label}>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                      {principle.label}
                    </p>
                    <p className="mt-3 leading-relaxed text-muted">
                      {principle.body}
                    </p>
                  </Card>
                ))}
              </Grid>
            </section>

            <section
              id="learning-now"
              aria-labelledby="learning-now-heading"
              className="mt-10"
            >
              <h3 id="learning-now-heading" className="about-subheading">
                Learning now
              </h3>
              <p className="mt-3 max-w-3xl leading-relaxed text-muted">
                I&apos;m learning how to use AI more effectively in my
                engineering work. That includes building better agent workflows,
                checking how systems behave, and deciding where people need to
                stay involved in automated processes.
              </p>
              <ul
                aria-label="Current learning themes"
                className="mt-4 flex flex-wrap gap-2"
              >
                {learningThemes.map((theme) => (
                  <li key={theme} className="learning-chip">
                    <span
                      aria-hidden="true"
                      className="specimen-facet specimen-facet--quiet"
                    />
                    {theme}
                  </li>
                ))}
              </ul>
            </section>

            <PokemonModeHint />
          </Container>
        </section>

        <section id="contact" className="pb-24">
          <Container className="max-w-2xl text-center">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Let&apos;s Connect
            </h2>
            <p className="mt-3 text-muted">
              If you&apos;re hiring, have a project in mind, or want to talk
              shop, I&apos;d love to hear from you.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
              <Button
                href="mailto:jkhaynes2390@gmail.com"
                variant="primary"
                trackEvent="email_click"
              >
                Email Me
              </Button>
              <Button
                href="/Jessica_Haynes_Resume.pdf"
                variant="secondary"
                target="_blank"
                rel="noopener noreferrer"
                trackEvent="resume_download"
              >
                Download Resume
              </Button>
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
          </Container>
        </section>
      </main>
    </>
  );
}
