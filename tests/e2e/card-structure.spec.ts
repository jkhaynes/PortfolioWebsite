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
