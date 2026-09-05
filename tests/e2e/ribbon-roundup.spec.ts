import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

test.use({ hasTouch: true });

async function openGame(page: Page) {
  await page.goto("/");
  await expect(
    page.getByRole("radio", { name: "Light", exact: true }),
  ).toBeChecked();
  await page.getByRole("radio", { name: "Pokémon" }).click();
  await page.getByRole("button", { name: "Take a play break" }).click();
  await expect(
    page.getByRole("button", { name: "Start 30-second round" }),
  ).toBeVisible();
}

test("game is opt-in, accessible, and traps/restores focus", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Take a play break" }),
  ).toHaveCount(0);
  await page.getByRole("radio", { name: "Pokémon" }).click();
  expect(requests.some((url) => url.includes("sprite.png"))).toBe(false);
  await page.getByRole("button", { name: "Take a play break" }).click();
  const dialog = page.getByRole("dialog", { name: "Ribbon Roundup" });
  await expect(dialog).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Start 30-second round" }),
  ).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Close", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Untimed practice" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    dialog.getByRole("button", { name: "Close", exact: true }),
  ).toBeFocused();
  await expect(page.getByTestId("roundup-time")).toHaveText("30s");
  expect(
    (await new AxeBuilder({ page }).include(".roundup-dialog").analyze())
      .violations,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Take a play break" }),
  ).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("mouse movement without clicks, keyboard, pause and held touch controls", async ({
  page,
}) => {
  await openGame(page);
  await page.clock.install();
  await page.clock.pauseAt(new Date());
  await page.getByRole("button", { name: "Start 30-second round" }).click();
  const field = page.getByRole("region", { name: "Ribbon catching play area" });
  const x = () =>
    page
      .locator(".roundup-player")
      .evaluate((element) => parseFloat((element as HTMLElement).style.left));
  await expect(field).toBeFocused();
  await page.keyboard.down("ArrowRight");
  await page.clock.runFor(500);
  await page.keyboard.up("ArrowRight");
  expect(await x()).toBeGreaterThan(50);
  const rect = (await field.boundingBox())!;
  await page.mouse.move(rect.x + 20, rect.y + 80);
  expect(await x()).toBeLessThan(20);
  await page.mouse.move(rect.x + rect.width * 0.75, rect.y + 80);
  expect(await x()).toBeCloseTo(75, 0);
  await page.mouse.move(rect.x + 1, rect.y + 80);
  expect(await x()).toBe(9);
  const right = page.getByRole("button", { name: "Move right" });
  const buttonRect = (await right.boundingBox())!;
  await page.mouse.move(buttonRect.x + 20, buttonRect.y + 20);
  await page.mouse.down();
  await page.clock.runFor(500);
  await page.mouse.up();
  expect(await x()).toBeGreaterThan(20);
  await field.tap({ position: { x: rect.width / 2, y: 80 } });
  expect(await x()).toBeCloseTo(50, 0);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const pausedX = await x();
  await page.mouse.move(rect.x + rect.width * 0.9, rect.y + 80);
  expect(await x()).toBe(pausedX);
  const time = await page.getByTestId("roundup-time").textContent();
  await page.clock.runFor(5000);
  await expect(page.getByTestId("roundup-time")).toHaveText(time!);
  await page.getByRole("button", { name: "Resume" }).click();
  await expect(field).toBeFocused();
});

test("shiny ribbon transforms the sprite and blocked storage remains playable", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error("blocked");
    };
    Storage.prototype.setItem = () => {
      throw new Error("blocked");
    };
  });
  await openGame(page);
  await page.evaluate(() => {
    Math.random = () => 0.1;
  });
  await page.clock.install();
  await page.clock.pauseAt(new Date());
  await page.getByRole("button", { name: "Start 30-second round" }).click();
  const field = page.getByRole("region", { name: "Ribbon catching play area" });
  const rect = (await field.boundingBox())!;
  await field.tap({ position: { x: rect.width * 0.18, y: 80 } });
  await page.clock.runFor(15000);
  await expect(page.locator(".roundup-player")).toHaveAttribute(
    "data-shiny",
    "true",
  );
  await expect(page.getByRole("status")).toContainText("Shiny bonus");
  await page.clock.runFor(16000);
  await expect(page.getByRole("button", { name: "Play again" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Round complete");
  await expect(page.locator(".roundup-result")).toHaveAttribute(
    "data-shiny",
    "true",
  );
  await expect(
    page.getByText("Shiny ribbon found", { exact: false }),
  ).toBeVisible();
});

test("timed game finishes, saves a best, and resets for replay", async ({
  page,
}) => {
  test.setTimeout(60000);
  await openGame(page);
  await page.evaluate(() => {
    Math.random = () => 0.5;
  });
  await page.clock.install();
  await page.clock.pauseAt(new Date());
  await page.getByRole("button", { name: "Start 30-second round" }).click();
  await page.clock.runFor(31000);
  await expect(page.getByRole("button", { name: "Play again" })).toBeFocused();
  const score = Number(await page.getByTestId("roundup-score").textContent());
  expect(score).toBeGreaterThan(0);
  await expect(
    page.getByRole("heading", { name: "Ribbon Royalty" }),
  ).toBeVisible();
  await expect(page.locator(".roundup-result__score")).toContainText(
    String(score),
  );
  expect(
    await page.evaluate(() =>
      localStorage.getItem("jessbuilds-ribbon-roundup-best-v1"),
    ),
  ).toBe(String(score));
  await page.getByRole("button", { name: "Play again" }).click();
  await expect(page.getByTestId("roundup-score")).toHaveText("0");
  await expect(page.locator(".roundup-result")).toHaveCount(0);
  await expect(page.getByTestId("roundup-time")).toHaveText("30s");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Take a play break" }).click();
  await expect(page.getByText(`Timed personal best: ${score}`)).toBeVisible();
});

test("background pause needs explicit resume; theme change dismisses game", async ({
  page,
  context,
}) => {
  await openGame(page);
  await page.getByRole("button", { name: "Start 30-second round" }).click();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.getByRole("button", { name: "Resume" })).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.getByRole("button", { name: "Resume" })).toBeVisible();
  const other = await context.newPage();
  await other.goto("/");
  await other.getByRole("radio", { name: "Light", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("radio", { name: "Light", exact: true }),
  ).toBeFocused();
});

test("practice supports small screens and reduced motion without changing best", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() =>
    localStorage.setItem("jessbuilds-ribbon-roundup-best-v1", "240"),
  );
  await openGame(page);
  await page.getByRole("button", { name: "Untimed practice" }).click();
  await expect(
    page.getByText("Untimed practice", { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    (await new AxeBuilder({ page }).include(".roundup-dialog").analyze())
      .violations,
  ).toEqual([]);
  await page.getByRole("button", { name: "Finish practice" }).click();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("jessbuilds-ribbon-roundup-best-v1"),
    ),
  ).toBe("240");
  await expect(page.getByRole("status")).toContainText("Practice complete");
  await expect(
    page.getByRole("heading", { name: "Practice Pal" }),
  ).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).include(".roundup-dialog").analyze())
      .violations,
  ).toEqual([]);
});
