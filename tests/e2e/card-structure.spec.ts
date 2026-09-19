import { expect, test, type Page } from "@playwright/test";

const storageKey = "jessbuilds-theme";
const SPARKLE = "/images/motif/sparkle.svg";
const BOW = "/images/pokemon/ribbon-pink.svg";

type Theme = "light" | "dark" | "pokemon";

async function openTheme(page: Page, theme: Theme) {
  await page.addInitScript(
    ([key, value]) => localStorage.setItem(key, value),
    [storageKey, theme] as const,
  );
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
}

function computed(
  page: Page,
  selector: string,
  pseudo: "::before" | "::after" | null,
  property: string,
) {
  return page
    .locator(selector)
    .first()
    .evaluate(
      (element, [pseudoElement, name]) =>
        getComputedStyle(element, pseudoElement).getPropertyValue(name),
      [pseudo, property] as const,
    );
}

for (const theme of ["light", "dark", "pokemon"] as const) {
  test(`facet icons are sparkles in ${theme} mode`, async ({ page }) => {
    await openTheme(page, theme);
    for (const selector of [
      "[data-project-card] .specimen-facet",
      "#learning-now .specimen-facet--quiet",
    ]) {
      expect(await computed(page, selector, null, "mask-image")).toContain(
        SPARKLE,
      );
    }
  });
}

for (const theme of ["light", "dark"] as const) {
  test(`brand, name divider and headers carry the sparkle in ${theme} mode`, async ({
    page,
  }) => {
    await openTheme(page, theme);
    expect(
      await computed(page, ".portfolio-brand", "::before", "mask-image"),
    ).toContain(SPARKLE);
    await expect(page.locator(".motif-divider")).toBeVisible();
    expect(
      await computed(page, ".motif-divider span", null, "mask-image"),
    ).toContain(SPARKLE);
    for (const heading of ["#projects h2", "#experience h2", "#about h2"]) {
      expect(await computed(page, heading, "::before", "mask-image")).toContain(
        SPARKLE,
      );
      expect(await computed(page, heading, "::after", "height")).toBe("1px");
    }
    // Decorative only: accessible names are unchanged.
    await expect(
      page.getByRole("heading", { level: 2, name: "Featured Projects", exact: true }),
    ).toBeVisible();
  });
}

test("pokemon keeps bows on the brand, divider and headers", async ({ page }) => {
  await openTheme(page, "pokemon");
  for (const [selector, pseudo] of [
    [".portfolio-brand", "::before"],
    ["#projects h2", "::before"],
    [".motif-divider span", null],
  ] as const) {
    expect(await computed(page, selector, pseudo, "background-image")).toContain(
      BOW,
    );
    expect(await computed(page, selector, pseudo, "mask-image")).toBe("none");
  }
});
