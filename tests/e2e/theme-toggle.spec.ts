import { expect, test } from "@playwright/test";

const storageKey = "jessbuilds-theme";

test("follows the system until an explicit choice", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(
    page.getByRole("radio", { name: "Dark", exact: true }),
  ).toBeChecked();
  await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(
    page.getByRole("radio", { name: "Light", exact: true }),
  ).toBeChecked();
});

for (const [theme, label] of [
  ["light", "Light"],
  ["dark", "Dark"],
  ["pokemon", "Pokémon"],
] as const) {
  test(`${theme} persists across reloads and routes`, async ({ page }) => {
    await page.goto("/");
    await page.getByRole("radio", { name: label, exact: true }).click();
    await expect
      .poll(() => page.evaluate((key) => localStorage.getItem(key), storageKey))
      .toBe(theme);
    for (const path of ["/", "/work/pokejudge", "/work/loot-singles"]) {
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(
        page.getByRole("radio", { name: label, exact: true }),
      ).toBeChecked();
      await expect(page.locator("html")).toHaveCSS(
        "color-scheme",
        theme === "dark" ? "dark" : "light",
      );
    }
    await page.reload();
    await page.emulateMedia({ colorScheme: "dark" });
    await page.emulateMedia({ colorScheme: "light" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  });
}

test("ignores an invalid stored theme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(
    (key) => localStorage.setItem(key, "ultraviolet"),
    storageKey,
  );
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("Pokémon is initialized before hydration", async ({ browser }) => {
  // Block app bundles, but allow the inline initializer to run.
  const page = await browser.newPage();
  await page.addInitScript(
    (key) => localStorage.setItem(key, "pokemon"),
    storageKey,
  );
  await page.route("**/_next/static/**/*.js*", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "pokemon");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    "content",
    "#fff5f5",
  );
  await expect(page.locator(".sylveon-portrait")).toBeVisible();
  await page.close();
});

test("blocked storage preserves the current explicit choice", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error("blocked");
    };
    Storage.prototype.setItem = () => {
      throw new Error("blocked");
    };
  });
  await page.goto("/");
  await page.getByRole("radio", { name: "Pokémon" }).click();
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "pokemon");
  await page.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "pokemon");
});

test("cross-tab choices and clearing storage synchronize", async ({
  page,
  context,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const other = await context.newPage();
  await other.goto("/");
  await other.getByRole("radio", { name: "Pokémon" }).click();
  await expect(page.getByRole("radio", { name: "Pokémon" })).toBeChecked();
  await other.evaluate(() => localStorage.clear());
  await expect(
    page.getByRole("radio", { name: "Light", exact: true }),
  ).toBeChecked();
});

test("keyboard selection loads only the active theme artwork", async ({
  page,
}) => {
  const assetRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("pokemon")) assetRequests.push(request.url());
  });
  await page.goto("/");
  await expect(
    page.getByRole("radio", { name: "Light", exact: true }),
  ).toBeChecked();
  expect(assetRequests).toEqual([]);
  await page.getByRole("radio", { name: "Dark", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "Pokémon" })).toBeChecked();
  await expect(page.getByAltText(/Sylveon with pink bows/)).toBeVisible();
  await expect
    .poll(() =>
      page
        .getByAltText(/Sylveon with pink bows/)
        .evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  expect(assetRequests.some((url) => url.includes("sprite"))).toBe(false);
  await page.getByRole("radio", { name: "Light", exact: true }).click();
  await expect(page.locator(".sylveon-portrait")).toBeHidden();
});

test("three themes avoid overflow on every route", async ({ page }) => {
  test.setTimeout(120000);
  for (const theme of ["light", "dark", "pokemon"]) {
    await page.goto("/");
    await page.evaluate(({ key, theme }) => localStorage.setItem(key, theme), {
      key: storageKey,
      theme,
    });
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const path of ["/", "/work/pokejudge", "/work/loot-singles"]) {
        await page.goto(path);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        await expect
          .poll(() =>
            page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          )
          .toBe(true);
      }
    }
  }
});
