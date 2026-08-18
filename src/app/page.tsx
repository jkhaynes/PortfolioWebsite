import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import Grid from "@/components/Grid";
import Nav from "@/components/Nav";
import ProjectCard from "@/components/ProjectCard";
import Tag from "@/components/Tag";
import TextLink from "@/components/TextLink";

const workPrinciples = [
  {
    label: "Problem-Solving & Collaboration",
    body: (
      <>
        I like understanding the problem I&apos;m solving, asking questions
        when something doesn&apos;t make sense, and working with the people
        around me to find a good solution. I tend to notice recurring
        problems and areas of friction, and I care about{" "}
        <strong className="font-semibold text-foreground">
          fixing what I can rather than simply getting used to the
          workaround.
        </strong>
      </>
    ),
  },
  {
    label: "Staying Current",
    body: (
      <>
        I also think staying current is an important part of being a
        software engineer. I enjoy learning new technologies, reevaluating
        the way I work, and finding practical ways to incorporate better
        tools and approaches. More recently, that has included exploring
        how AI-assisted development can make me faster and more effective{" "}
        <strong className="font-semibold text-foreground">
          without replacing the judgment and understanding that good
          engineering still requires.
        </strong>
      </>
    ),
  },
];

const exploringTags = ["Retrieval-Augmented Generation", "Embeddings", "Structured Outputs", "Grounding", "Evaluation"];

const stats = [
  { value: "9+", label: "Years of experience" },
  { value: "95%", label: "Faster nightly job runtime" },
  { value: "81%", label: "Fewer security flaws" },
  { value: "50%", label: "Fewer support escalations" },
];

