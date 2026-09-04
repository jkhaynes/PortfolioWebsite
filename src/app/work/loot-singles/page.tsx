import type { Metadata } from "next";
import Button from "@/components/Button";
import CaseStudyMedia from "@/components/case-study/CaseStudyMedia";
import {
  FlowStep,
  SectionHeading,
  StateLabel,
} from "@/components/case-study/CaseStudyPrimitives";
import Container from "@/components/Container";
import Nav from "@/components/Nav";
import Tag from "@/components/Tag";
import TextLink from "@/components/TextLink";
import { lootSinglesProject } from "@/data/projects";
import lootDashboard from "../../../../public/work/loot-singles/dashboard-sample-orders.png";
import lootOrderDetail from "../../../../public/work/loot-singles/order-detail-desktop-catalog-cards.png";

export const metadata: Metadata = {
  title: "Loot Singles Fulfillment Case Study | Jessica Haynes",
  description:
    "How Jessica Haynes is designing and engineering a safer, scalable picking workflow for Loot Card Shop's trading-card singles orders.",
};

const decisions = [
  [
    "Make high-risk information impossible to miss",
    <>
      Quantity greater than one is a common source of mistakes. The guided UI
      will use a prominent instruction such as{" "}
      <strong className="text-foreground">PULL 4 COPIES</strong> and require
      explicit acknowledgement. Variant, set, and card identity follow in the
      visual hierarchy.
    </>,
  ],
  [
    "Design for the exception, not only the happy path",
    <>
      A picker should never have to falsely mark a card as found just to
      continue. Structured issues move blocked orders to Needs Attention, where
      another employee can take over without losing the original issue or
      completed progress.
    </>,
  ],
  [
    "No image is better than the wrong image",
    <>
      TCGplayer order data remains authoritative. An image appears only when
      catalog enrichment confidently identifies the exact card and printing; an
      ambiguous match produces no image rather than a misleading guess.
    </>,
  ],
] as const;

const completed = [
  "PDF import",
  "Employee authentication and roles",
  "Responsive order views",
  "Card-image enrichment",
  "Exclusive claiming",
  "Release and manager force-release",
  "Employee administration",
];
const next = [
  "One-card-at-a-time picking and set transitions",
  "Multi-quantity acknowledgement and progress tracking",
  "Issue reporting and Needs Attention",
  "Takeover, resumption, and completion validation",
  "An in-store pilot and feedback-driven refinement",
];

const problemBenefits = [
  {
    title: "Easy-to-miss details",
    body: "Quantity, set, condition, and variant compete with the rest of the invoice while an employee is moving between storage boxes.",
  },
  {
    title: "Invisible ownership",
    body: "A printed invoice cannot enforce who is currently responsible for an order.",
  },
  {
    title: "Dead-end exceptions",
    body: "There is no structured way to report a missing or questionable card while preserving completed work.",
  },
];

const productResponses = [
  {
    title: "Pick-focused hierarchy",
    body: "The interface emphasizes the details most likely to prevent an incorrect pick.",
  },
  {
    title: "Exclusive claiming",
    body: "The server prevents two employees from acquiring the same order.",
  },
  {
    title: "Needs Attention workflow",
    body: "Employees can document an issue and hand off the order without pretending the pick succeeded.",
  },
];

