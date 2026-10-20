import { expect, test, type Page } from "@playwright/test";

async function openTheme(page: Page, theme: string, width: number) {
  await page.setViewportSize({ width, height: 900 });
  await page.addInitScript(
    (value) => localStorage.setItem("jessbuilds-theme", value),
    theme,
  );
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
}

test("pokemon keeps Sylveon in the hero instead of the portrait", async ({
  page,
}) => {
  await openTheme(page, "pokemon", 1280);
  await expect(page.locator(".sylveon-portrait")).toBeVisible();
});
