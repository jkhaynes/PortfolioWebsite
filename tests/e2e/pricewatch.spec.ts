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

  await expect(hero).toContainText("Go, SQLite, GitHub Actions, PokéWallet API, MCP");
  await expect(page.getByText(/about 9% of the collection/)).toHaveCount(0);
  await expect(page.getByText(/about 3% of the collection/)).toBeVisible();

  const media = page.getByRole("button", { name: "View larger: pricewatch status page" });
  await media.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(media).toBeFocused();
});

test("pricewatch case study shows a real conversation with the MCP server", async ({
  page,
}) => {
  await page.goto("/work/pricewatch");
  await expect(
    page.getByRole("heading", { level: 2, name: "Questions in plain English" }),
  ).toBeVisible();

  const chat = page.getByRole("list", { name: "Example conversation with pricewatch" });
  await expect(
    chat.getByText("Which Pokémon is worth the most across every card I own?"),
  ).toBeVisible();
  await expect(chat.getByText("Is TCG Collector overvaluing my chase cards?")).toBeVisible();
  await expect(chat.getByText(/Pikachu, by a long way/)).toBeVisible();
  await expect(chat.getByText("data_as_of Oct 5, 2026")).toBeVisible();

  for (const name of [
    "Read-only, enforced by SQLite",
    "Every answer is dated",
    "Prints stay separate",
  ]) {
    await expect(page.getByRole("heading", { level: 3, name })).toBeVisible();
  }
});
