import { expect, test, type Page } from "@playwright/test";

const QUOTE =
  "I try to bring curiosity to my work, keep learning, and leave things better than I found them.";

async function openTheme(page: Page, theme: string) {
  await page.addInitScript(
    (value) => localStorage.setItem("jessbuilds-theme", value),
    theme,
  );
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
}

test("about merges how I work and learning now into one section", async ({
  page,
}) => {
  await page.goto("/");

  const topLevel = await page
    .locator("main > section")
    .evaluateAll((sections) => sections.map((section) => section.id));
  expect(topLevel).toContain("about");
  expect(topLevel).not.toContain("how-i-work");
  expect(topLevel).not.toContain("learning-now");

  const about = page.getByRole("region", { name: "About", exact: true });
  await expect(
    about.getByRole("heading", { level: 2, name: "About", exact: true }),
  ).toBeVisible();
  const nested = await page
    .locator("#about section")
    .evaluateAll((sections) => sections.map((section) => section.id));
  expect(nested).toEqual(["how-i-work", "learning-now"]);
  await expect(
    about.getByRole("heading", { level: 3, name: "How I work" }),
  ).toBeVisible();
  await expect(
    about.getByRole("heading", { level: 3, name: "Learning now" }),
  ).toBeVisible();

  // No numbers repeated from the hero and impact strip.
  await expect(about).not.toContainText(/9\+|95%|6\+ months/);
  await expect(page.getByText(QUOTE, { exact: true })).toHaveCount(1);
  await expect(about).not.toContainText(
    "I'm a collaborative developer who cares about quality",
  );
});

test("the learning now anchor still scrolls to its sub-section", async ({
  page,
}) => {
  await page.goto("/#learning-now");
  await expect(page.locator("#learning-now")).toBeInViewport();
});

for (const theme of ["light", "dark"] as const) {
  test(`the pokemon hint switches themes and moves focus in ${theme} mode`, async ({
    page,
  }) => {
    await openTheme(page, theme);
    const hint = page.locator(".pokemon-hint");
    await expect(hint).toContainText("Psst, there's a Pokémon mode.");
    await page.getByRole("button", { name: "Try Pokémon mode" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "pokemon");
    await expect(hint).toBeHidden();
    await expect(page.locator("#about-heading")).toBeFocused();
  });
}

test("the pokemon hint is hidden in pokemon mode", async ({ page }) => {
  await openTheme(page, "pokemon");
  await expect(page.locator(".pokemon-hint")).toBeHidden();
});
