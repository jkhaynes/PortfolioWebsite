import type { Metadata } from "next";
import Image from "next/image";
import Button from "@/components/Button";
import Container from "@/components/Container";
import Nav from "@/components/Nav";
import Tag from "@/components/Tag";
import TextLink from "@/components/TextLink";
import { lootSinglesProject } from "@/data/projects";
import lootOrderDetail from "../../../../public/work/loot-singles/order-detail-desktop-catalog-cards.png";

export const metadata: Metadata = {
  title: "Loot Singles Fulfillment Case Study | Jessica Haynes",
  description:
    "How Jessica Haynes is designing and engineering a safer, scalable picking workflow for Loot Card Shop's trading-card singles orders.",
};

const context = [
  {
    value: "20–200",
    label: "orders on a normal day",
    note: "Current operating context",
  },
  {
    value: "≈1,000",
    label: "orders per day",
    note: "Growth target",
  },
  {
    value: "4–5",
    label: "simultaneous pickers",
    note: "Intended scale",
  },
];

const productDecisions = [
  {
    number: "01",
    title: "Make high-risk information impossible to miss",
    body: (
      <>
        Quantity greater than one is a common source of mistakes. Instead of a
        small quantity label, the guided UI will use a prominent instruction
        such as <strong className="text-foreground">PULL 4 COPIES</strong> and
        require explicit acknowledgement. Variant, set, and card identity follow
        in the visual hierarchy, using both color and non-color cues.
      </>
    ),
  },
  {
    number: "02",
    title: "Design for the exception, not only the happy path",
    body: (
      <>
        A picker should never have to falsely mark a card as found just to
        continue. Structured issues move blocked orders to Needs Attention,
        where another experienced employee can take over without losing the
        original issue or completed progress.
      </>
    ),
  },
  {
    number: "03",
    title: "No image is better than the wrong image",
    body: (
      <>
        TCGplayer order data remains authoritative. An image appears only when
        catalog enrichment confidently identifies the exact card and printing;
        an ambiguous match produces no image rather than a misleading guess.
      </>
    ),
  },
];

const completedFoundations = [
  "PDF import",
  "Employee authentication and roles",
  "Responsive order views",
  "Card-image enrichment",
  "Exclusive claiming",
  "Release and manager force-release",
  "Employee administration",
];

const nextSteps = [
  "One-card-at-a-time picking and set transitions",
  "Multi-quantity acknowledgement and progress tracking",
  "Issue reporting and Needs Attention",
  "Takeover, resumption, and completion validation",
  "An in-store pilot and feedback-driven refinement",
];

function SectionHeading({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-foreground">
        {children}
      </h2>
    </div>
  );
}

function FlowStep({
  label,
  detail,
  accent = false,
}: {
  label: string;
  detail: string;
  accent?: boolean;
}) {
  return (
    <li
      className={`rounded-2xl border p-4 ${
        accent ? "border-accent bg-accent-soft/50" : "border-border bg-surface"
      }`}
    >
      <p className="font-display text-lg font-semibold text-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{detail}</p>
    </li>
  );
}

