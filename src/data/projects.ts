export type Project = {
  title: string;
  status: string;
  problemStatement: string;
  solutionSummary: string;
  technicalDecisions: string;
  buildApproach: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  caseStudyUrl?: string;
};

export const pokeJudgeProject: Project = {
  title: "PokéJudge AI",
  status: "In Development",
  problemStatement:
    "Pokémon TCG tournament judges need fast, well-supported rulings for natural-language rules and game-state questions, not just a lookup tool or an unvalidated AI answer.",
  solutionSummary:
    "A judge describes the situation in natural language; the system asks clarifying questions if needed, retrieves the relevant authoritative rules passages, and returns a cited recommendation, rating how strongly the source material actually supports it rather than presenting an unvalidated confidence score.",
  technicalDecisions:
    "Introduces each AI capability (LLM calls, structured output, retrieval-augmented generation, evaluation) only as the product needed it, rather than adopting a general AI framework upfront.",
  buildApproach:
    "Built in C#/ASP.NET Core as a hands-on AI engineering project.",
  tags: [
    "C#",
    "ASP.NET Core",
    "RAG / Retrieval",
    "LLM Integration",
    "Structured Output",
  ],
  githubUrl: "https://github.com/jkhaynes/PokeJudge",
};

export const lootSinglesProject: Project = {
  title: "Loot Singles Fulfillment",
  status: "In Development",
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
};

export const projects: Project[] = [pokeJudgeProject, lootSinglesProject];
