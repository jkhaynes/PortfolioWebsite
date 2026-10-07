import type { Metadata } from "next";
import Container from "@/components/Container";
import Nav from "@/components/Nav";
import TextLink from "@/components/TextLink";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import CaseStudyMedia from "@/components/case-study/CaseStudyMedia";
import NextInSet from "@/components/case-study/NextInSet";
import {
  FlowStep,
  SectionHeading,
  StateLabel,
} from "@/components/case-study/CaseStudyPrimitives";
import { roleSyncProject as project } from "@/data/projects";
import membershipTiers from "../../../../public/work/rolesync/membership-tiers.png";
import dashboard from "../../../../public/work/rolesync/dashboard.png";
import stagedPreview from "../../../../public/work/rolesync/staged-preview.png";
import syncStatus from "../../../../public/work/rolesync/sync-status.png";
import changeHistory from "../../../../public/work/rolesync/change-history.png";

const title = "RoleSync Case Study | Jessica Haynes";
const description =
  "Connecting verified Discord membership to Shopify customer benefits, with tenant-scoped identity, explicit failure states, and queued synchronization.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/work/rolesync" },
  openGraph: {
    title,
    description,
    url: "/work/rolesync",
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

const screenshots = [
  {
    heading: "Health and eligibility at a glance",
    src: dashboard,
    alt: "RoleSync dashboard showing Shopify and Discord connected, plan usage, and customer counts for connected, eligible, not eligible, unable to verify and pending.",
    title: "RoleSync dashboard",
    caption: "Integration health, plan usage and customer status",
    aspectClassName: "aspect-[860/865]",
    body: "The dashboard shows whether Shopify and Discord are connected and where each customer stands. Eligibility and verification health are counted separately. The counts describe the development store, not adoption or business impact.",
  },
  {
    heading: "Preview a change before it lands",
    src: stagedPreview,
    alt: "Rename Shopify tag confirmation from membership-silver to membership-silver-2026, showing seven connected customers affected.",
    title: "RoleSync staged change preview",
    caption: "Staged tag rename with affected customers",
    aspectClassName: "aspect-[860/811]",
    body: "Renaming a tag or changing a role is staged first. The preview shows how many connected customers the change affects and how it is applied. Eligible customers get the new tag, and the old one is removed once that succeeds.",
  },
  {
    heading: "Failures say what to do next",
    src: syncStatus,
    alt: "Customer sync status with one customer needing attention because Shopify did not respond, a retry button, and two customers already updating.",
    title: "RoleSync customer sync status",
    caption: "A failed Shopify update with a targeted retry",
    aspectClassName: "aspect-[860/852]",
    body: "When Shopify does not respond after several attempts, the customer is listed with the reason and a retry. Work already in progress is shown separately, so the merchant knows it needs nothing from them.",
  },
  {
    heading: "Every change is recorded",
    src: changeHistory,
    alt: "Change history listing a tag rename, a priority change, tag assignments and a role mapping, each marked Done with its time.",
    title: "RoleSync change history",
    caption: "Configuration changes and their outcomes",
    aspectClassName: "aspect-[860/464]",
    body: "Tag renames, priority changes and new role mappings are listed with when they ran and whether they finished, so a merchant can see what changed and when.",
  },
];

export default function RoleSyncCaseStudy() {
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
            project={project}
            kicker="Integration case study"
            summary="Making member benefits depend on verified membership."
            role="Sole developer & designer"
            status="V1 complete"
            stack="TypeScript, React Router, Cloudflare Workers, D1"
            actions={
              <TextLink href="#workflow" target="_self">
                See how membership flows ↓
              </TextLink>
            }
            art={
              <CaseStudyMedia
                src={membershipTiers}
                alt="Membership tiers page listing Silver, Gold and Bronze, each with its Discord role, Shopify customer tag and priority."
                title="RoleSync membership tiers"
                caption="Discord roles mapped to Shopify tags, by priority"
                context="App screenshot"
                priority
                sizes="(min-width: 1024px) 50vw, calc(100vw - 4rem)"
                aspectClassName="aspect-[860/811]"
                objectClassName="object-contain"
              />
            }
          />

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
                support member benefits. I designed and built RoleSync to
                connect those identities and translate configured roles into
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
              What the merchant sees
            </SectionHeading>
            <div className="mt-10 grid gap-x-12 gap-y-14 lg:grid-cols-2">
              {screenshots.map((shot) => (
                <article key={shot.title} className="min-w-0">
                  <h3 className="mb-5 font-display text-2xl font-semibold">
                    {shot.heading}
                  </h3>
                  <CaseStudyMedia
                    src={shot.src}
                    alt={shot.alt}
                    title={shot.title}
                    caption={shot.caption}
                    context="App screenshot"
                    sizes="(min-width: 1024px) 50vw, calc(100vw - 2rem)"
                    aspectClassName={shot.aspectClassName}
                    objectClassName="object-contain"
                  />
                  <p className="mt-5 leading-relaxed text-muted">{shot.body}</p>
                </article>
              ))}
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
                Version 1 is complete
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
                    <li>
                      Staged configuration changes with affected-customer
                      previews and change history
                    </li>
                    <li>Customer sync status with targeted retries</li>
                    <li>Free and paid plans based on linked customers</li>
                  </ul>
                </div>
                <div>
                  <StateLabel label="Next" tone="planned" />
                  <p className="mt-4 leading-relaxed text-muted">
                    Rolling RoleSync out with Loot Card Shop and making it
                    available to other Shopify merchants.
                  </p>
                </div>
              </div>
              <p className="mt-7 text-sm leading-relaxed text-muted">
                This case study describes the implementation. Production
                outcomes and operating costs are not reported here.
              </p>
            </div>
          </section>
          <div className="border-t border-border pt-8">
            <TextLink href="/#projects" target="_self">
              Explore more projects
            </TextLink>
          </div>

          <NextInSet current={project} />
        </Container>
      </main>
    </>
  );
}
