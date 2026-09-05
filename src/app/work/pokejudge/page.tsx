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
import { pokeJudgeProject } from "@/data/projects";
import lateArrivalEvaluation from "../../../../public/work/pokejudge/late-arrival-success.png";

export const metadata: Metadata = {
  title: "PokéJudge AI Case Study | Jessica Haynes",
  description:
    "How Jessica Haynes built a source-grounded AI workflow that investigates incomplete Pokémon tournament judge calls before recommending a ruling.",
  alternates: {
    canonical: "/work/pokejudge",
  },
  openGraph: {
    title: "PokéJudge AI Case Study | Jessica Haynes",
    description:
      "How Jessica Haynes built a source-grounded AI workflow that investigates incomplete Pokémon tournament judge calls before recommending a ruling.",
    url: "/work/pokejudge",
    siteName: "Jessica Haynes",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PokéJudge AI Case Study | Jessica Haynes",
    description:
      "How Jessica Haynes built a source-grounded AI workflow that investigates incomplete Pokémon tournament judge calls before recommending a ruling.",
  },
};

const pipeline = [
  ["1", "Describe", "Capture the judge call in the judge’s own words."],
  [
    "2",
    "Retrieve",
    "Search authoritative policy before deciding what is missing.",
  ],
  ["3", "Assess", "Separate sufficient facts from material unknowns."],
  ["4", "Clarify", "Ask only questions tied to the retrieved passages."],
  ["5", "Re-retrieve", "Search again with newly confirmed facts."],
  ["6", "Recommend", "Generate guidance only when the facts are sufficient."],
  ["7", "Validate", "Assign Strong, Partial, or Insufficient Source Support."],
] as const;

const components = [
  [
    "Ingestion + chunking",
    "Turns official PDFs into normalized, section-aware, citable chunks.",
    "Preserves the authority and location behind every passage.",
  ],
  [
    "Embeddings + retrieval",
    "Finds policy passages relevant to the evolving scenario.",
    "Keeps the investigation grounded in the ingested corpus.",
  ],
  [
    "Structured scenario state",
    "Tracks confirmed facts, unknowns, and hypotheses separately.",
    "Prevents an interpretation from silently becoming evidence.",
  ],
  [
    "Sufficiency + clarification",
    "Decides whether material facts are missing and formulates targeted questions.",
    "Blocks premature rulings.",
  ],
  [
    "Ruling generation",
    "Produces a structured recommendation, explanation, repair steps, and citations.",
    "Constrains output to the decision the workflow has earned.",
  ],
  [
    "Grounding + Source Support",
    "Checks citation existence, coverage, sufficiency, and conflicts.",
    "Reports evidentiary support instead of a persuasive confidence score.",
  ],
  [
    "Evaluation harness",
    "Scores retrieval, clarification, ruling, and grounding across repeatable scenarios.",
    "Makes failures in the path visible, even when the final answer sounds right.",
  ],
] as const;

const built = [
  "End-to-end local console pipeline",
  "Official PDF ingestion and section-aware chunking",
  "Gemini embeddings, retrieval, and structured model output",
  "Clarification loop with structured scenario state",
  "Grounding validation and Source Support assignment",
  "Deterministic tests and a scenario evaluation harness",
];

const planned = [
  "Make repeated-run clarification behavior more consistent",
  "Improve ranking within the existing official-policy corpus",
  "Add authorized, separately ingested card-specific rulings",
  "Expand evaluation and close documented source gaps",
  "Build a React/TypeScript and ASP.NET Core web surface after hardening",
];

