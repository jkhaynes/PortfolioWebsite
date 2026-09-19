import { expect, test, type Page } from "@playwright/test";

const PHOTO = "/images/jessica-haynes-portrait.webp";

async function openTheme(page: Page, theme: string, width: number) {
  await page.setViewportSize({ width, height: 900 });
  await page.addInitScript(
    (value) => localStorage.setItem("jessbuilds-theme", value),
    theme,
  );
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
}

for (const theme of ["light", "dark"] as const) {
  test(`hero portrait sits beside the intro on desktop in ${theme} mode`, async ({
    page,
  }) => {
    await openTheme(page, theme, 1280);
    const portrait = page.getByRole("img", { name: "Portrait of Jessica Haynes" });
    await expect(portrait).toBeVisible();
    await expect
      .poll(() => portrait.evaluate((img) => (img as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);
    const copy = (await page.locator(".hero-copy").boundingBox())!;
    const photo = (await portrait.boundingBox())!;
    expect(photo.x).toBeGreaterThan(copy.x + copy.width);
  });

  test(`hero portrait is hidden and never loaded on mobile in ${theme} mode`, async ({
    page,
  }) => {
    const requests: string[] = [];
    page.on("request", (request) => requests.push(request.url()));
    await openTheme(page, theme, 390);
    await expect(page.locator(".hero-portrait")).toBeHidden();
    await page.waitForLoadState("networkidle");
    expect(requests.some((url) => url.includes(PHOTO))).toBe(false);
  });
}

test("pokemon keeps Sylveon in the hero instead of the portrait", async ({
  page,
}) => {
  await openTheme(page, "pokemon", 1280);
  await expect(page.locator(".hero-portrait")).toBeHidden();
  await expect(page.locator(".sylveon-portrait")).toBeVisible();
});
