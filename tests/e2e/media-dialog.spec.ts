import { expect, test } from "@playwright/test";

test("media dialog opens the selected project image and restores focus", async ({
  page,
}) => {
  await page.goto("/");

  const pokeJudgeTrigger = page.getByRole("button", {
    name: "View larger: PokéJudge clarification run",
  });
  const dialogId = await pokeJudgeTrigger.getAttribute("commandfor");
  expect(dialogId).toBeTruthy();
  await expect(page.locator(`[id="${dialogId}"]`)).toHaveAttribute(
    "aria-label",
    "PokéJudge clarification run",
  );
  await pokeJudgeTrigger.click();

  const dialog = page.getByRole("dialog", {
    name: "PokéJudge clarification run",
  });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await expect(
    dialog.getByRole("img", { name: /late-arrival scenario/i }),
  ).toBeVisible();

  await page.keyboard.press("Tab");
  await expect
    .poll(() =>
      dialog.evaluate(
        (element) =>
          element === document.activeElement ||
          element.contains(document.activeElement),
      ),
    )
    .toBe(true);
  await page.keyboard.press("Shift+Tab");
  await expect
    .poll(() =>
      dialog.evaluate(
        (element) =>
          element === document.activeElement ||
          element.contains(document.activeElement),
      ),
    )
    .toBe(true);

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(pokeJudgeTrigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");

  const lootTrigger = page.getByRole("button", {
    name: "View larger: Loot Singles order detail",
  });
  await lootTrigger.click();
  await expect(
    page
      .getByRole("dialog", { name: "Loot Singles order detail" })
      .getByRole("img", { name: /sample-order cards/i }),
  ).toBeVisible();
  await page
    .getByRole("dialog", { name: "Loot Singles order detail" })
    .getByRole("button", { name: "Close" })
    .click();
  await expect(lootTrigger).toBeFocused();
});

for (const viewport of [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
]) {
  test(`media layouts avoid page overflow at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);

    for (const path of [
      "/",
      "/work/loot-singles",
      "/work/pokejudge",
      "/work/loot-membership",
    ]) {
      await page.goto(path);
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        )
        .toBe(true);

      const trigger = page
        .getByRole("button", { name: /^View larger:/ })
        .first();
      await trigger.click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        )
        .toBe(true);
      await page.keyboard.press("Escape");
    }
  });
}

test("featured project media preserves all case-study actions", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "View Case Study" })).toHaveCount(
    3,
  );
  await expect(page.getByRole("button", { name: /^View larger:/ })).toHaveCount(
    3,
  );

  await expect(page.locator('link[rel="preload"][as="image"]')).toHaveCount(1);
  await expect(
    page
      .getByRole("button", { name: "View larger: PokéJudge clarification run" })
      .getByRole("img"),
  ).not.toHaveAttribute("loading", "lazy");
  await expect(
    page
      .getByRole("button", { name: "View larger: Loot Singles order detail" })
      .getByRole("img"),
  ).toHaveAttribute("loading", "lazy");
});