export default function LootSinglesCaseStudy() {
  return (
    <>
      <Nav />
      <main id="top" className="pb-24">
        <Container>
          <div className="pt-10">
            <TextLink href="/#projects" target="_self">
              ← Back to featured projects
            </TextLink>
          </div>

          <header className="grid gap-10 py-14 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                Product Case Study
              </p>
              <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[1.05] text-foreground sm:text-6xl">
                {lootSinglesProject.title}
              </h1>
              <p className="mt-5 max-w-2xl font-display text-2xl leading-snug text-accent-secondary">
                Designing a safer, scalable picking workflow for a growing
                trading card shop
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-accent">
                  {lootSinglesProject.status}
                </span>
                <span className="text-sm text-muted">
                  Sole developer and product designer
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {lootSinglesProject.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              {lootSinglesProject.githubUrl && (
                <Button href={lootSinglesProject.githubUrl} variant="primary">
                  View GitHub
                </Button>
              )}
              <Button href="/#projects" variant="secondary">
                Back to Projects
              </Button>
            </div>
          </header>

          <section aria-labelledby="context-heading" className="pb-24">
            <h2 id="context-heading" className="sr-only">
              Project context at a glance
            </h2>
            <dl className="grid gap-4 sm:grid-cols-3">
              {context.map((item) => (
                <div
                  key={item.value}
                  className="rounded-3xl border border-border bg-surface p-6 shadow-soft"
                >
                  <dt className="text-sm text-muted">{item.label}</dt>
                  <dd className="mt-2 font-display text-4xl font-semibold text-accent">
                    {item.value}
                  </dd>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                    {item.note}
                  </p>
                </div>
              ))}
            </dl>
          </section>

          <section className="grid gap-12 pb-24 md:grid-cols-2 md:gap-16">
            <div>
              <SectionHeading eyebrow="01 · Context">
                The problem
              </SectionHeading>
              <div className="mt-5 space-y-4 leading-relaxed text-muted">
                <p>
                  Loot Card Shop currently fulfills roughly 20–200 TCGplayer
                  singles orders on a normal day. Employees work from printed
                  invoices, and one person generally carries each order through
                  the entire picking process.
                </p>
                <p>
                  Paper works at the current scale, but it is not designed for
                  the physical task of finding cards. Quantity, set, condition,
                  and variant can be easy to overlook while moving between
                  invoices and storage boxes.
                </p>
                <p>
                  As the shop works toward approximately 1,000 orders per day
                  with four or five simultaneous pickers, clear ownership and
                  exception handling become increasingly important.
                </p>
              </div>
            </div>
            <div>
              <SectionHeading eyebrow="02 · Product">
                The product
              </SectionHeading>
              <div className="mt-5 space-y-4 leading-relaxed text-muted">
                <p>
                  Loot Singles Fulfillment replaces the printed invoice during
                  picking with a responsive digital workflow. Employees sign in
                  individually, see available work, and either choose an order
                  or ask the system to assign the next one.
                </p>
                <p>
                  Once work begins, the order is exclusively claimed so another
                  employee cannot start it accidentally. Cards are grouped by
                  set to follow the shop&apos;s physical workflow, and the
                  details most likely to prevent an error receive the strongest
                  visual emphasis.
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="workflow-heading" className="pb-24">
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft sm:p-8">
              <SectionHeading eyebrow="Planned V1 flow">
                A guided path with an honest exception route
              </SectionHeading>
              <p className="mt-4 max-w-3xl leading-relaxed text-muted">
                Guided picking is the next phase of work. This diagram describes
                the intended V1 flow, not functionality already in production.
              </p>
              <ol
                id="workflow-heading"
                aria-label="Planned V1 picking workflow"
                className="mt-8 grid gap-3 md:grid-cols-4"
              >
                <FlowStep
                  label="Available work"
                  detail="Choose an order or request the next one."
                />
                <FlowStep
                  label="Claim order"
                  detail="The server grants one employee exclusive ownership."
                />
                <FlowStep
                  label="Guided picking"
                  detail="Move through set-aware, one-card-at-a-time tasks."
                  accent
                />
                <FlowStep
                  label="Pick complete"
                  detail="Validate progress before completing the pick."
                />
              </ol>
              <div className="mt-4 grid gap-3 border-l-2 border-dashed border-accent pl-4 md:ml-[50%] md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-accent">
                    Exception path
                  </p>
                  <p className="mt-2 font-display text-lg font-semibold text-foreground">
                    Needs Attention
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Record the issue without pretending the card was found.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-background p-4">
                  <p className="font-display text-lg font-semibold text-foreground">
                    Take over and resume
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Preserve the issue and completed progress for the next
                    picker.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="decisions-heading" className="pb-24">
            <SectionHeading eyebrow="03 · Product decisions">
              <span id="decisions-heading">
                Designing around real picking risk
              </span>
            </SectionHeading>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {productDecisions.map((decision) => (
                <article
                  key={decision.number}
                  className="rounded-3xl border border-border bg-surface p-6 shadow-soft"
                >
                  <p className="font-display text-3xl font-semibold text-accent-soft">
                    {decision.number}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-foreground">
                    {decision.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {decision.body}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="screenshot-heading" className="pb-24">
            <SectionHeading eyebrow="Implemented foundation">
              <span id="screenshot-heading">
                An order view built around error-preventing details
              </span>
            </SectionHeading>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted">
              This development view uses the project&apos;s sample-order data
              and card-catalog images. It keeps order ownership visible and
              makes set, quantity, variant, condition, and card identity easy to
              scan.
            </p>
            <figure className="mt-8">
              <div className="overflow-hidden rounded-3xl border border-border bg-surface p-2 shadow-soft sm:p-4">
                <Image
                  src={lootOrderDetail}
                  alt="Loot Singles order detail screen showing sample-order cards Lightning Bolt, Pikachu, and John Silver with their catalog images, sets, conditions, variants, and quantities visible."
                  sizes="(min-width: 1080px) 1048px, calc(100vw - 2rem)"
                  className="h-auto w-full rounded-2xl border border-border"
                />
              </div>
              <figcaption className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <p className="rounded-2xl bg-accent-soft px-4 py-3 text-foreground">
                  <strong>Exclusive claim:</strong> ownership stays visible
                  while the order is in progress.
                </p>
                <p className="rounded-2xl bg-accent-soft px-4 py-3 text-foreground">
                  <strong>Set context:</strong> every product keeps its set
                  visible for the picker.
                </p>
                <p className="rounded-2xl bg-accent-soft px-4 py-3 text-foreground">
                  <strong>High-risk details:</strong> quantity, printing, and
                  condition are surfaced together.
                </p>
              </figcaption>
            </figure>
          </section>

          <section aria-labelledby="engineering-heading" className="pb-24">
            <SectionHeading eyebrow="04 · Engineering">
              <span id="engineering-heading">Safety enforced below the UI</span>
            </SectionHeading>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <article className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-accent">
                  Concurrency-safe claiming
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">
                  Two pickers cannot both win
                </h3>
                <p className="mt-4 leading-relaxed text-muted">
                  I implemented claiming as a server-enforced business rule. A
                  conditional atomic database update succeeds only while an
                  order is unclaimed, so two employees racing for the same work
                  cannot both acquire it.
                </p>
                <p className="mt-3 leading-relaxed text-muted">
                  Pick Next Order retries with another eligible order after a
                  lost race, while a filtered unique index independently stops
                  one employee from holding multiple active claims.
                </p>
              </article>
              <article className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-accent">
                  Defensive, replaceable import
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">
                  Treat the PDF as an imperfect boundary
                </h3>
                <p className="mt-4 leading-relaxed text-muted">
                  The application defensively parses TCGplayer packing-slip PDFs
                  behind an isolated import boundary that can later be replaced
                  by a supported API. It handles multi-order and multi-page
                  files, rejects orders it cannot reconstruct confidently, and
                  saves each valid order atomically.
                </p>
                <p className="mt-3 leading-relaxed text-muted">
                  The importer retains the original product description for
                  traceability, but excludes shipping information, pricing, and
                  the source PDF. Condition and variant remain separate.
                </p>
              </article>
            </div>
          </section>

          <section className="grid gap-10 pb-24 lg:grid-cols-2 lg:gap-12">
            <div>
              <SectionHeading eyebrow="05 · Ownership">
                My role and process
              </SectionHeading>
              <div className="mt-5 space-y-4 leading-relaxed text-muted">
                <p>
                  I am the sole developer and product designer, working with
                  Loot Card Shop&apos;s owners as subject-matter experts. I
                  translate their operational knowledge into requirements,
                  interaction design, architecture, and implementation
                  decisions.
                </p>
                <p>
                  I use an AI-assisted, specification-driven workflow while
                  retaining ownership of the product and engineering judgment.
                  Features move through clarification, technical planning,
                  Red/Green/Refactor TDD, implementation review, and
                  verification against the approved specification.
                </p>
                <p>
                  The test suite includes unit, integration, frontend,
                  Playwright end-to-end, and real SQL Server concurrency tests.
                </p>
              </div>
            </div>
            <div>
              <SectionHeading eyebrow="06 · Status">
                Current state and what&apos;s next
              </SectionHeading>
              <p className="mt-5 leading-relaxed text-muted">
                The application currently runs locally and has not yet been used
                for live fulfillment.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-border bg-surface p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-accent">
                    Completed foundations
                  </h3>
                  <ul className="mt-4 space-y-2 text-sm text-muted">
                    {completedFoundations.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span aria-hidden="true" className="text-accent">
                          ✓
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl border border-accent/30 bg-accent-soft/40 p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-accent">
                    Next
                  </h3>
                  <ul className="mt-4 space-y-2 text-sm text-muted">
                    {nextSteps.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span aria-hidden="true" className="text-accent">
                          ○
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-accent-soft/45 p-7 shadow-soft sm:p-10">
            <SectionHeading eyebrow="Deliberate V1 boundary">
              V1 stops at Pick Complete
            </SectionHeading>
            <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-3xl space-y-4 leading-relaxed text-muted">
                <p>
                  A future V2 would create a verified handoff into packing. The
                  picker would place a barcode or QR identifier with the
                  physical order, and the packer would scan it to open the
                  correct digital record before independently verifying cards,
                  variants, conditions, and quantities.
                </p>
                <p>
                  The V1 model for employee identity, status, issues, and
                  authoritative order-line data is designed to support that
                  extension without bringing packing complexity into the first
                  release.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {lootSinglesProject.githubUrl && (
                  <Button href={lootSinglesProject.githubUrl} variant="primary">
                    View GitHub
                  </Button>
                )}
                <Button href="/#projects" variant="secondary">
                  Back to Projects
                </Button>
              </div>
            </div>
          </section>
        </Container>
      </main>
    </>
  );
}
