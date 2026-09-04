import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import ExperienceEntry from "@/components/ExperienceEntry";
import Grid from "@/components/Grid";
import ImpactMetricLink from "@/components/ImpactMetricLink";
import Nav from "@/components/Nav";
import ProjectShowcase from "@/components/ProjectShowcase";
import TextLink from "@/components/TextLink";
import { projects } from "@/data/projects";

const workPrinciples = [
  {
    label: "Problem-Solving & Collaboration",
    body: (
      <>
        I like understanding the problem I&apos;m solving, asking questions when
        something doesn&apos;t make sense, and working with the people around me
        to find a good solution. I tend to notice recurring problems and areas
        of friction, and I care about{" "}
        <strong className="font-semibold text-foreground">
          fixing what I can rather than simply getting used to the workaround.
        </strong>
      </>
    ),
  },
  {
    label: "Staying Current",
    body: (
      <>
        I also think staying current is an important part of being a software
        engineer. I enjoy learning new technologies, reevaluating the way I
        work, and finding practical ways to incorporate better tools and
        approaches. More recently, that has included exploring how AI-assisted
        development can make me faster and more effective{" "}
        <strong className="font-semibold text-foreground">
          without replacing the judgment and understanding that good engineering
          still requires.
        </strong>
      </>
    ),
  },
];

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
      <main id="main-content">
        <div id="top" className="scroll-mt-24" />
        <section className="py-24">
          <Container className="max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
              Senior Software Engineer · C#/.NET · Backend + Full Stack
            </p>
            <h1 className="font-display text-5xl font-semibold leading-tight text-foreground sm:text-6xl">
              Jessica Haynes
            </h1>
            <p className="mt-4 font-display text-2xl leading-snug text-accent-secondary sm:text-3xl">
              I build reliable software for messy, real-world problems.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              I have 9+ years of experience building and modernizing production
              applications, with deep experience in C#/.NET, APIs, architecture,
              performance, and technical leadership. I use AI as part of a
              disciplined engineering process, from requirements and design
              through implementation, testing, and review.
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
              things a little better than I found them.
            </p>
          </Container>
        </section>

        <section id="about" className="pb-24">
          <Container className="max-w-2xl">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              About Me
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed text-muted">
              <p>
                I&apos;m a Senior Software Engineer with 9+ years of experience
                building and modernizing full-stack enterprise applications,
                with a strong focus on C#/.NET backend development, APIs, Entity
                Framework, performance, and scalable architecture. I&apos;ve
                worked across the full stack — .NET, C#, Entity Framework,
                MySQL, Angular, and TypeScript — while also leading technical
                projects, mentoring engineers, writing technical designs, and
                partnering closely with Product, QA, and DevOps.
              </p>
              <p>
                Some of the problems I&apos;ve enjoyed working on: reducing a
                high-volume background job&apos;s runtime by 95%, improving
                testing and observability to help achieve 6+ months of
                incident-free production, implementing SSO and identity
                integrations, and modernizing applications and development
                practices.
              </p>
              <p>
                I enjoy solving complex engineering problems, improving existing
                systems, and learning new technologies when they&apos;re the
                right tool for the job — including, lately, AI-assisted
                development. I&apos;m still early in that exploration, and
                there&apos;s more to say about it soon.
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
              Whether you&apos;re hiring, collaborating, or just want to talk
              shop — I&apos;d love to hear from you.
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
