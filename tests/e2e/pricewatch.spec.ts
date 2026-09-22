import { expect, test } from "@playwright/test";

test("pricewatch card opens its case study and returns to featured projects", async ({
  page,
}) => {
  await page.goto("/");
  const card = page.locator("[data-project-card]").filter({
    has: page.getByRole("heading", { name: "pricewatch", exact: true }),
  });
  await card.getByRole("link", { name: "pricewatch" }).click();
  await expect(page).toHaveURL(/\/work\/pricewatch$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("pricewatch");
  await page.getByRole("link", { name: "Explore more projects" }).click();
  await expect(page).toHaveURL(/\/#projects$/);
});

test("pricewatch case study shows the run, links out and opens the status page screenshot", async ({
  page,
}) => {
  await page.goto("/work/pricewatch");
  await expect(page).toHaveTitle("pricewatch Case Study | Jessica Haynes");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.jessbuilds.dev/work/pricewatch",
  );

  const hero = page.locator(".case-card-back");
  await expect(hero.getByText("Live", { exact: true })).toBeVisible();
  await expect(hero.getByRole("link", { name: /View GitHub/ })).toHaveAttribute(
    "href",
    "https://github.com/jkhaynes/pricewatch",
  );
  await expect(hero.getByRole("link", { name: /Live status page/ })).toHaveAttribute(
    "href",
    "https://jkhaynes.github.io/pricewatch-site",
  );
  await expect(hero.getByRole("figure", { name: "pricewatch run output" })).toContainText(
    "4886 cards not due yet",
  );

  await expect(page.getByRole("heading", { name: "Match the cards it can't price yet" })).toBeVisible();
  await expect(page.getByText(/job queue|TCGdex/i)).toHaveCount(0);

  const media = page.getByRole("button", { name: "View larger: pricewatch status page" });
  await media.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(media).toBeFocused();
});
