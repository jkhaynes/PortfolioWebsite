import type { StaticImageData } from "next/image";
import lootOrderDetail from "../../public/work/loot-singles/order-detail-desktop-catalog-cards.png";
import pokeJudgeRun from "../../public/work/pokejudge/late-arrival-success.png";
import membershipTierEditor from "../../public/work/loot-membership/tier-editor.png";
import pricewatchStatusPage from "../../public/work/pricewatch/status-page.png";

export type ProjectMedia = {
  src: StaticImageData;
  alt: string;
  title: string;
  caption: string;
  objectClassName: string;
  priority?: boolean;
};

export type Project = {
  title: string;
  status: string;
  /** One line for the homepage card; the full story lives on the case study. */
  cardSummary: string;
  /** TL;DR outcome on the case-study card back. */
  outcome: string;
  problemStatement: string;
  solutionSummary: string;
  technicalDecisions: string;
  buildApproach: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  caseStudyUrl?: string;
  media?: ProjectMedia;
};

export const pokeJudgeProject: Project = {
  title: "PokéJudge AI",
  status: "In Development",
  cardSummary:
    "An AI rules assistant that asks the right questions before it recommends a cited ruling.",
  outcome:
    "End-to-end pipeline with grounding validation and Source Support",
  problemStatement:
    "Pokémon TCG tournament judges need fast, well-supported rulings for natural-language rules and game-state questions, not just a lookup tool or an unvalidated AI answer.",
  solutionSummary:
    "A judge describes the situation in natural language; the system asks clarifying questions if needed, retrieves the relevant authoritative rules passages, and returns a cited recommendation, rating how strongly the source material actually supports it rather than presenting an unvalidated confidence score.",
  technicalDecisions:
    "The application owns a structured retrieve, assess, clarify, re-retrieve, recommend, and validate workflow; Source Support is derived from retrieved authority and grounding checks rather than model confidence.",
  buildApproach:
    "Built as a local .NET console application using Gemini models and embeddings, PDF ingestion, vector similarity search, schema-constrained output, and xUnit.",
  tags: [
    "C#",
    ".NET",
    "RAG / Retrieval",
    "Embeddings",
    "LLM Integration",
    "Structured Output",
  ],
  githubUrl: "https://github.com/jkhaynes/PokeJudge",
  caseStudyUrl: "/work/pokejudge",
  media: {
    src: pokeJudgeRun,
    alt: "PokeJudge console output for a late-arrival scenario with a clarifying question and grounded recommendation.",
    title: "PokéJudge clarification run",
    caption: "Live clarification and grounding run",
    objectClassName: "object-cover object-left-top",
    priority: true,
  },
};

export const lootSinglesProject: Project = {
  title: "Loot Singles Fulfillment",
  status: "In Development",
  cardSummary:
    "A set-aware picking app built to prevent wrong-card mistakes and order collisions.",
  outcome: "Order detail with set, condition and variant up front",
  problemStatement:
    "Loot Card Shop's printed TCGplayer invoices led to wrong-card, quantity, variant, and set errors, and didn't support multiple employees safely picking orders at once.",
  solutionSummary:
    "A purpose-built digital picking workflow with set-aware picking, prominent card details, issue reporting, and exclusive order claiming so multiple employees can work concurrently without collisions.",
  technicalDecisions:
    "React and TypeScript PWA backed by ASP.NET Core, C#, Entity Framework Core, and Azure SQL.",
  buildApproach:
    "Built using GitHub Spec Kit for spec-driven, AI-assisted development, with strict test-driven development following the Red-Green-Refactor cycle.",
  tags: [
    "React",
    "TypeScript",
    "C#",
    "ASP.NET Core",
    "Entity Framework Core",
    "Azure SQL",
    "GitHub Spec Kit",
    "TDD",
  ],
  githubUrl: "https://github.com/jkhaynes/loot-singles-fulfillment",
  caseStudyUrl: "/work/loot-singles",
  media: {
    src: lootOrderDetail,
    alt: "Loot Singles order detail screen showing sample-order cards and their set, condition, variant, and quantity details.",
    title: "Loot Singles order detail",
    caption: "Implemented order-detail foundation · Sample data",
    objectClassName: "object-cover object-left",
  },
};

export const lootMembershipProject: Project = {
  title: "Loot Membership Integration",
  status: "In Development",
  cardSummary:
    "A Shopify app that ties member discounts to verified Discord roles.",
  outcome: "Tier editor mapping Discord roles to Shopify customer tags",
  problemStatement:
    "Loot Card Shop had people using member discount codes who weren't eligible. Discord membership needed to be connected to the right Shopify customer.",
  solutionSummary:
    "A Shopify app links customers to Discord, resolves membership tiers server-side, and synchronizes customer membership into Shopify while keeping each merchant's data separate.",
  technicalDecisions:
    "Tenant-scoped identity and membership in D1, with queued Shopify updates and separate verification-health and eligibility states.",
  buildApproach:
    "Specification-driven development with GitHub Spec Kit, supported by unit, integration, contract, and browser tests.",
  tags: [
    "TypeScript",
    "React Router",
    "Shopify API",
    "Discord OAuth2",
    "Cloudflare Workers",
    "D1",
  ],
  caseStudyUrl: "/work/loot-membership",
  media: {
    src: membershipTierEditor,
    alt: "Loot membership tier editor with Discord role mappings, role priority, and a Shopify customer tag.",
    title: "Loot membership tier editor",
    caption: "Discord roles mapped to Shopify membership · App screenshot",
    objectClassName: "object-cover object-top",
  },
};

export const pricewatchProject: Project = {
  title: "pricewatch",
  status: "Live",
  cardSummary:
    "A Go CLI that prices an 8,800-card collection on 1,000 API requests a day.",
  outcome: "~915 requests a day to keep 4,900 prices current",
  problemStatement:
    "An 8,800-card Pokémon collection can't be priced in one go on a free API budget of 100 requests an hour and 1,000 a day, and a Normal and a Reverse Holo of the same card can differ in price by more than any movement being tracked.",
  solutionSummary:
    "Each hourly run prices a bounded slice of the cards that are due, saves progress in SQLite so the next run carries on, and publishes a public status page. Rows that can't be matched to exactly one print are reported instead of guessed.",
  technicalDecisions:
    "Value tiers decide how often a card is checked, pacing follows the API's own remaining count, and a two-stage Ctrl-C keeps completed work saved.",
  buildApproach:
    "Built in Go to learn the language after nine years of C#, standard library first with two third-party packages, and offline tests using a fake clock.",
  tags: ["Go", "SQLite", "GitHub Actions", "PokéWallet API", "Concurrency"],
  githubUrl: "https://github.com/jkhaynes/pricewatch",
  demoUrl: "https://jkhaynes.github.io/pricewatch-site",
  caseStudyUrl: "/work/pricewatch",
  media: {
    src: pricewatchStatusPage,
    alt: "The pricewatch status page showing the price index, the biggest movers and the schedule of every card.",
    title: "pricewatch status page",
    caption: "Live status page · Rebuilt every hour",
    objectClassName: "object-cover object-top",
  },
};

// The set order: the homepage hand and each case study's "Next in the set".
export const projects: Project[] = [
  pokeJudgeProject,
  lootSinglesProject,
  lootMembershipProject,
  pricewatchProject,
];