const experience = [
  {
    role: "Senior Software Developer (Team Lead)",
    company: "8am",
    period: "Mar 2022 – Present",
    location: "Austin, TX / Remote",
    bullets: [
      "Led a cross-functional team of 4, driving a quality-focused culture shift that achieved 6+ months of incident-free production and a 50% drop in support escalations",
      "Optimized a high-volume nightly job, cutting runtime by 95%",
      "Spearheaded the team's adoption of agentic AI coding tools (Claude Code, GitHub Copilot), improving engineering efficiency and TDD adoption",
    ],
    tags: [".NET", "C#", "MySQL", "Entity Framework", "Angular"],
  },
  {
    role: "Lead Developer",
    company: "Proplanner.net",
    period: "Jan 2020 – Mar 2022",
    location: "Ames, IA",
    bullets: [
      "Designed and supported an Identity and Access Management service, configuring SAML/OIDC connections for all clients",
      "Led a team that reduced security vulnerabilities by 81% across all applications",
    ],
    tags: ["C#", ".NET Core", "SAML", "OIDC"],
  },
  {
    role: "Senior Software Engineer (Team Lead)",
    company: "Growers Edge",
    period: "Feb 2019 – Jan 2020",
    location: "West Des Moines, IA",
    bullets: [
      "Served as technical lead across multiple projects, owning design and delivery",
      "Trained and mentored junior engineers; built and deployed applications on Azure",
    ],
    tags: [".NET Core", "Angular 7", "Azure"],
  },
  {
    role: "Senior Software Developer",
    company: "Proplanner.net",
    period: "Dec 2017 – Feb 2019",
    location: "Ames, IA",
    bullets: [
      "Increased the client base by 200% by leading a platform modernization initiative",
    ],
    tags: ["ASP.NET Web API", "Angular 4+"],
  },
  {
    role: "Programmer",
    company: "Proplanner.net",
    period: "May 2016 – Dec 2017",
    location: "Ames, IA",
    bullets: [
      "Developed and tested features for a .NET Windows desktop application; resolved critical issues with rapid turnaround",
    ],
    tags: [".NET"],
  },
];

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <section className="py-24">
          <Container className="max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
              Senior Software Engineer · C#/.NET · Backend + Full Stack
            </p>
            <h1 className="font-display text-5xl font-semibold leading-tight text-foreground sm:text-6xl">
              Jessica Haynes
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              I build and modernize full-stack enterprise applications — with
              9+ years focused on C#/.NET backend development, APIs, and
              scalable architecture. Lately, I&apos;m expanding into
              AI-assisted development, exploring how it can make good
              engineering practices even stronger.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button
                href="/Jessica-Haynes-Resume.pdf"
                variant="primary"
                target="_blank"
                rel="noopener noreferrer"
                trackEvent="resume_download"
              >
                Download Resume
              </Button>
              <Button
                href="mailto:jkhaynes2390@gmail.com"
                variant="secondary"
                trackEvent="email_click"
              >
                Email Me
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

        <section className="pb-24">
          <Container>
            <h2 className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Impact &amp; Highlights
            </h2>
            <div className="grid grid-cols-2 gap-6 border-y border-border py-10 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-3xl font-semibold text-accent sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="pb-24">
          <Container className="max-w-2xl">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              About Me
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed text-muted">
              <p>
                I&apos;m a Senior Software Engineer with 9+ years of
                experience building and modernizing full-stack enterprise
                applications, with a strong focus on C#/.NET backend
                development, APIs, Entity Framework, performance, and
                scalable architecture. I&apos;ve worked across the full
                stack — .NET, C#, Entity Framework, MySQL, Angular, and
                TypeScript — while also leading technical projects,
                mentoring engineers, writing technical designs, and
                partnering closely with Product, QA, and DevOps.
              </p>
              <p>
                Some of the problems I&apos;ve enjoyed working on: reducing
                a high-volume background job&apos;s runtime by 95%,
                improving testing and observability to help achieve 6+
                months of incident-free production, implementing SSO and
                identity integrations, and modernizing applications and
                development practices.
              </p>
              <p>
                I enjoy solving complex engineering problems, improving
                existing systems, and learning new technologies when
                they&apos;re the right tool for the job — including,
                lately, AI-assisted development. I&apos;m still early in
                that exploration, and there&apos;s more to say about it
                soon.
              </p>
            </div>
          </Container>
        </section>

        <section id="projects" className="pb-24">
          <Container>
            <h2 className="mb-10 text-center font-display text-2xl font-semibold text-foreground">
              Featured Projects
            </h2>
            <Grid>
              <ProjectCard
                title="PokéJudge AI"
                description="An AI-powered decision-support tool for Pokémon TCG tournament judges, built as a hands-on AI engineering project. A judge describes a rules or game-state situation in natural language; the system asks clarifying questions if needed, retrieves the relevant authoritative rules passages, and returns a cited recommendation — rating how strongly the source material actually supports it rather than presenting an unvalidated confidence score. Built in C#/ASP.NET Core, introducing each AI capability (LLM calls, structured output, retrieval-augmented generation, evaluation) only as the product needed it."
                tags={[
                  "C#",
                  "ASP.NET Core",
                  "RAG / Retrieval",
                  "LLM Integration",
                  "Structured Output",
                ]}
                githubUrl="https://github.com/jkhaynes/PokeJudge"
              />
              <div className="flex h-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border p-6 text-center">
                <p className="font-display text-lg font-semibold text-muted">
                  More projects coming soon
                </p>
                <p className="mt-2 text-sm text-muted">
                  I&apos;m actively working on the next one.
                </p>
              </div>
            </Grid>
          </Container>
        </section>

        <section className="pb-24">
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

        <section id="experience" className="pb-24">
          <Container className="max-w-3xl">
            <h2 className="mb-10 font-display text-2xl font-semibold text-foreground">
              Experience
            </h2>
            <div className="space-y-10">
              {experience.map((job) => (
                <div
                  key={`${job.role}-${job.company}`}
                  className="border-t border-border pt-8 first:border-t-0 first:pt-0"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {job.role}, {job.company}
                    </h3>
                    <p className="text-sm text-muted">{job.period}</p>
                  </div>
                  <p className="text-sm text-muted">{job.location}</p>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
                    {job.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="pb-24">
          <Container className="max-w-3xl">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Currently Exploring
            </h2>
            <p className="mt-4 max-w-2xl font-display text-xl leading-snug text-foreground">
              Lately, I&apos;ve been especially interested in what happens
              when AI moves beyond a demo and becomes part of a real
              software system.
            </p>

            <div className="mt-8 rounded-3xl border border-accent-secondary/30 bg-accent-soft/50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                Building: PokéJudge
              </p>
              <p className="mt-3 leading-relaxed text-muted">
                A C#/.NET project inspired by my experience as a Pokémon
                TCG Judge. It gives me a practical way to explore
                retrieval-augmented generation, embeddings, structured LLM
                outputs, grounding, evaluation, and the challenges of
                building AI systems that know when they have enough
                information to answer reliably.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {exploringTags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
              <TextLink
                href="#projects"
                target="_self"
                className="mt-4 inline-block"
              >
                See it in Featured Projects →
              </TextLink>
            </div>

            <p className="mt-6 leading-relaxed text-muted">
              I&apos;m also continuing to grow my frontend skills with
              React and TypeScript and experimenting with AI-assisted
              development workflows that make me a more effective
              engineer.
            </p>

            <p className="mt-10 text-center font-display text-lg text-accent-secondary">
              I&apos;m most interested in learning through real problems,
              building things I care about, and understanding the
              technology well enough to use it thoughtfully.
            </p>
          </Container>
        </section>

        <section id="contact" className="pb-24">
          <Container className="max-w-2xl text-center">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Let&apos;s Connect
            </h2>
            <p className="mt-3 text-muted">
              Whether you&apos;re hiring, collaborating, or just want to
              talk shop — I&apos;d love to hear from you.
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
                href="/Jessica-Haynes-Resume.pdf"
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
