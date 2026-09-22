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
import { pricewatchProject } from "@/data/projects";
import statusPage from "../../../../public/work/pricewatch/status-page.png";

const title = "pricewatch Case Study | Jessica Haynes";
const description =
  "How Jessica Haynes built a Go CLI that prices an 8,800-card Pokémon collection on a free budget of 1,000 API requests a day.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/work/pricewatch" },
  openGraph: {
    title,
    description,
    url: "/work/pricewatch",
    siteName: "Jessica Haynes",
    type: "article",
  },
  twitter: { card: "summary_large_image", title, description },
};

const pipeline = [
  [
    "1",
    "Resolve",
    "Match each CSV row to one card by region, set, number, variant and language.",
  ],
  ["2", "Pick due cards", "Never priced first, then most overdue, then most valuable."],
  ["3", "Pace", "Spend against the API's own remaining count, pause at the hour limit."],
  ["4", "Price", "A bounded worker pool. One request prices every variant of a card."],
  ["5", "Save + report", "One observation per card, plus every card that moved."],
  ["6", "Publish", "Rebuild the public status page from derived numbers only."],
] as const;

const tiers = [
  ["$100+", "1 day"],
  ["$20 to $100", "2 days"],
  ["$5 to $20", "4 days"],
  ["Under $5", "7 days"],
] as const;

const fromCSharp = [
  {
    title: "Errors as values",
    go: "if err != nil",
    cs: "throw / catch",
    body: "Repetitive, but failure is in the signature and every caller has to acknowledge it. I wouldn't swap back, though I'd take a shorter syntax.",
  },
  {
    title: "Context vs CancellationToken",
    go: "context.Context",
    cs: "CancellationToken",
    body: "Cancellation and deadline travel together, which made the three lifetimes in shutdown easy to keep apart.",
  },
  {
    title: "Goroutines and select",
    go: "go + select",
    cs: "async / Task.WhenAny",
    body: "No async coloring up the call chain. One select reads as “send the job, or stop.”",
  },
  {
    title: "Interfaces declared by the consumer",
    go: "implicit",
    cs: ": IStore + DI",
    body: "Great at this size. For a bigger domain I'd still want C#'s explicit contracts and a container.",
  },
] as const;

const built = [
  "Collection import with reported, never guessed, matches",
  "Bounded, resumable pricing runs with a worker pool",
  "Value tiers and due-card scheduling",
  "Hourly GitHub Actions runs against a private data repo",
  "Public status page rebuilt every run",
  "Offline tests with a fake clock for the worker pool",
];

const planned = [
  "Special prints now reported as unsupported: ball and Energy reverse holos, Cosmos, Prize Pack, stamps and promos (about 9% of the collection)",
  "Rows the import reports as unmatched or ambiguous",
];

