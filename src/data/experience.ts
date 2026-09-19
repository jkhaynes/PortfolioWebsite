export type ExperienceBullet = {
  text: string;
  anchorId?: string;
};

export type ExperienceRole = {
  role: string;
  /** The label on this role's stop in the career line. */
  shortRole: string;
  period: string;
  bullets: Array<string | ExperienceBullet>;
  /** A stable, focusable link target for the career line and Impact deep links. */
  anchorId?: string;
};

export type ExperienceCompany = {
  company: string;
  location: string;
  tags: string[];
  roles: ExperienceRole[];
  /** Folded behind "Earlier roles" in the Experience section. */
  earlier?: true;
};

// Newest first, as the section reads.
export const experience: ExperienceCompany[] = [
  {
    company: "8am",
    location: "Austin, TX / Remote",
    tags: [".NET", "C#", "MySQL", "Entity Framework", "Angular"],
    roles: [
      {
        role: "Team Lead / Senior Software Engineer IV",
        shortRole: "Team Lead / Senior IV",
        period: "Jan 2024 – Present",
        anchorId: "experience-8am-team-lead",
        bullets: [
          {
            text: "Led a cross-functional team of 4, driving a quality-focused culture shift that achieved 6+ months of incident-free production and a 50% drop in support escalations",
            anchorId: "impact-support-escalations",
          },
          "Spearheaded the team's adoption of agentic AI coding tools (Claude Code, GitHub Copilot), improving engineering efficiency and TDD adoption",
          "Improved onboarding for QA and developers by overhauling documentation and establishing clearer project standards",
        ],
      },
      {
        role: "Senior Software Engineer III",
        shortRole: "Senior III",
        period: "Mar 2022 – Jan 2024",
        anchorId: "experience-8am-senior-iii",
        bullets: [
          {
            text: "Optimized a high-volume nightly job, cutting runtime by 95%",
            anchorId: "impact-nightly-job",
          },
          "Implemented Single Sign-On (SSO) for the payment processor, integrating with clients' existing identity providers to streamline authentication",
        ],
      },
    ],
  },
  {
    company: "Proplanner.net",
    location: "Ames, IA",
    tags: ["C#", ".NET Core", "SAML", "OIDC"],
    roles: [
      {
        role: "Lead Developer",
        shortRole: "Lead Developer",
        period: "Jan 2020 – Mar 2022",
        anchorId: "experience-proplanner-lead-developer",
        bullets: [
          "Designed and supported an Identity and Access Management service, configuring SAML/OIDC connections for all clients",
          {
            text: "Led a team that reduced security vulnerabilities by 81% across all applications",
            anchorId: "impact-security-flaws",
          },
          "Engaged directly with clients to gather feature requirements and resolve deployment issues",
        ],
      },
    ],
  },
  {
    company: "Growers Edge",
    earlier: true,
    location: "West Des Moines, IA",
    tags: [".NET Core", "Angular 7", "Azure"],
    roles: [
      {
        role: "Senior Software Engineer (Team Lead)",
        shortRole: "Senior Developer",
        anchorId: "experience-growers-edge-senior-developer",
        period: "Feb 2019 – Jan 2020",
        bullets: [
          "Served as technical lead across multiple projects, owning design and delivery",
          "Trained and mentored junior engineers in programming methodologies and best practices",
          "Collaborated with product owners to proactively identify risks and recommend alternative technical solutions",
        ],
      },
    ],
  },
  {
    company: "Proplanner.net",
    location: "Ames, IA",
    tags: [".NET", "ASP.NET Web API", "Angular 4+"],
    earlier: true,
    roles: [
      {
        role: "Senior Software Developer",
        shortRole: "Senior Developer",
        anchorId: "experience-proplanner-senior-developer",
        period: "Dec 2017 – Feb 2019",
        bullets: [
          "Increased the client base by 200% by leading a platform modernization initiative",
          "Prioritized and assigned tasks to a small team of developers",
          "Decreased time spent on support by creating a program to help automate the build process",
        ],
      },
      {
        role: "Programmer",
        shortRole: "Programmer",
        anchorId: "experience-proplanner-programmer",
        period: "May 2016 – Dec 2017",
        bullets: [
          "Built and maintained features for a .NET Windows desktop application, including third-party integrations and rapid resolution of critical issues",
        ],
      },
    ],
  },
];
