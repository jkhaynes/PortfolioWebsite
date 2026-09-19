import { expect, test } from "@playwright/test";

const SET = [
  { path: "/work/pokejudge", next: "Loot Singles Fulfillment", other: "Loot Membership Integration", n: 1 },
  { path: "/work/loot-singles", next: "Loot Membership Integration", other: "PokéJudge AI", n: 2 },
  { path: "/work/loot-membership", next: "PokéJudge AI", other: "Loot Singles Fulfillment", n: 3 },
] as const;

for (const { path, next, other, n } of SET) {
  test(`${path} deals the rest of the set`, async ({ page }) => {
    await page.goto(path);
    const section = page.getByRole("region", { name: "Next in the set" });
    await expect(section.getByRole("heading", { level: 2 })).toHaveText("Next in the set");

    const cards = section.locator("[data-project-card]");
    await expect(cards).toHaveCount(2);
    await expect(cards.nth(0).getByRole("link")).toHaveAccessibleName(next);
    await expect(cards.nth(1).getByRole("link")).toHaveAccessibleName(other);
    await expect(section).toContainText(`Case study ${n} of 3. Up next: ${next}.`);

    await expect(section.getByRole("link", { name: "Email Me" })).toHaveAttribute(
      "href",
      "mailto:jkhaynes2390@gmail.com",
    );
    // The set sits after the page's own closing links.
    await expect(page.getByRole("link", { name: "Explore more projects" })).toBeVisible();
  });
}
