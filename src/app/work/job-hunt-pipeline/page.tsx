import type { Metadata } from "next";
import Button from "@/components/Button";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import CaseStudyMedia from "@/components/case-study/CaseStudyMedia";
import NextInSet from "@/components/case-study/NextInSet";
import {
  FlowStep,
  SectionHeading,
  StateLabel,
} from "@/components/case-study/CaseStudyPrimitives";
import Container from "@/components/Container";
import Nav from "@/components/Nav";
import TextLink from "@/components/TextLink";
import { jobHuntProject } from "@/data/projects";
import digest from "../../../../public/work/job-hunt-pipeline/digest-demo.png";

const title = "Job Hunt Pipeline Case Study | Jessica Haynes";
const description =
  "How Jessica Haynes built a daily AI job search that screens LinkedIn roles against a resume and hard rules, for under 1% of a weekly Claude Max limit per run.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/work/job-hunt-pipeline" },
  openGraph: {
    title,
    description,
    url: "/work/job-hunt-pipeline",
    siteName: "Jessica Haynes",
    type: "article",
  },
  twitter: { card: "summary_large_image", title, description },
};

const run = [
  [
    "1",
    "Collect",
    "New roles from my alert emails and saved searches, minus anything already seen.",
  ],
  [
    "2",
    "Free filters",
    "Title words and companies I'm not interested in, checked in code.",
  ],
  [
    "3",
    "Title check",
    "A small model screens titles 50 at a time and drops clear misses.",
  ],
  [
    "4",
    "Job page",
    "Closed roles and posted pay below my floor are dropped for free.",
  ],
  [
    "5",
    "Score",
    "One Claude call per role scores fit against my resume and reads the facts.",
  ],
  ["6", "Digest", "One email with a card for each role worth a look."],
] as const;

const funnel = [
  {
    label: "Screened",
    note: "new roles found",
    count: 181,
    width: "w-full",
    tone: "bg-accent",
  },
  {
    label: "Surfaced",
    note: "cards in my digest",
    count: 16,
    width: "w-[8.8%]",
    tone: "bg-accent-secondary",
  },
  {
    label: "Applied",
    note: "strong fits",
    count: 7,
    width: "w-[3.9%]",
    tone: "bg-risk",
  },
] as const;

const cardParts = [
  [
    "Fit score and why",
    "Scored against my resume with a rubric that separates learnable gaps from real ones.",
  ],
  [
    "Must-haves checklist",
    "Each stated requirement, marked met, partial, or not met.",
  ],
  ["Day to day", "What the job actually involves, in a sentence or two."],
  [
    "Manager or hands-on",
    "A “Manager” title can be a player-coach role. The card says which, judged from the description.",
  ],
  [
    "The facts",
    "Pay, remote, applicant count, and links to the LinkedIn listing and the company's own posting.",
  ],
] as const;

const findings = [
  {
    title: "Hourly pay read as yearly",
    found: "An $85 an hour contract failed a $175K floor.",
    fix: "Hourly rates are converted to annual before any pay rule runs.",
  },
  {
    title: "Links that looked right but weren't",
    found: "A posting URL the model returned redirected to an error page.",
    fix: "Every link is checked, and a dead one sends the role back for review.",
  },
  {
    title: "Scoring was too harsh",
    found:
      "A strong .NET legal-tech role scored 38 over libraries and a database I hadn't used.",
    fix: "A rubric that treats same-ecosystem tools as minor gaps.",
  },
  {
    title: "Six of thirty, and not the best six",
    found:
      "Only 1 of the 6 jobs in an alert email ranked in the top 50 for that search.",
    fix: "Saved searches are read directly, not just the email.",
  },
  {
    title: "AND and OR aren't enforced",
    found:
      "LinkedIn's public search ranks by keywords but doesn't filter by them.",
    fix: "Depth is a setting, and every real filter runs per role.",
  },
  {
    title: "A copy can leave things out",
    found: "A posting said “Canada only,” but LinkedIn's copy of it didn't.",
    fix: "When the company posts on its own job board, that version is scored.",
  },
] as const;

const built = [
  "Runs every morning on GitHub Actions",
  "Public template with a demo digest and setup guide",
  "Offline self-test with 51 checks",
];

const planned = [
  "Adjust search depth and scoring notes from real digests",
  "Read more company job boards directly",
];