export default function PricewatchCaseStudy() {
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
            project={pricewatchProject}
            kicker="Go systems case study"
            summary="A Go CLI that prices an 8,800-card Pokémon collection on a free budget of 1,000 API requests a day, and never guesses which print a card is."
            role="Sole developer"
            status="Live · runs hourly on GitHub Actions"
            stack="Go, SQLite, GitHub Actions, PokéWallet API"
            actions={
              <>
                <Button
                  href={pricewatchProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View GitHub
                </Button>
                <Button
                  href={pricewatchProject.demoUrl}
                  variant="secondary"
                  target="_blank"
                  rel="noreferrer"
                >
                  Live status page
                </Button>
                <TextLink
                  href="#pipeline"
                  target="_self"
                  className="self-center px-2"
                >
                  See the pipeline ↓
                </TextLink>
              </>
            }
            art={
              <figure
                aria-label="pricewatch run output"
                className="min-w-0 overflow-x-auto rounded-[2rem] border border-foreground/15 bg-product-ink p-6 font-mono text-sm leading-relaxed text-white shadow-product sm:p-8"
              >
                <div className="flex gap-2" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-risk" />
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-soft" />
                  <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                </div>
                <pre className="mt-7 whitespace-pre font-mono">
                  <span className="text-white/60">
                    $ pricewatch run --budget 100 --no-wait
                  </span>
                  {"\n"}
                  <span className="text-console-accent">run 3 (pokewallet)</span>
                  {"\n38 requests, 52 cards\n"}
                  <span className="font-semibold text-emerald-300">ok 50</span>
                  {"  failed 2  deferred 0\n"}
                  <span className="text-white/60">4886 cards not due yet</span>
                  {"\n\n"}
                  <span className="text-console-accent">
                    changed since each card&apos;s last price
                  </span>
                  {"\n"}
                  <span className="text-white/60">
                    {" BEFORE    NOW   DELTA      %"}
                  </span>
                  {"\n  50.47  60.00   +9.53  +18.9\n"}
                  <span className="text-white/60">
                    {"  ex ruby & sapphire 59/109 reverse holo"}
                  </span>
                  {"\n\n"}
                  <span className="font-semibold text-emerald-300">
                    progress saved · next run resumes here
                  </span>
                </pre>
              </figure>
            }
          />

          <section className="grid gap-12 border-t border-border py-16 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHeading label="Why I built it" id="motivation-heading">
                Learning Go on a problem with real limits
              </SectionHeading>
              <p className="mt-5 leading-relaxed text-muted">
                After nine years of C# backend work, I wanted to learn Go on
                something that would push back. My own collection, 8,800 rows
                exported from TCG Collector, gave me a real product with a hard
                constraint. Where two designs worked, I picked the one that
                exercised more Go.
              </p>
            </div>
            <div>
              <SectionHeading label="The problem" id="problem-heading">
                8,800 cards, 1,000 requests a day
              </SectionHeading>
              <p className="mt-5 leading-relaxed text-muted">
                The free price API allows 100 requests an hour and 1,000 a day.
                The collection can&apos;t be priced in one go, so pricewatch
                never tries. Each run is a bounded slice of work, and progress
                lives in SQLite so the next run carries on where the last one
                stopped.
              </p>
            </div>
          </section>

          <section
            id="pipeline"
            aria-labelledby="pipeline-heading"
            className="scroll-mt-24 rounded-[2rem] border border-border bg-background p-6 shadow-soft sm:p-10"
          >
            <div className="flex flex-wrap items-start justify-between gap-5">
              <SectionHeading label="How a run works" id="pipeline-heading">
                Bounded slices, durable progress
              </SectionHeading>
              <StateLabel label="Built" tone="done" />
            </div>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted">
              Import resolves the collection once. Every hour after that, a run
              picks the cards that are due, prices them within the rate limits,
              saves each observation and republishes the status page.
            </p>
            <ol
              aria-label="pricewatch run pipeline"
              className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4"
            >
              {pipeline.map(([step, label, detail]) => (
                <FlowStep
                  key={step}
                  step={step}
                  label={label}
                  detail={detail}
                  accent={step === "2" || step === "3"}
                />
              ))}
            </ol>
            <div className="mt-8 border-l-2 border-dashed border-risk bg-risk-soft px-5 py-4 text-sm leading-relaxed text-risk-strong lg:max-w-[43%]">
              <p className="font-semibold">Hourly loop ↶</p>
              <p className="mt-1">
                GitHub Actions runs at seven past each hour. A missed hour just
                means the next run has a little more to do.
              </p>
            </div>
          </section>

          <section aria-labelledby="tiers-heading" className="py-20">
            <SectionHeading label="Value tiers" id="tiers-heading">
              Spend requests where the money is
            </SectionHeading>
            <p className="mt-5 max-w-3xl leading-relaxed text-muted">
              A card&apos;s value sets how often it&apos;s due. Pricier cards
              move more in dollars, so they&apos;re checked more often.
            </p>
            <div className="mt-10 grid items-start gap-12 md:grid-cols-[1.1fr_0.9fr]">
              <table className="w-full border-collapse tabular-nums">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                    <th scope="col" className="py-2">
                      Card value
                    </th>
                    <th scope="col" className="py-2 text-right">
                      Checked every
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tiers.map(([value, every]) => (
                    <tr key={value} className="border-b border-border">
                      <td className="py-3">{value}</td>
                      <td className="py-3 text-right">{every}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <p className="text-sm font-semibold text-accent">Daily budget</p>
                <p className="mt-3 font-display text-5xl font-semibold text-accent">
                  ~915
                  <span className="text-xl text-muted"> / 1,000</span>
                </p>
                <p className="mt-2 text-muted">
                  requests a day to keep about 4,900 priceable cards on
                  schedule.
                </p>
                <div
                  role="img"
                  aria-label="915 of 1,000 daily requests used"
                  className="mt-5 h-3.5 overflow-hidden rounded-full bg-accent-soft"
                >
                  <div className="h-full w-[91.5%] rounded-full bg-accent" />
                </div>
                <div className="mt-1.5 flex justify-between text-xs tabular-nums text-muted">
                  <span>0</span>
                  <span>1,000</span>
                </div>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="guess-heading"
            className="border-y border-border py-16"
          >
            <SectionHeading label="What it refuses to guess" id="guess-heading">
              A wrong match fails silently
            </SectionHeading>
            <div className="mt-8 border-l-4 border-risk bg-risk-soft px-6 py-7 sm:px-10">
              <p className="max-w-3xl leading-relaxed text-foreground">
                The export has no card IDs. When a row can&apos;t be matched to
                exactly one card, pricewatch reports it instead of picking one.
                On chase cards, the gap between prints dwarfs any price
                movement.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Print print="Tropius 001/084 · Normal" price="$0.06" />
                <Print print="Tropius 001/084 · Reverse Holo" price="$0.20" />
              </div>
            </div>
            <div className="mt-10">
              <CaseStudyMedia
                src={statusPage}
                alt="The live pricewatch status page: price index, biggest movers, the schedule of every card and the request budget."
                title="pricewatch status page"
                caption="Rebuilt from the database after every hourly run"
                context="Live status page"
                sizes="(min-width: 1080px) 1048px, calc(100vw - 2rem)"
                aspectClassName="aspect-[16/15]"
                objectClassName="object-contain"
              />
            </div>
          </section>

          <section aria-labelledby="decisions-heading" className="py-20">
            <SectionHeading
              label="Engineering decisions"
              id="decisions-heading"
            >
              Safe to stop, safe to re-run
            </SectionHeading>
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              <Decision title="Two-stage Ctrl-C">
                The first press stops new cards and lets in-flight ones finish.
                The second cancels them. Completed work is saved either way,
                using{" "}
                <code className="font-mono text-sm">context.WithoutCancel</code>{" "}
                so the checkpoint outlives the cancel.
              </Decision>
              <Decision title="Pace against the source's count">
                The daily count lives in SQLite and is corrected from response
                headers, so a restart can&apos;t overspend. A &ldquo;too many
                requests&rdquo; answer is read, waited out, and the run carries
                on.
              </Decision>
              <Decision title="Standard library first">
                Two third-party packages: pure-Go SQLite and a rate limiter.
                CSV, HTTP, JSON, logging, embedded templates and fake-clock
                tests all come from the standard library.
              </Decision>
            </div>
          </section>

          <section
            aria-labelledby="csharp-heading"
            className="border-t border-border py-16"
          >
            <SectionHeading label="Coming from C#" id="csharp-heading">
              What surprised me after nine years of .NET
            </SectionHeading>
            <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2">
              {fromCSharp.map(({ title, go, cs, body }) => (
                <article key={title} className="bg-surface p-6">
                  <h3 className="font-display text-xl font-semibold">
                    {title}
                  </h3>
                  <p className="mt-3 flex flex-wrap gap-2 font-mono text-xs">
                    <span className="rounded-md bg-accent-soft px-2 py-0.5 text-accent">
                      {go}
                    </span>
                    <span className="rounded-md bg-risk-soft px-2 py-0.5 text-risk-strong">
                      {cs}
                    </span>
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-14 border-t border-border py-20 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHeading label="Current state" id="current-heading">
                Phases 1 to 3 complete
              </SectionHeading>
              <StatusList label="Built" tone="done" items={built} />
            </div>
            <div>
              <SectionHeading label="What’s next" id="next-heading">
                Match the cards it can&apos;t price yet
              </SectionHeading>
              <p className="mt-5 leading-relaxed text-muted">
                The pipeline is done. The remaining work is matching, so more
                of the collection gets a price without guessing.
              </p>
              <StatusList label="Planned next" tone="planned" items={planned} />
            </div>
          </section>

          <section
            aria-labelledby="closing-heading"
            className="border-l-4 border-accent bg-accent-soft px-6 py-8 sm:px-10 sm:py-10"
          >
            <SectionHeading label="Explore the work" id="closing-heading">
              Built to run unattended
            </SectionHeading>
            <div className="mt-8 flex flex-wrap gap-5">
              <TextLink href={pricewatchProject.githubUrl}>View GitHub</TextLink>
              <TextLink href={pricewatchProject.demoUrl}>
                Live status page
              </TextLink>
              <TextLink href="/#projects" target="_self">
                Explore more projects
              </TextLink>
            </div>
          </section>

          <NextInSet current={pricewatchProject} />
        </Container>
      </main>
    </>
  );
}

function Print({ print, price }: { print: string; price: string }) {
  return (
    <div className="min-w-[11rem] rounded-2xl border border-border bg-surface px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-risk-strong">
        {print}
      </p>
      <p className="mt-1 font-display text-3xl font-semibold text-foreground">
        {price}
      </p>
    </div>
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