export default function PokeJudgeCaseStudy() {
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

          <header className="grid gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14 lg:py-16">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-accent">
                AI systems case study
              </p>
              <h1 className="mt-4 max-w-3xl text-balance font-display text-5xl font-semibold leading-[1.02] text-foreground sm:text-6xl">
                {pokeJudgeProject.title}
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-xl leading-relaxed text-accent-secondary sm:text-2xl">
                A source-grounded decision-support system that investigates an
                incomplete judge call before recommending a ruling.
              </p>
              <dl className="mt-7 grid max-w-xl grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <dt className="text-muted">Role</dt>
                  <dd className="mt-1 font-semibold text-foreground">
                    Sole developer & product designer
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Current form</dt>
                  <dd className="mt-1 font-semibold text-foreground">
                    Local .NET console application
                  </dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-wrap gap-2">
                {pokeJudgeProject.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {pokeJudgeProject.githubUrl && (
                  <Button href={pokeJudgeProject.githubUrl}>View GitHub</Button>
                )}
                <TextLink
                  href="#pipeline"
                  target="_self"
                  className="self-center px-2"
                >
                  See the pipeline ↓
                </TextLink>
              </div>
            </div>

            <div className="min-w-0 overflow-hidden rounded-[2rem] border border-foreground/15 bg-product-ink p-6 font-mono text-sm leading-relaxed text-white shadow-product sm:p-8">
              <div className="flex gap-2" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-risk" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent-soft" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              </div>
              <p className="mt-7 text-white/60">Assessment</p>
              <p>Insufficient — 1 clarifying question needed.</p>
              <p className="mt-5 text-console-accent">Clarifying question</p>
              <p>How many minutes late did the competitor arrive?</p>
              <p className="mt-2 text-white/60">Judge</p>
              <p>Exactly 7 minutes after the round started.</p>
              <p className="mt-5 font-semibold text-emerald-300">
                Sufficient — generating ruling...
              </p>
              <p className="mt-5 text-console-accent">Recommendation</p>
              <p>Assess a penalty for Major Tardiness.</p>
              <p className="mt-5 font-semibold text-emerald-300">
                Validated Source Support: Strong
              </p>
              <p className="mt-2 text-white/60">
                2 turns · 2 explicit citations · no conflicts
              </p>
            </div>
          </header>

          <section className="grid gap-12 border-t border-border py-16 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHeading label="Why I built it" id="motivation-heading">
                Policy should drive the next question
              </SectionHeading>
              <p className="mt-5 leading-relaxed text-muted">
                As a Pokémon Professor and tournament judge, I wanted a tool
                that could find the right policy quickly without guessing at the
                game state. Judge calls are time-sensitive, often incomplete,
                and governed by official material spread across large,
                cross-referenced documents.
              </p>
            </div>
            <div>
              <SectionHeading label="The problem" id="problem-heading">
                A fluent answer is not enough
              </SectionHeading>
              <p className="mt-5 leading-relaxed text-muted">
                A generic chatbot can fill gaps with plausible assumptions.
                PokéJudge retrieves first so the source material—not a model’s
                general Pokémon knowledge—determines which unknown facts matter
                and whether the evidence supports a recommendation.
              </p>
            </div>
          </section>

          <section
            id="pipeline"
            aria-labelledby="pipeline-heading"
            className="scroll-mt-24 rounded-[2rem] border border-border bg-background p-6 shadow-soft sm:p-10"
          >
            <div className="flex flex-wrap items-start justify-between gap-5">
              <SectionHeading label="Decision pipeline" id="pipeline-heading">
                The application owns the workflow
              </SectionHeading>
              <StateLabel label="Built" tone="done" />
            </div>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted">
              Describe is the entry point. Retrieval happens before
              clarification; when the assessment finds a material unknown, the
              answer updates structured state and triggers a new search before
              assessment continues.
            </p>
            <ol
              aria-label="PokéJudge decision pipeline"
              className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-7 lg:gap-4"
            >
              {pipeline.map(([step, label, detail]) => (
                <FlowStep
                  key={step}
                  step={step}
                  label={label}
                  detail={detail}
                  accent={step === "4" || step === "5"}
                />
              ))}
            </ol>
            <div className="mt-8 border-l-2 border-dashed border-risk bg-risk-soft px-5 py-4 text-sm leading-relaxed text-risk-strong lg:ml-[28%] lg:max-w-[43%]">
              <p className="font-semibold">Clarification loop ↶</p>
              <p className="mt-1">
                Clarify → re-retrieve → assess repeats until the facts are
                sufficient. Only then does the path continue to Recommend and
                Validate.
              </p>
            </div>
          </section>

          <section aria-labelledby="live-run-heading" className="py-20">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <SectionHeading
                label="Live product evidence"
                id="live-run-heading"
              >
                The complete clarification run
              </SectionHeading>
              <TextLink href={lateArrivalEvaluation.src}>
                Open full-size screenshot
              </TextLink>
            </div>
            <p className="mt-5 max-w-3xl leading-relaxed text-muted">
              This capture preserves the full output from the live Gemini-backed
              late-arrival scenario: both retrieval passes, the material
              question and answer, the recommendation, validated Source Support,
              and citation checks.
            </p>
            <div className="mt-8">
              <CaseStudyMedia
                src={lateArrivalEvaluation}
                alt="Complete PokeJudge console output for a late-arrival scenario, including retrieval, a clarifying question, re-retrieval, a Major Tardiness recommendation, and validated Strong Source Support."
                title="Complete PokéJudge clarification run"
                caption="Captured from a live run using the official-policy corpus"
                context="Complete terminal output"
                sizes="(min-width: 1080px) 1048px, calc(100vw - 2rem)"
                aspectClassName="aspect-square"
                objectClassName="object-contain"
              />
            </div>
          </section>

          <section
            aria-labelledby="structure-heading"
            className="border-y border-border py-16"
          >
            <SectionHeading label="System structure" id="structure-heading">
              Seven focused components, one controlled path
            </SectionHeading>
            <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2">
              {components.map(([title, responsibility, reason]) => (
                <article key={title} className="bg-surface p-6">
                  <h3 className="font-display text-xl font-semibold">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {responsibility}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed">
                    <strong className="text-foreground">Why it exists:</strong>{" "}
                    <span className="text-muted">{reason}</span>
                  </p>
                </article>
              ))}
            </div>
            <blockquote className="mt-10 border-l-4 border-risk bg-risk-soft px-6 py-7 font-display text-xl font-semibold leading-relaxed text-foreground sm:px-10 sm:text-2xl">
              “Confirmed facts, unknown facts, and possible interpretations are
              different states. A hypothesis can guide the next question, but it
              can never support a ruling.”
            </blockquote>
          </section>

          <section aria-labelledby="decisions-heading" className="py-20">
            <SectionHeading
              label="Engineering decisions"
              id="decisions-heading"
            >
              Measure support and score the path
            </SectionHeading>
            <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
              <Decision title="Source Support, not model confidence">
                Strong, Partial, or Insufficient is derived from retrieved
                authority, citation coverage, fact sufficiency, and source
                conflict. It describes the available evidence—not how persuasive
                the model sounds.
              </Decision>
              <Decision title="Evaluation includes the investigation">
                The harness scores clarification, retrieval, ruling, and
                grounding. A correct-looking answer reached through the wrong
                path does not count as full success.
              </Decision>
            </div>
            <article className="mt-12 border-l-4 border-risk bg-risk-soft px-6 py-7 sm:px-10">
              <p className="text-sm font-semibold text-risk-strong">
                A source-coverage edge case
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">
                Clarification can reveal that the available rule stops short
              </h3>
              <p className="mt-4 max-w-4xl leading-relaxed text-muted">
                In a live extra-card run, the system asked whether the card was
                identifiable and whether the player had seen it, then
                re-retrieved after each answer. The known facts ultimately fell
                outside the repair described by the retrieved passage, so the
                model reported Insufficient support for a concrete remedy. The
                validator rated the cited passage Strong only for the narrower
                conclusion that this repair did not apply—not for a penalty the
                corpus could not support.
              </p>
              <p className="mt-4 max-w-4xl text-sm leading-relaxed text-risk-strong">
                This is useful backlog evidence: expand authorized source
                coverage and make the distinction between “strongly supported
                limitation” and “strongly supported ruling” clearer in the
                product language.
              </p>
            </article>
          </section>

          <section
            aria-labelledby="evidence-heading"
            className="rounded-[2rem] border border-border bg-surface p-6 shadow-soft sm:p-10"
          >
            <SectionHeading label="Current evidence" id="evidence-heading">
              Useful regression signals, carefully scoped
            </SectionHeading>
            <dl className="mt-10 grid gap-8 sm:grid-cols-3">
              <Evidence
                value="20"
                label="hand-authored scenarios"
                detail="Across major judge-call categories and incomplete prompts."
              />
              <Evidence
                value="214"
                label="deterministic tests"
                detail="Passing at the Milestone 8.5 implementation checkpoint."
              />
              <Evidence
                value="Repeated"
                label="live runs"
                detail="Separating reasoning, retrieval, source-coverage, and provider failures."
              />
            </dl>
            <p className="mt-10 border-l-4 border-risk bg-risk-soft px-5 py-4 font-semibold text-risk-strong">
              This supports regression testing, not a production accuracy claim.
            </p>
          </section>

          <section className="grid gap-14 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <SectionHeading label="Current state" id="current-heading">
                A complete local workflow
              </SectionHeading>
              <p className="mt-5 leading-relaxed text-muted">
                The console application exercises the full pipeline and
                evaluation harness. There is no web UI yet.
              </p>
              <StatusList label="Built" tone="done" items={built} />
            </div>
            <div>
              <SectionHeading label="What’s next" id="next-heading">
                Harden first, then add a web surface
              </SectionHeading>
              <p className="mt-5 leading-relaxed text-muted">
                The next work focuses on consistency, retrieval quality,
                authorized source coverage, and stronger evaluation before
                adding scenario entry, short clarifications, visible known
                facts, Source Support, and expandable citations to a web
                experience.
              </p>
              <StatusList label="Planned next" tone="planned" items={planned} />
            </div>
          </section>

          <section
            aria-labelledby="closing-heading"
            className="border-l-4 border-accent bg-accent-soft px-6 py-8 sm:px-10 sm:py-10"
          >
            <SectionHeading label="Explore the work" id="closing-heading">
              Grounded by design, honest about the gaps
            </SectionHeading>
            <div className="mt-8 flex flex-wrap gap-5">
              {pokeJudgeProject.githubUrl && (
                <TextLink href={pokeJudgeProject.githubUrl}>
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

function Evidence({
  value,
  label,
  detail,
}: {
  value: string;
  label: string;
  detail: string;
}) {
  return (
    <div>
      <dt className="font-display text-4xl font-semibold text-accent">
        {value}
      </dt>
      <dd className="mt-2 font-semibold text-foreground">{label}</dd>
      <dd className="mt-2 text-sm leading-relaxed text-muted">{detail}</dd>
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
