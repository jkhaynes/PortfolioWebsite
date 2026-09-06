import { expect, test } from "@playwright/test";

test("featured projects use the specimen-card motif without losing content", async ({
  page,
}) => {
  await page.goto("/");

  const cards = page.locator("[data-project-card]");
  await expect(cards).toHaveCount(3);

  const pokeJudge = cards.filter({ hasText: "PokéJudge AI" });
  const loot = cards.filter({ hasText: "Loot Singles Fulfillment" });
  await expect(pokeJudge).toHaveAttribute("data-accent-tone", "mauve");
  await expect(loot).toHaveAttribute("data-accent-tone", "rose");

  for (const card of [pokeJudge, loot]) {
    await expect(
      card.getByText("Featured build", { exact: true }),
    ).toBeVisible();
    await expect(
      card.getByText("In Development", { exact: true }),
    ).toBeVisible();
    await expect(
      card.getByRole("button", { name: /^View larger:/ }),
    ).toBeVisible();
    await expect(
      card.getByRole("link", { name: "View Case Study" }),
    ).toBeVisible();
    await expect(card.getByRole("link", { name: "View GitHub" })).toBeVisible();
    await expect(card.locator(".specimen-facet")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  }
});

test("learning themes echo the facet motif without sequence or interaction", async ({
  page,
}) => {
  await page.goto("/");

  const section = page.getByRole("region", { name: "Learning now" });
  const items = section.getByRole("listitem");
  await expect(items).toHaveCount(3);
  await expect(section.locator(".specimen-facet--quiet")).toHaveCount(3);
  await expect(section).not.toContainText(/\b0[123]\b/);
  await expect(section.getByRole("link")).toHaveCount(0);
  await expect(section.getByRole("button")).toHaveCount(0);
});

test("reduced motion keeps the static motif without lift or sheen", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const card = page.locator("[data-project-card]").first();
  await card.hover();
  await expect(card).toHaveCSS("transform", "none");
  await expect(card.locator(".project-specimen-card__surface")).toBeVisible();
  await expect(card.getByText("Featured build", { exact: true })).toBeVisible();
});

for (const viewport of [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
]) {
  test(`specimen motif avoids overflow at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.locator("[data-project-card]").first()).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      )
      .toBe(true);
  });
}
