import { expect, test } from "@playwright/test";
import { impactMetrics } from "../../src/data/impact";

const ROLE = "Senior Software Engineer · C#/.NET · Backend + Full Stack";
const TAGLINE = "I build reliable software for messy, real-world problems.";
const BIO =
  "9+ years building and modernizing production .NET systems, with AI used inside a disciplined engineering process.";

test.describe("hero copy and actions", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
  });

  test("has exactly one h1 greeting", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(/Hi, I.m Jessica/);
  });

  test("shows the role line, tagline and bio inside the hero", async ({
    page,
  }) => {
    const hero = page.locator("section.portfolio-hero");
    await expect(hero.getByText(ROLE, { exact: true })).toBeVisible();
    await expect(hero.getByText(TAGLINE, { exact: true })).toBeVisible();
    await expect(hero.getByText(BIO, { exact: true })).toBeVisible();
  });

  test("View Featured Work jumps to the projects heading", async ({ page }) => {
    const link = page
      .locator("section.portfolio-hero")
      .getByRole("link", { name: "View Featured Work" });
    await expect(link).toHaveAttribute("href", "#projects");
    await link.click();
    await expect(page.locator("#projects-heading")).toBeFocused();
  });

  test("Download Resume opens the PDF in a new tab", async ({ page }) => {
    const link = page
      .locator("section.portfolio-hero")
      .getByRole("link", { name: "Download Resume" });
    await expect(link).toHaveAttribute("href", "/Jessica_Haynes_Resume.pdf");
    await expect(link).toHaveAttribute("target", "_blank");
  });

  test("contact links keep their targets", async ({ page }) => {
    const hero = page.locator("section.portfolio-hero");
    await expect(hero.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:jkhaynes2390@gmail.com",
    );
    await expect(hero.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/jkhaynes",
    );
    await expect(hero.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://linkedin.com/in/jesshaynes",
    );
  });

  test("the four impact numbers live in the hero", async ({ page }) => {
    const links = page
      .locator("section.portfolio-hero")
      .getByRole("link", { name: /^Impact metric:/ });
    await expect(links).toHaveCount(4);
    for (const [i, metric] of impactMetrics.entries()) {
      const link = links.nth(i);
      await expect(link).toHaveAttribute("href", metric.href);
      await expect(link).toContainText(metric.value);
      await expect(link).toContainText(metric.label);
      await expect(link).toContainText("View evidence");
    }
  });

  test("the separate impact section is gone and projects follows the hero", async ({
    page,
  }) => {
    await expect(page.locator("#impact")).toHaveCount(0);
    await expect(
      page.locator("section.portfolio-hero + section"),
    ).toHaveAttribute("id", "projects");
  });

  test("the copy is centered in the hero at 1280px", async ({ page }) => {
    const hero = (await page.locator("section.portfolio-hero").boundingBox())!;
    const h1 = (await page.locator("h1").boundingBox())!;
    expect(
      Math.abs(h1.x + h1.width / 2 - (hero.x + hero.width / 2)),
    ).toBeLessThanOrEqual(2);
  });
});

test.describe("hero without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("still renders the copy, actions and contact links", async ({
    page,
  }) => {
    await page.goto("/");
    const hero = page.locator("section.portfolio-hero");
    await expect(page.locator("h1")).toHaveText(/Hi, I.m Jessica/);
    await expect(hero.getByText(ROLE, { exact: true })).toBeVisible();
    await expect(
      hero.getByRole("link", { name: "View Featured Work" }),
    ).toHaveAttribute("href", "#projects");
    await expect(
      hero.getByRole("link", { name: "Download Resume" }),
    ).toHaveAttribute("href", "/Jessica_Haynes_Resume.pdf");
    await expect(hero.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:jkhaynes2390@gmail.com",
    );
    await expect(hero.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/jkhaynes",
    );
    await expect(hero.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://linkedin.com/in/jesshaynes",
    );
    const impact = hero.getByRole("link", { name: /^Impact metric:/ });
    await expect(impact).toHaveCount(4);
    for (const [i, metric] of impactMetrics.entries()) {
      await expect(impact.nth(i)).toHaveAttribute("href", metric.href);
    }
  });
});
