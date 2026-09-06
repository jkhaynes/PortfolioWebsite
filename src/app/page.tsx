import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import ExperienceEntry from "@/components/ExperienceEntry";
import Grid from "@/components/Grid";
import ImpactMetricLink from "@/components/ImpactMetricLink";
import Nav from "@/components/Nav";
import ProjectShowcase from "@/components/ProjectShowcase";
import TextLink from "@/components/TextLink";
import SylveonPortrait from "@/components/SylveonPortrait";
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

const stats = [
  {
    value: "9+",
    label: "Years of experience",
    category: "Experience",
    href: "#experience-heading",
  },
  {
    value: "95%",
    label: "Faster nightly job runtime",
    category: "Performance",
    href: "#impact-nightly-job",
  },
  {
    value: "81%",
    label: "Fewer security flaws",
    category: "Application Security",
    href: "#impact-security-flaws",
  },
  {
    value: "50%",
    label: "Fewer support escalations",
    category: "Quality & Reliability",
    href: "#impact-support-escalations",
  },
] as const;

const experience = [
  {
    company: "8am",
    location: "Austin, TX / Remote",
    tags: [".NET", "C#", "MySQL", "Entity Framework", "Angular"],
    roles: [
      {
        role: "Team Lead / Senior Software Engineer IV",
        period: "Jan 2024 – Present",
        anchorId: "experience-8am-team-lead",
        bullets: [
          {
            text: "Led a cross-functional team of 4, driving a quality-focused culture shift that achieved 6+ months of incident-free production and a 50% drop in support escalations",
            anchorId: "impact-support-escalations",
          },
          "Spearheaded the team's adoption of agentic AI coding tools (Claude Code, GitHub Copilot), improving engineering efficiency and TDD adoption",
          "Improved onboarding for QA and developers by overhauling documentation and establishing clearer project standards",
        ],
      },
      {
        role: "Senior Software Engineer III",
        period: "Mar 2022 – Jan 2024",
        anchorId: "experience-8am-senior-iii",
        bullets: [
          {
            text: "Optimized a high-volume nightly job, cutting runtime by 95%",
            anchorId: "impact-nightly-job",
          },
          "Implemented Single Sign-On (SSO) for the payment processor, integrating with clients' existing identity providers to streamline authentication",
        ],
      },
    ],
  },
  {
    company: "Proplanner.net",
    location: "Ames, IA",
    tags: ["C#", ".NET Core", "SAML", "OIDC"],
    roles: [
      {
        role: "Lead Developer",
        period: "Jan 2020 – Mar 2022",
        anchorId: "experience-proplanner-lead-developer",
        bullets: [
          "Designed and supported an Identity and Access Management service, configuring SAML/OIDC connections for all clients",
          {
            text: "Led a team that reduced security vulnerabilities by 81% across all applications",
            anchorId: "impact-security-flaws",
          },
          "Engaged directly with clients to gather feature requirements and resolve deployment issues",
        ],
      },
    ],
  },
  {
    company: "Growers Edge",
    location: "West Des Moines, IA",
    tags: [".NET Core", "Angular 7", "Azure"],
    roles: [
      {
        role: "Senior Software Engineer (Team Lead)",
        period: "Feb 2019 – Jan 2020",
        bullets: [
          "Served as technical lead across multiple projects, owning design and delivery",
          "Trained and mentored junior engineers in programming methodologies and best practices",
          "Collaborated with product owners to proactively identify risks and recommend alternative technical solutions",
        ],
      },
    ],
  },
  {
    company: "Proplanner.net",
    location: "Ames, IA",
    tags: [".NET", "ASP.NET Web API", "Angular 4+"],
    roles: [
      {
        role: "Senior Software Developer",
        period: "Dec 2017 – Feb 2019",
        bullets: [
          "Increased the client base by 200% by leading a platform modernization initiative",
          "Prioritized and assigned tasks to a small team of developers",
          "Decreased time spent on support by creating a program to help automate the build process",
        ],
      },
      {
        role: "Programmer",
        period: "May 2016 – Dec 2017",
        bullets: [
          "Built and maintained features for a .NET Windows desktop application, including third-party integrations and rapid resolution of critical issues",
        ],
      },
    ],
  },
];

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content" className="portfolio-home" tabIndex={-1}>
        <div id="top" className="scroll-mt-24" />
        <section className="portfolio-hero py-24">
          <Container className="hero-container max-w-2xl">
            <div className="hero-copy">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                Senior Software Engineer · C#/.NET · Backend + Full Stack
              </p>
              <h1 className="font-display text-5xl font-semibold leading-tight text-foreground sm:text-6xl">
                Jessica Haynes
              </h1>
              <div className="pokemon-bow-divider" aria-hidden="true">
                <span />
              </div>
              <p className="mt-4 font-display text-2xl leading-snug text-accent-secondary sm:text-3xl">
                I build reliable software for messy, real-world problems.
              </p>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                I have 9+ years of experience building and modernizing
                production applications, with deep experience in C#/.NET, APIs,
                architecture, performance, and technical leadership. I use AI as
                part of a disciplined engineering process, from requirements and
                design through implementation, testing, and review.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
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
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
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

        <section id="impact" className="pb-24">
          <Container>
            <h2 className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Impact &amp; Highlights
            </h2>
            <div className="grid grid-cols-2 gap-6 border-y border-border py-10 sm:grid-cols-4">
              {stats.map((stat) => (
                <ImpactMetricLink key={stat.label} {...stat} />
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
            <Grid>
              {projects.map((project) => (
                <ProjectShowcase key={project.title} {...project} />
              ))}
            </Grid>
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
            <div className="space-y-10">
              {experience.map((entry) => (
                <ExperienceEntry
                  key={`${entry.company}-${entry.roles[0].role}`}
                  {...entry}
                />
              ))}
            </div>
          </Container>
        </section>

        <section id="how-i-work" className="pb-24">
          <Container className="max-w-3xl">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              How I Work
            </h2>
            <p className="mt-4 max-w-2xl font-display text-xl leading-snug text-foreground">
              I&apos;m a collaborative developer who cares about quality,
              follow-through, and continuing to grow.
            </p>
            <Grid className="mt-8">
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
            <p className="mt-10 text-center font-display text-lg text-accent-secondary">
              I try to bring curiosity to my work, keep learning, and leave
              things better than I found them.
            </p>
          </Container>
        </section>

        <section
          id="learning-now"
          aria-labelledby="learning-now-heading"
          className="pb-24"
        >
          <Container>
            <div className="learning-specimen-strip overflow-hidden rounded-3xl border border-border bg-surface shadow-soft lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
              <div className="p-6 sm:p-8">
                <h2
                  id="learning-now-heading"
                  className="font-display text-2xl font-semibold text-foreground"
                >
                  Learning now
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                  I&apos;m learning how to use AI more effectively in my
                  engineering work. That includes building better agent
                  workflows, checking how systems behave, and deciding where
                  people need to stay involved in automated processes.
                </p>
              </div>
              <ul
                aria-label="Current learning themes"
                className="grid border-t border-border sm:grid-cols-3 sm:divide-x sm:divide-border lg:border-l lg:border-t-0"
              >
                {learningThemes.map((theme) => (
                  <li
                    key={theme}
                    className="flex min-h-24 items-center gap-3 border-t border-border px-6 py-5 first:border-t-0 sm:min-h-0 sm:border-t-0 sm:px-5"
                  >
                    <span
                      aria-hidden="true"
                      className="specimen-facet specimen-facet--quiet"
                    />
                    <span className="text-pretty text-sm font-semibold leading-snug text-foreground">
                      {theme}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        <section id="about" className="pb-24">
          <Container className="max-w-2xl">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              About Me
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed text-muted">
              <p>
                I&apos;m a Senior Software Engineer, and I&apos;ve spent the past
                9+ years building and modernizing full-stack enterprise
                applications. Most of my work focuses on C#/.NET backends,
                APIs, and Entity Framework, including improving performance and
                designing systems that can scale. I also work with MySQL,
                Angular, and TypeScript. Along the way, I&apos;ve led technical
                projects, mentored engineers, written technical designs, and
                worked closely with Product, QA, and DevOps.
              </p>
              <p>
                I&apos;ve enjoyed figuring out how to cut a high-volume
                background job&apos;s runtime by 95% and improving testing and
                observability to help keep production incident-free for 6+
                months. I&apos;ve also worked on SSO and identity integrations
                and updated older applications and development practices.
              </p>
              <p>
                I enjoy solving complex engineering problems, improving existing
                systems, and learning new technologies when they&apos;re the
                right tool for the job.
              </p>
            </div>
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
