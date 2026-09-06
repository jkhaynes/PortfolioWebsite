import type { Metadata } from "next";
import Container from "@/components/Container";
import Nav from "@/components/Nav";
import Tag from "@/components/Tag";
import TextLink from "@/components/TextLink";
import CaseStudyMedia from "@/components/case-study/CaseStudyMedia";
import {
  FlowStep,
  SectionHeading,
  StateLabel,
} from "@/components/case-study/CaseStudyPrimitives";
import { lootMembershipProject as project } from "@/data/projects";
import tierEditor from "../../../../public/work/loot-membership/tier-editor.png";
import customerConnected from "../../../../public/work/loot-membership/customer-connected-redacted.png";
import customerDashboard from "../../../../public/work/loot-membership/customer-dashboard.png";

const title = "Loot Membership Integration Case Study | Jessica Haynes";
const description =
  "Connecting verified Discord membership to Shopify customer benefits, with tenant-scoped identity, explicit failure states, and queued synchronization.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/work/loot-membership" },
  openGraph: {
    title,
    description,
    url: "/work/loot-membership",
    siteName: "Jessica Haynes",
    type: "article",
  },
  twitter: { card: "summary_large_image", title, description },
};

const decisions = [
  {
    title: "Identity comes from authenticated context",
    body: "The backend resolves the customer and merchant from a verified Shopify session. Discord OAuth supplies an immutable user ID, and role checks run on the server. A browser-supplied tier or display name cannot establish membership.",
    evidence:
      "Authorization and tenant-isolation tests exercise customer identity and cross-merchant boundaries.",
  },
  {
    title: "An outage is a different state from lost eligibility",
    body: "Verification health and membership eligibility are stored separately. If Discord cannot be reached, the last verified result is retained; a connection that has never been verified stays unknown. An authoritative role check can establish that a customer is no longer eligible.",
    evidence:
      "State-transition tests cover temporary failure, never-verified customers, and authoritative role loss.",
  },
  {
    title: "Shopify receives a copy of membership state",
    body: "D1 owns the identity link and resolved membership. Shopify tags and app-controlled metafields are derived outputs. Keeping that boundary explicit lets synchronization fail or retry without turning a delayed Shopify update into a new membership decision.",
    evidence:
      "Projection tests cover synchronization state and the data sent across the Shopify boundary.",
  },
  {
    title: "Background work must tolerate repetition",
    body: "Queued updates carry a membership revision. The synchronization service checks whether work is superseded or already complete and coordinates updates with a customer projection lock. Temporary failures use bounded backoff rather than immediate, unbounded retries.",
    evidence:
      "Integration coverage exercises stale and repeated projection work; unit tests check retry delays.",
  },
];

