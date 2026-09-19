import { expect, test } from "@playwright/test";

test("primary nav links are Work, Experience, About and Contact", async ({
  page,
}) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  const names = await nav
    .getByRole("link")
    .evaluateAll((links) => links.map((link) => link.textContent?.trim()));
  expect(names).toEqual(["Work", "Experience", "About", "Contact"]);
  await expect(nav.getByRole("link", { name: "Work" })).toHaveAttribute(
    "href",
    "/#projects",
  );
  await expect(nav.getByRole("link", { name: "About" })).toHaveAttribute(
    "href",
    "/#about",
  );
});

test("the résumé lives in the page, not the nav", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await expect(
    page.getByRole("banner").getByRole("link", { name: /Résumé|Resume/ }),
  ).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Download Resume" }).first()).toBeVisible();
});

test("the nav marks the section in view as the current location", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });

  await page.evaluate(() =>
    document.getElementById("about")!.scrollIntoView({ block: "start" }),
  );
  await expect(nav.getByRole("link", { name: "About" })).toHaveAttribute(
    "aria-current",
    "location",
  );
  await expect(nav.locator('[aria-current="location"]')).toHaveCount(1);

  await page.evaluate(() =>
    document.getElementById("projects")!.scrollIntoView({ block: "start" }),
  );
  await expect(nav.getByRole("link", { name: "Work" })).toHaveAttribute(
    "aria-current",
    "location",
  );
  await expect(nav.locator('[aria-current="location"]')).toHaveCount(1);
});