export default function JobHuntPipelineCaseStudy() {
  return (
    <>
      <Nav />
      <main id="main-content" tabIndex={-1} className="pb-24">
        <Container>
          <div id="top" className="scroll-mt-24 pt-8">
            <TextLink href="/#projects" target="_self">
              ← Featured projects
            </TextLink>
          </div>

          <CaseStudyHero
            project={jobHuntProject}
            kicker="AI systems case study"
            summary="A daily AI job search that screens LinkedIn roles against my rules and resume, and emails me only the ones worth a look."
            role="Sole developer"
            status="Live · runs daily on GitHub Actions"
            stack="C#, .NET 10, Claude, GitHub Actions, Gmail API"
            actions={
              <>
                <Button
                  href={jobHuntProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View the template
                </Button>
                <TextLink
                  href="#run"
                  target="_self"
                  className="self-center px-2"
                >
                  See how a run works ↓
                </TextLink>
              </>
            }
            art={
              <CaseStudyMedia
                src={digest}
                alt="A sample daily digest with two role cards showing fit scores, must-haves checklists, and a player-coach tag, on a dark mauve background."
                title="Job Hunt Pipeline digest"
                caption="Sample digest"
                context="Fictional roles"
                priority
                sizes="(min-width: 1024px) 50vw, calc(100vw - 4rem)"
                aspectClassName="aspect-[6/5]"
                objectClassName="object-cover object-top"
              />
            }
          />

          <section className="grid gap-12 border-t border-border py-16 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHeading label="Why I built it" id="motivation-heading">
                Yes, another AI job searcher
              </SectionHeading>
              <p className="mt-5 leading-relaxed text-muted">
                I looked at what was already out there, and none of it fit the
                way I actually like to search. AI has made custom tools like
                this possible in the span of an evening, so I built one that
                works exactly how I want it to.
              </p>
            </div>
            <div>
              <SectionHeading label="The problem" id="problem-heading">
                Six jobs out of thirty
              </SectionHeading>
              <p className="mt-5 leading-relaxed text-muted">
                My LinkedIn alerts said &ldquo;30+ new jobs&rdquo; every day,
                but each email showed six, and they weren&apos;t even the top
                six for my search. The rest meant digging through postings by
                hand, most of them with pay below my floor, onsite, or a stack
                I don&apos;t work in.
              </p>
            </div>
          </section>

          <section
            id="run"
            aria-labelledby="run-heading"
            className="scroll-mt-24 rounded-[2rem] border border-border bg-background p-6 shadow-soft sm:p-10"
          >
            <div className="flex flex-wrap items-start justify-between gap-5">
              <SectionHeading label="How a run works" id="run-heading">
                Cheap checks first, one careful read last
              </SectionHeading>
              <StateLabel label="Built" tone="done" />
            </div>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted">
              Every morning a GitHub Action collects new roles and runs them
              through filters in order of cost. Most are dropped before any AI
              is involved.
            </p>
            <ol
              aria-label="Job Hunt Pipeline run"
              className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4"
            >
              {run.map(([step, label, detail]) => (
                <FlowStep
                  key={step}
                  step={step}
                  label={label}
                  detail={detail}
                  accent={step === "5"}
                />
              ))}
            </ol>
            <div className="mt-8 border-l-2 border-dashed border-risk bg-risk-soft px-5 py-4 text-sm leading-relaxed text-risk-strong lg:max-w-[43%]">
              <p className="font-semibold">It never contacts anyone.</p>
              <p className="mt-1">
                The only email it sends is the digest, to me.
              </p>
            </div>
          </section>

          <section aria-labelledby="funnel-heading" className="py-20">
            <SectionHeading label="The first two days" id="funnel-heading">
              181 roles in, 7 applications out
            </SectionHeading>
            <div
              role="img"
              aria-label="181 roles screened, 16 surfaced, 7 applications"
              className="mt-10 grid gap-5"
            >
              {funnel.map(({ label, note, count, width, tone }) => (
                <div
                  key={label}
                  className="grid grid-cols-[6.5rem_1fr_3.5rem] items-center gap-4 sm:grid-cols-[9rem_1fr_4rem]"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {label}
                    <span className="block text-xs font-normal text-muted">
                      {note}
                    </span>
                  </p>
                  <div className="h-3.5 rounded-full bg-accent-soft">
                    <div
                      className={`h-full min-w-2 rounded-full ${width} ${tone}`}
                    />
                  </div>
                  <p className="text-right font-display text-2xl font-semibold sm:text-3xl tabular-nums text-accent">
                    {count}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted">
              In the first full run, 35 roles were dropped for pay below my
              floor, 17 for not being fully remote, and 9 for companies on my
              exclude list. Most of those were caught before any model call.
            </p>
          </section>

          <section
            aria-labelledby="card-heading"
            className="border-y border-border py-16"
          >
            <SectionHeading label="What a card tells me" id="card-heading">
              Enough to decide in under a minute
            </SectionHeading>
            <div className="mt-10 grid items-start gap-10 md:grid-cols-[0.9fr_1.1fr]">
              <CaseStudyMedia
                src={digest}
                alt="The first two role cards of the sample digest, each with a fit score, day-to-day summary and must-haves checklist."
                title="Job Hunt Pipeline digest card"
                caption="Two cards from the sample digest"
                context="Fictional roles"
                sizes="(min-width: 768px) 45vw, calc(100vw - 2rem)"
                aspectClassName="aspect-[4/5]"
                objectClassName="object-cover object-top"
              />
              <dl className="grid gap-6">
                {cardParts.map(([term, detail]) => (
                  <div key={term}>
                    <dt className="font-display text-xl font-semibold">
                      {term}
                    </dt>
                    <dd className="mt-1 leading-relaxed text-muted">
                      {detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section aria-labelledby="learned-heading" className="py-20">
            <SectionHeading
              label="What the first runs taught me"
              id="learned-heading"
            >
              Real data fixed more than planning did
            </SectionHeading>
            <p className="mt-5 max-w-3xl leading-relaxed text-muted">
              The first digest had nothing useful in it. Each run exposed
              something new.
            </p>
            <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
              {findings.map(({ title, found, fix }) => (
                <article key={title} className="bg-surface p-6">
                  <h3 className="font-display text-xl font-semibold">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {found}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground">
                    <span className="font-semibold text-accent">Fix: </span>
                    {fix}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="decisions-heading"
            className="border-t border-border py-16"
          >
            <SectionHeading label="Technical decisions" id="decisions-heading">
              Built to be cheap, predictable, and reusable
            </SectionHeading>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <Decision title="Order checks by cost">
                Free checks run first, a small model screens titles, and the
                full scoring call only sees roles that could still be a fit.
              </Decision>
              <Decision title="One call per role">
                Scoring and fact extraction happen in the same Claude call, so
                each role costs one read, not two.
              </Decision>
              <Decision title="Budgets and a queue">
                Each run has a usage budget and a time budget. Anything it
                can&apos;t reach waits in a queue for the next run instead of
                being dropped.
              </Decision>
              <Decision title="Everything personal in one file">
                My stack, pay floor, exclusions, and scoring notes live in one
                config file. The code and prompts are generic, which is what
                made the public template possible.
              </Decision>
            </div>
            <div className="mt-10 border-l-4 border-risk bg-risk-soft px-6 py-7 sm:px-10">
              <h3 className="font-display text-2xl font-semibold text-foreground">
                LinkedIn&apos;s public pages, as an opt-in
              </h3>
              <p className="mt-4 max-w-3xl leading-relaxed text-foreground">
                Two optional settings read LinkedIn&apos;s public, logged-out
                pages to drop closed jobs and read a full day of results.
                They&apos;re off by default in the public template, because
                LinkedIn&apos;s terms prohibit automated access. Turning them
                on is each user&apos;s call.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="cost-heading"
            className="border-t border-border py-16"
          >
            <SectionHeading label="Cost" id="cost-heading">
              Runs on the subscription I already have
            </SectionHeading>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <CostFigure figure="Under 1%">
                of my weekly Claude Max limit per daily run, measured before and
                after a full run of 123 roles.
              </CostFigure>
              <CostFigure figure="$4 to $5">
                per daily run at pay-as-you-go API prices, about 3 cents per
                role screened.
              </CostFigure>
            </div>
          </section>

          <section className="grid gap-14 border-t border-border py-20 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHeading label="Current state" id="current-heading">
                Live and in daily use
              </SectionHeading>
              <StatusList label="Live" tone="done" items={built} />
            </div>
            <div>
              <SectionHeading label="What’s next" id="next-heading">
                A few weeks of tuning
              </SectionHeading>
              <StatusList label="Planned next" tone="planned" items={planned} />
            </div>
          </section>

          <section
            aria-labelledby="closing-heading"
            className="border-l-4 border-accent bg-accent-soft px-6 py-8 sm:px-10 sm:py-10"
          >
            <SectionHeading label="Explore the work" id="closing-heading">
              Run your own
            </SectionHeading>
            <p className="mt-5 max-w-3xl leading-relaxed text-foreground">
              The template has everything except my config and resume. Add
              yours, set five secrets, and it runs every morning.
            </p>
            <div className="mt-8 flex flex-wrap gap-5">
              <TextLink href={jobHuntProject.githubUrl}>
                View the template on GitHub
              </TextLink>
              <TextLink href="/#projects" target="_self">
                Explore more projects
              </TextLink>
            </div>
          </section>

          <NextInSet current={jobHuntProject} />
        </Container>
      </main>
    </>
  );
}

function Decision({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article>
      <h3 className="text-pretty font-display text-2xl font-semibold">
        {title}
      </h3>
      <p className="mt-4 leading-relaxed text-muted">{children}</p>
    </article>
  );
}

function CostFigure({
  figure,
  children,
}: {
  figure: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-display text-5xl font-semibold text-accent">
        {figure}
      </p>
      <p className="mt-3 max-w-md leading-relaxed text-muted">{children}</p>
    </div>
  );
}

function StatusList({
  label,
  tone,
  items,
}: {
  label: string;
  tone: "done" | "planned";
  items: string[];
}) {
  return (
    <div className="mt-7">
      <StateLabel label={label} tone={tone} />
      <ul className="mt-4 space-y-2 text-sm text-muted">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span
              aria-hidden="true"
              className={tone === "done" ? "text-accent" : "text-risk"}
            >
              {tone === "done" ? "✓" : "○"}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