export default function LootMembershipCaseStudy() {
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
          <header className="grid gap-10 py-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-14 lg:py-16">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-accent">
                Integration case study
              </p>
              <h1 className="mt-4 max-w-3xl text-balance font-display text-5xl font-semibold leading-[1.02] text-foreground sm:text-6xl">
                {project.title}
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-xl leading-relaxed text-accent-secondary sm:text-2xl">
                Making member benefits depend on verified membership.
              </p>
              <p className="mt-6 text-sm text-muted">
                Sole developer &amp; designer
              </p>
              <p className="mt-6 text-sm font-semibold text-foreground">
                {project.status}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
              <div className="mt-8">
                <TextLink href="#workflow" target="_self">
                  See how membership flows ↓
                </TextLink>
              </div>
            </div>
            <CaseStudyMedia
              src={tierEditor}
              alt="Tier editor showing the Hoardling membership's Discord role, priority, Shopify customer tag, and deactivation control."
              title="Loot membership tier editor"
              caption="Configure the link between Discord roles and Shopify tags"
              context="App screenshot"
              priority
              sizes="(min-width: 1024px) 54vw, calc(100vw - 2rem)"
              aspectClassName="aspect-[15/13]"
              objectClassName="object-contain"
            />
          </header>

          <section
            aria-labelledby="context-heading"
            className="grid gap-8 border-y border-border py-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16"
          >
            <SectionHeading label="The problem" id="context-heading">
              Knowing a discount code did not prove membership
            </SectionHeading>
            <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-muted">
              <p>
                I noticed that people were using Loot Card Shop&apos;s member
                discount codes who weren&apos;t supposed to. The shop needed a
                way to connect benefits to actual membership, rather than
                possession of a code.
              </p>
              <p>
                Loot uses Discord roles to represent membership. Shopify needs
                that membership attached to the right customer before it can
                support member benefits. I designed and built this integration
                to connect those identities and translate configured roles into
                membership tiers.
              </p>
              <p>
                Loot is the first merchant, with Hoardling and Hoardmaster as
                its initial tier mappings. Those names are configuration: each
                merchant has its own Discord server, role mappings, and customer
                connections.
              </p>
              <p>
                MEE6 currently supplies Loot&apos;s paid-membership roles. The
                app depends on verified Discord roles, so billing can remain
                with the membership provider and benefit enforcement can remain
                with Shopify.
              </p>
            </div>
          </section>

          <section
            id="workflow"
            aria-labelledby="workflow-heading"
            className="scroll-mt-24 py-16"
          >
            <SectionHeading label="The experience" id="workflow-heading">
              Two paths meet at verified membership
            </SectionHeading>
            <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-16">
              <div>
                <h3 className="font-display text-2xl font-semibold">
                  The merchant configures the connection
                </h3>
                <ol className="mt-7 space-y-7">
                  <FlowStep
                    step="1"
                    label="Connect the Discord server"
                    detail="The merchant authorizes the shared Discord bot for their server through the Shopify app."
                  />
                  <FlowStep
                    step="2"
                    label="Map roles to tiers"
                    detail="Configure which Discord roles resolve to each membership tier and its Shopify membership tag."
                  />
                  <FlowStep
                    step="3"
                    label="Make membership visible"
                    detail="Configure the customer account destination and use the merchant dashboard to inspect membership and synchronization status."
                  />
                </ol>
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold">
                  The customer connects their identity
                </h3>
                <ol className="mt-7 space-y-7">
                  <FlowStep
                    step="1"
                    label="Open membership in Shopify"
                    detail="An authenticated customer starts the Discord connection from their customer account."
                  />
                  <FlowStep
                    step="2"
                    label="Authorize Discord"
                    detail="The backend verifies the Discord identity and checks roles against the merchant's configuration."
                  />
                  <FlowStep
                    step="3"
                    label="See the resolved status"
                    detail="The account experience displays membership and verification status while Shopify updates are synchronized in the background."
                  />
                </ol>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="screenshots-heading"
            className="border-t border-border py-16"
          >
            <SectionHeading label="Inside the app" id="screenshots-heading">
              Membership status for customers and merchants
            </SectionHeading>
            <div className="mt-10 grid gap-12 lg:grid-cols-2">
              <article className="min-w-0">
                <h3 className="mb-5 font-display text-2xl font-semibold">
                  A visible connection, with a clear exit
                </h3>
                <CaseStudyMedia
                  src={customerConnected}
                  alt="Customer account showing verified Hoardling membership, Check again, and a Discord disconnect confirmation. Username and verification timestamp are redacted."
                  title="Loot customer membership"
                  caption="Verified membership and disconnect confirmation"
                  context="App screenshot · Personal details redacted"
                  sizes="(min-width: 1024px) 50vw, calc(100vw - 2rem)"
                  aspectClassName="aspect-[685/401]"
                  objectClassName="object-contain"
                />
                <p className="mt-5 leading-relaxed text-muted">
                  The customer can see their verified tier, request another
                  check, or disconnect Discord. The confirmation explains that
                  disconnecting removes verified membership until the account is
                  connected again.
                </p>
              </article>
              <article className="min-w-0">
                <h3 className="mb-5 font-display text-2xl font-semibold">
                  Separate states stay visible
                </h3>
                <CaseStudyMedia
                  src={customerDashboard}
                  alt="Merchant dashboard with connection and eligibility counts, separate Unable to verify and Pending states, an in-progress reconciliation notice, and an empty customer search."
                  title="Loot membership customer dashboard"
                  caption="Customer status and reconciliation in progress"
                  context="App screenshot"
                  sizes="(min-width: 1024px) 50vw, calc(100vw - 2rem)"
                  aspectClassName="aspect-[959/448]"
                  objectClassName="object-contain"
                />
                <p className="mt-5 leading-relaxed text-muted">
                  The merchant dashboard separates connection status,
                  eligibility, and verification health. This capture also shows
                  feedback for a reconciliation pass already in progress. The
                  displayed counts describe this captured app state, not
                  adoption or business impact.
                </p>
              </article>
            </div>
          </section>

          <section
            aria-labelledby="architecture-heading"
            className="border-y border-border py-16"
          >
            <SectionHeading
              label="System responsibilities"
              id="architecture-heading"
            >
              One source of membership truth
            </SectionHeading>
            <figure aria-label="Membership architecture" className="mt-9">
              <ol className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
                <FlowStep
                  step="1"
                  label="Discord"
                  detail="Provides identity and server-side role verification."
                />
                <FlowStep
                  step="2"
                  label="Membership in D1"
                  detail="Stores tenant-scoped identity, eligibility, tier, and verification health."
                />
                <FlowStep
                  step="3"
                  label="Background queue"
                  detail="Carries revisioned updates with retry and recovery handling."
                />
                <FlowStep
                  step="4"
                  label="Shopify"
                  detail="Receives derived customer membership state for use by the store."
                />
              </ol>
              <figcaption className="mt-7 max-w-3xl text-sm leading-relaxed text-muted">
                Architecture diagram. The customer account reads membership
                status from the app; Shopify synchronization is a separate
                operation that can be pending or delayed.
              </figcaption>
            </figure>
          </section>

          <section aria-labelledby="decisions-heading" className="py-16">
            <SectionHeading
              label="Engineering decisions"
              id="decisions-heading"
            >
              Make the failure cases explicit
            </SectionHeading>
            <div className="mt-10 grid gap-x-16 gap-y-10 md:grid-cols-2">
              {decisions.map((decision) => (
                <article key={decision.title}>
                  <h3 className="text-pretty font-display text-2xl font-semibold">
                    {decision.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-muted">
                    {decision.body}
                  </p>
                  <p className="mt-4 border-l-2 border-accent-soft pl-4 text-sm leading-relaxed text-muted">
                    {decision.evidence}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="status-heading"
            className="grid gap-12 border-t border-border py-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"
          >
            <div>
              <SectionHeading
                label="Development approach"
                id="approach-heading"
              >
                Specifications, boundaries, and regression coverage
              </SectionHeading>
              <p className="mt-5 leading-relaxed text-muted">
                As the sole developer and designer, I took the project from
                identifying the shop&apos;s discount-code problem through
                product design and implementation. I use GitHub Spec Kit to
                carry features from requirements into technical plans and
                implementation tasks.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                Unit, integration, contract, customer-extension, and browser
                tests cover different boundaries of the system.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                The focus is on behavior that matters across systems: which
                customer is authorized, which merchant owns the data, what an
                unavailable dependency means, and whether work can safely run
                again.
              </p>
            </div>
            <div>
              <SectionHeading label="Current state" id="status-heading">
                Built foundations, ongoing development
              </SectionHeading>
              <div className="mt-7 space-y-7">
                <div>
                  <StateLabel label="Implemented" tone="done" />
                  <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-muted">
                    <li>
                      Discord account linking and tenant-scoped role
                      verification
                    </li>
                    <li>
                      Merchant onboarding, tier configuration, and dashboard
                    </li>
                    <li>Customer account membership experience</li>
                    <li>
                      Queued Shopify synchronization and scheduled recovery
                    </li>
                  </ul>
                </div>
                <div>
                  <StateLabel
                    label="In progress / future direction"
                    tone="planned"
                  />
                  <p className="mt-4 leading-relaxed text-muted">
                    Configuration-change re-projection is active development
                    work. The product direction includes proving the first
                    end-to-end benefit with Loot and eventually supporting
                    unrelated Shopify merchants through public distribution.
                  </p>
                </div>
              </div>
              <p className="mt-7 text-sm leading-relaxed text-muted">
                This case study describes the development implementation. The
                $0/month recurring-infrastructure budget is a design target;
                production outcomes and operating costs are not reported here.
              </p>
            </div>
          </section>
          <div className="border-t border-border pt-8">
            <TextLink href="/#projects" target="_self">
              Explore more projects
            </TextLink>
          </div>
        </Container>
      </main>
    </>
  );
}