export default function LootSinglesCaseStudy() {
  return (
    <>
      <Nav />
      <main id="main-content" className="pb-24">
        <Container>
          <div id="top" className="scroll-mt-24 pt-8">
            <TextLink href="/#projects" target="_self">
              ← Featured projects
            </TextLink>
          </div>

          <header className="grid gap-10 py-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-14 lg:py-16">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-accent">
                Product case study
              </p>
              <h1 className="mt-4 max-w-3xl text-balance font-display text-5xl font-semibold leading-[1.02] text-foreground sm:text-6xl">
                {lootSinglesProject.title}
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-xl leading-relaxed text-accent-secondary sm:text-2xl">
                A safer picking workflow for a trading-card shop preparing to
                scale beyond paper invoices.
              </p>
              <dl className="mt-7 grid max-w-xl grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <dt className="text-muted">Role</dt>
                  <dd className="mt-1 font-semibold text-foreground">
                    Sole developer & product designer
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Status</dt>
                  <dd className="mt-1 font-semibold text-foreground">
                    {lootSinglesProject.status}
                  </dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-wrap gap-2">
                {lootSinglesProject.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {lootSinglesProject.githubUrl && (
                  <Button href={lootSinglesProject.githubUrl}>
                    View GitHub
                  </Button>
                )}
                <TextLink
                  href="#workflow"
                  target="_self"
                  className="self-center px-2"
                >
                  See the workflow ↓
                </TextLink>
              </div>
            </div>
            <CaseStudyMedia
              src={lootOrderDetail}
              alt="Loot Singles order detail screen showing sample-order cards and their set, condition, variant, and quantity details."
              title="Loot Singles order detail"
              caption="Implemented order-detail foundation"
              context="Sample data"
              priority
              sizes="(min-width: 1024px) 54vw, calc(100vw - 2rem)"
              aspectClassName="aspect-[6/5]"
              objectClassName="object-cover object-left"
            />
          </header>

          <section
            aria-labelledby="context-heading"
            className="grid gap-8 border-t border-border py-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16"
          >
            <div>
              <p className="text-sm font-semibold text-accent">
                Operating context
              </p>
              <h2
                id="context-heading"
                className="mt-2 scroll-mt-24 text-balance font-display text-3xl font-semibold text-foreground"
              >
                From a paper process to coordinated picking
              </h2>
            </div>
            <p className="max-w-3xl text-pretty text-lg leading-relaxed text-muted">
              The shop currently handles roughly{" "}
              <strong className="font-semibold text-foreground">
                20–200 orders on a normal day
              </strong>{" "}
              and is preparing for a workflow that can support{" "}
              <strong className="font-semibold text-foreground">
                4–5 simultaneous pickers
              </strong>{" "}
              as volume grows toward approximately 1,000 orders per day.
            </p>
          </section>

          <section
            aria-labelledby="dashboard-heading"
            className="grid gap-8 border-t border-border py-16 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:gap-16"
          >
            <div>
              <p className="text-sm font-semibold text-accent">
                Implemented coordination
              </p>
              <h2
                id="dashboard-heading"
                className="mt-2 scroll-mt-24 text-balance font-display text-3xl font-semibold text-foreground"
              >
                Available work is visible at a glance
              </h2>
              <p className="mt-5 max-w-[58ch] leading-relaxed text-muted">
                The dashboard gives an authenticated picker a clear starting
                point, shows the current queue, and keeps actions for browsing,
                importing, and employee management together. This capture uses
                controlled sample orders; unavailable workflow states remain
                labeled as such.
              </p>
            </div>
            <CaseStudyMedia
              src={lootDashboard}
              alt="Loot Singles dashboard showing three sample orders ready to pick and navigation for order and employee management."
              title="Loot Singles available-orders dashboard"
              caption="Implemented available-orders dashboard"
              context="Controlled sample data"
              sizes="(min-width: 1024px) 58vw, calc(100vw - 2rem)"
              aspectClassName="aspect-[36/25]"
              objectClassName="object-cover object-top"
            />
          </section>

          <section className="grid gap-14 pb-20 pt-8 md:grid-cols-2 md:gap-16">
            <div>
              <SectionHeading label="The problem" id="problem-heading">
                Paper carries the order, not the task
              </SectionHeading>
              <p className="mt-5 max-w-[68ch] leading-relaxed text-muted">
                Paper records the purchase, but it cannot protect the physical
                work of locating and verifying cards.
              </p>
              <div className="mt-8 space-y-6">
                {problemBenefits.map((item) => (
                  <article key={item.title}>
                    <h3 className="font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 max-w-[62ch] text-sm leading-relaxed text-muted">
                      {item.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
            <div>
              <SectionHeading label="The response" id="product-heading">
                Guide the picker and protect the order
              </SectionHeading>
              <p className="mt-5 max-w-[68ch] leading-relaxed text-muted">
                Loot Singles Fulfillment replaces the invoice during picking
                with safeguards matched to those risks.
              </p>
              <div className="mt-8 space-y-6">
                {productResponses.map((item) => (
                  <article key={item.title}>
                    <h3 className="font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 max-w-[62ch] text-sm leading-relaxed text-muted">
                      {item.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section
            id="workflow"
            aria-labelledby="workflow-heading"
            className="scroll-mt-24 rounded-[2rem] border border-border bg-background p-6 shadow-soft sm:p-10"
          >
            <div className="flex flex-wrap items-start justify-between gap-5">
              <SectionHeading label="Planned V1 workflow" id="workflow-heading">
                The exception path is part of the path
              </SectionHeading>
              <StateLabel label="Planned V1" tone="planned" />
            </div>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted">
              Guided picking is the next phase of work. The branch below is
              intentional: an employee can report a problem without falsely
              marking a card as found.
            </p>
            <ol
              aria-label="Planned V1 picking workflow"
              className="mt-10 grid gap-8 md:grid-cols-4 md:gap-5"
            >
              <FlowStep
                step="1"
                label="Available work"
                detail="Choose an order or request the next one."
              />
              <FlowStep
                step="2"
                label="Claim order"
                detail="The server grants one employee exclusive ownership."
              />
              <FlowStep
                step="3"
                label="Guided picking"
                detail="Move through set-aware, one-card-at-a-time tasks."
                accent
              />
              <FlowStep
                step="4"
                label="Pick complete"
                detail="Validate progress before completing the pick."
              />
            </ol>
            <div className="mt-8 grid gap-4 border-l-2 border-dashed border-risk pl-5 md:ml-[50%] md:grid-cols-2">
              <div className="bg-risk-soft p-5">
                <p className="text-xs font-semibold text-risk-strong">
                  Branch from guided picking
                </p>
                <h3 className="mt-2 text-pretty font-display text-xl font-semibold">
                  Needs Attention
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Record the missing card or other issue without pretending the
                  task succeeded.
                </p>
              </div>
              <div className="border border-border bg-surface p-5">
                <p className="text-xs font-semibold text-muted">
                  Resume the path
                </p>
                <h3 className="mt-2 text-pretty font-display text-xl font-semibold">
                  Take over and continue
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Preserve the issue and completed progress for an experienced
                  employee.
                </p>
              </div>
              <p className="flex gap-2 text-sm font-medium text-risk-strong md:col-span-2">
                <span aria-hidden="true">↳</span>
                Return to Guided Picking, then continue to Pick Complete.
              </p>
            </div>
          </section>

          <section aria-labelledby="decisions-heading" className="py-20">
            <SectionHeading label="Product decisions" id="decisions-heading">
              Designing around real picking risk
            </SectionHeading>
            <div className="mt-10 divide-y divide-border border-y border-border lg:grid lg:grid-cols-3 lg:divide-x lg:divide-y-0">
              {decisions.map(([title, body]) => (
                <article
                  key={title}
                  className="py-7 lg:px-7 lg:first:pl-0 lg:last:pr-0"
                >
                  <h3 className="text-pretty font-display text-xl font-semibold leading-snug">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="evidence-heading" className="pb-20">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <SectionHeading label="Product evidence" id="evidence-heading">
                The implemented order view, annotated
              </SectionHeading>
              <StateLabel label="Implemented" tone="done" />
            </div>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted">
              This development view uses sample-order data and card-catalog
              images. The annotations identify information architecture already
              present in the application.
            </p>
            <div className="mt-8">
              <CaseStudyMedia
                src={lootOrderDetail}
                alt="Loot Singles order detail screen showing sample cards with numbered annotations for order ownership, set context, and quantity and variant details."
                title="Annotated Loot Singles order detail"
                caption="Implemented information hierarchy"
                context="Sample data"
                sizes="(min-width: 1080px) 1048px, calc(100vw - 2rem)"
                aspectClassName="aspect-[1440/1012]"
                objectClassName="object-contain"
              >
                <span className="annotation-marker left-[23%] top-[7%]">1</span>
                <span className="annotation-marker left-[67%] top-[22%]">
                  2
                </span>
                <span className="annotation-marker left-[31%] top-[66%]">
                  3
                </span>
              </CaseStudyMedia>
              <div className="mt-5 grid gap-5 text-sm sm:grid-cols-3">
                {[
                  [
                    "1",
                    "Visible ownership",
                    "The active picker remains attached to the order.",
                  ],
                  [
                    "2",
                    "Set context",
                    "Every product keeps its storage-relevant set visible.",
                  ],
                  [
                    "3",
                    "Risk details",
                    "Quantity, printing, and condition stay together.",
                  ],
                ].map(([number, title, detail]) => (
                  <div key={number} className="grid grid-cols-[2rem_1fr] gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-risk font-semibold text-on-risk">
                      {number}
                    </span>
                    <p className="leading-relaxed text-muted">
                      <strong className="block text-foreground">{title}</strong>
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            aria-labelledby="engineering-heading"
            className="border-y border-border py-16"
          >
            <SectionHeading label="Engineering proof" id="engineering-heading">
              Safety is enforced below the interface
            </SectionHeading>
            <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
              <article>
                <h3 className="text-pretty font-display text-2xl font-semibold">
                  Two pickers cannot both win
                </h3>
                <p className="mt-4 leading-relaxed text-muted">
                  Claiming is a server-enforced rule. A conditional atomic
                  database update succeeds only while an order is unclaimed, so
                  two employees racing for the same work cannot both acquire it.
                </p>
                <p className="mt-3 leading-relaxed text-muted">
                  Pick Next Order retries after a lost race, while a filtered
                  unique index stops one employee from holding multiple active
                  claims.
                </p>
              </article>
              <article>
                <h3 className="text-pretty font-display text-2xl font-semibold">
                  Treat the PDF as an imperfect boundary
                </h3>
                <p className="mt-4 leading-relaxed text-muted">
                  The importer handles multi-order and multi-page packing slips,
                  rejects orders it cannot reconstruct confidently, and saves
                  each valid order atomically behind a replaceable boundary.
                </p>
                <p className="mt-3 leading-relaxed text-muted">
                  It retains the original product description for traceability,
                  excludes unnecessary customer data, and keeps condition and
                  variant separate.
                </p>
              </article>
            </div>
          </section>

          <section className="grid gap-14 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <SectionHeading label="Ownership" id="ownership-heading">
                One product, end to end
              </SectionHeading>
              <div className="mt-5 space-y-4 leading-relaxed text-muted">
                <p>
                  I am the sole developer and product designer, working with
                  Loot Card Shop&apos;s owners as subject-matter experts. I
                  translate their operational knowledge into requirements,
                  interaction design, architecture, and implementation.
                </p>
                <p>
                  Work moves through clarification, technical planning,
                  Red/Green/Refactor TDD, review, and specification
                  verification. Tests include unit, integration, frontend,
                  Playwright end-to-end, and real SQL Server concurrency
                  coverage.
                </p>
              </div>
            </div>
            <div>
              <SectionHeading label="Current state" id="status-heading">
                What is built and what comes next
              </SectionHeading>
              <p className="mt-5 leading-relaxed text-muted">
                The application currently runs locally and has not yet been used
                for live fulfillment.
              </p>
              <div className="mt-7 grid gap-8 sm:grid-cols-2">
                <StatusList state="Implemented" items={completed} />
                <StatusList state="Planned V1" items={next} />
              </div>
            </div>
          </section>

          <section
            aria-labelledby="boundary-heading"
            className="border-l-4 border-risk bg-risk-soft px-6 py-8 sm:px-10 sm:py-10"
          >
            <SectionHeading
              label="Deliberate V1 boundary"
              id="boundary-heading"
            >
              V1 stops at Pick Complete
            </SectionHeading>
            <div className="mt-5 max-w-4xl space-y-4 leading-relaxed text-muted">
              <p>
                A future V2 would create a verified handoff into packing. A
                barcode or QR identifier would connect the physical order to the
                correct digital record before independent verification.
              </p>
              <p>
                The V1 model supports that extension without pulling packing
                complexity into the first release. That keeps the current work
                focused on making picking safer and proving it in-store.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-5">
              {lootSinglesProject.githubUrl && (
                <TextLink href={lootSinglesProject.githubUrl}>
                  View GitHub
                </TextLink>
              )}
              <TextLink href="/#projects" target="_self">
                Explore more projects
              </TextLink>
            </div>
          </section>
        </Container>
      </main>
    </>
  );
}

function StatusList({
  state,
  items,
}: {
  state: "Implemented" | "Planned V1";
  items: string[];
}) {
  return (
    <div>
      <StateLabel
        label={state}
        tone={state === "Implemented" ? "done" : "planned"}
      />
      <ul className="mt-4 space-y-2 text-sm text-muted">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span
              aria-hidden="true"
              className={state === "Implemented" ? "text-accent" : "text-risk"}
            >
              {state === "Implemented" ? "✓" : "○"}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
