import { expect, test } from "@playwright/test";

test("game bundle and sprites wait for activation; closing resets and releases input", async ({
  page,
}) => {
  const scripts: Promise<string>[] = [];
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  page.on("response", (response) => {
    if (response.request().resourceType() === "script")
      scripts.push(response.text().catch(() => ""));
  });
  await page.goto("/");
  await expect(
    page.getByRole("radio", { name: "Light", exact: true }),
  ).toBeChecked();
  await page.getByRole("radio", { name: "Pokémon" }).click();
  await expect(
    page.getByRole("button", { name: "Take a play break" }),
  ).toBeVisible();
  expect(
    (await Promise.all(scripts)).some((text) =>
      text.includes("jessbuilds-ribbon-roundup-best-v1"),
    ),
  ).toBe(false);
  expect(requests.some((url) => url.includes("sprite.png"))).toBe(false);
  await page.getByRole("button", { name: "Take a play break" }).click();
  await page.getByRole("button", { name: "Start 30-second round" }).click();
  expect(
    (await Promise.all(scripts)).some((text) =>
      text.includes("jessbuilds-ribbon-roundup-best-v1"),
    ),
  ).toBe(true);
  await page.keyboard.down("ArrowRight");
  await page.keyboard.press("Escape");
  await page.keyboard.up("ArrowRight");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Take a play break" }).click();
  await expect(page.getByTestId("roundup-time")).toHaveText("30s");
  await expect(page.getByTestId("roundup-score")).toHaveText("0");
  await page.goto("/work/pokejudge");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("slow portrait loading preserves its allocated space without hydration errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/images/pokemon/sylveon.png", async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto("/");
  await expect(
    page.getByRole("radio", { name: "Light", exact: true }),
  ).toBeChecked();
  await page.getByRole("radio", { name: "Pokémon" }).click();
  await page.evaluate(() => document.fonts.ready);
  const portrait = page.locator(".sylveon-portrait");
  const before = await portrait.boundingBox();
  expect(
    await page
      .getByAltText(/Sylveon with pink bows/)
      .evaluate((image) => (image as HTMLImageElement).naturalWidth),
  ).toBe(0);
  release();
  await expect
    .poll(() =>
      page
        .getByAltText(/Sylveon with pink bows/)
        .evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  expect(await portrait.boundingBox()).toEqual(before);
  expect(errors).toEqual([]);
});

test("dialog reflows at small sizes and doubled zoom with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("radio", { name: "Light", exact: true }),
  ).toBeChecked();
  await page.getByRole("radio", { name: "Pokémon" }).click();
  await page.getByRole("button", { name: "Take a play break" }).click();
  await expect(
    page.getByRole("button", { name: "Untimed practice" }),
  ).toBeVisible();
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width < 400 ? 568 : 900 });
    const dialog = page.getByRole("dialog");
    const box = (await dialog.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
    expect(
      await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
    await page
      .getByRole("button", { name: "Untimed practice" })
      .scrollIntoViewIfNeeded();
  }
  await page.evaluate(() => {
    document.documentElement.style.zoom = "2";
  });
  const zoomed = (await page.getByRole("dialog").boundingBox())!;
  expect(zoomed.x).toBeGreaterThanOrEqual(0);
  expect(zoomed.x + zoomed.width).toBeLessThanOrEqual(1441);
  expect(zoomed.y).toBeGreaterThanOrEqual(0);
  expect(zoomed.y + zoomed.height).toBeLessThanOrEqual(901);
  await page.getByRole("button", { name: "Untimed practice" }).click();
  expect(
    await page.locator(".roundup-player").evaluate((el) => {
      el.setAttribute("data-shiny", "true");
      return getComputedStyle(el, "::after").display;
    }),
  ).toBe("none");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Take a play break" }),
  ).toBeFocused();
});
