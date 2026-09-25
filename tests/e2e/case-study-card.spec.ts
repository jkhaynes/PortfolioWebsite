import { expect, test } from "@playwright/test";

const STUDIES = [
  {
    path: "/work/job-hunt-pipeline",
    title: "Job Hunt Pipeline",
    tldr: {
      Role: "Sole developer",
      Status: "Live · runs daily on GitHub Actions",
      Outcome: "181 roles screened, 16 surfaced, 7 applications in two days",
      Stack: "C#, .NET 10, Claude, GitHub Actions, Gmail API",
    },
  },
  {
    path: "/work/pokejudge",
    title: "PokéJudge AI",
    tldr: {
      Role: "Sole developer & product designer",
      Status: "In development · local .NET console app",
      Outcome: "End-to-end pipeline with grounding validation and Source Support",
      Stack: "C#, .NET, Gemini embeddings, xUnit",
    },
  },
  {
    path: "/work/loot-singles",
    title: "Loot Singles Fulfillment",
    tldr: {
      Role: "Sole developer & product designer",
      Status: "In development · order-detail foundation built",
      Outcome: "Order detail with set, condition and variant up front",
      Stack: "React, TypeScript, ASP.NET Core, Azure SQL",
    },
  },
  {
    path: "/work/loot-membership",
    title: "Loot Membership Integration",
    tldr: {
      Role: "Sole developer & designer",
      Status: "In development",
      Outcome: "Tier editor mapping Discord roles to Shopify customer tags",
      Stack: "TypeScript, React Router, Cloudflare Workers, D1",
    },
  },
  {
    path: "/work/pricewatch",
    title: "pricewatch",
    tldr: {
      Role: "Sole developer",
      Status: "Live · runs hourly on GitHub Actions",
      Outcome: "~915 requests a day to keep 4,900 prices current",
      Stack: "Go, SQLite, GitHub Actions, PokéWallet API",
    },
  },
] as const;

for (const study of STUDIES) {
  test(`${study.title} opens as the back of its card`, async ({ page }) => {
    await page.goto(study.path);
    const hero = page.locator(".case-card-back");
    await expect(hero).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(hero.getByRole("heading", { level: 1 })).toHaveText(study.title);
    await expect(hero).toContainText("Featured build");

    const tldr = hero.locator("dl.case-tldr");
    const labels = await tldr.locator("dt").allTextContents();
    expect(labels).toEqual(["Role", "Status", "Outcome", "Stack"]);
    for (const [label, value] of Object.entries(study.tldr)) {
      await expect(
        tldr.locator("div").filter({ has: page.locator("dt", { hasText: label }) }).locator("dd"),
      ).toHaveText(value);
    }
  });
}
