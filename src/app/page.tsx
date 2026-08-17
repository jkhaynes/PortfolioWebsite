import Button from "@/components/Button";
import Container from "@/components/Container";
import Nav from "@/components/Nav";
import TextLink from "@/components/TextLink";

const stats = [
  { value: "9+", label: "Years of experience" },
  { value: "95%", label: "Faster nightly job runtime" },
  { value: "81%", label: "Fewer security flaws" },
  { value: "50%", label: "Fewer support escalations" },
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
              >
                Download Resume
              </Button>
              <Button href="mailto:jkhaynes2390@gmail.com" variant="secondary">
                Email Me
              </Button>
              <TextLink href="https://github.com/jkhaynes">GitHub</TextLink>
              <TextLink href="https://linkedin.com/in/jesshaynes">
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
      </main>
    </>
  );
}
