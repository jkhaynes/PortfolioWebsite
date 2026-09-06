import { expect, test } from "@playwright/test";

test("membership project opens its case study and returns to featured projects", async ({
  page,
}) => {
  await page.goto("/");
  const card = page.locator("[data-project-card]").filter({
    has: page.getByRole("heading", {
      name: "Loot Membership Integration",
      exact: true,
    }),
  });
  await expect(
    card.getByRole("link", { name: /GitHub|Live Demo/ }),
  ).toHaveCount(0);
  await card.getByRole("link", { name: "View Case Study" }).click();
  await expect(page).toHaveURL(/\/work\/loot-membership$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Loot Membership Integration",
  );
  await page.getByRole("link", { name: "Explore more projects" }).click();
  await expect(page).toHaveURL(/\/#projects$/);
  await expect(page.locator("#projects")).toBeInViewport();
});

test("membership case study loads directly with share metadata and an accessible architecture diagram", async ({
  page,
}) => {
  await page.goto("/work/loot-membership");
  await expect(page).toHaveTitle(
    "Loot Membership Integration Case Study | Jessica Haynes",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.jessbuilds.dev/work/loot-membership",
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://www.jessbuilds.dev/work/loot-membership",
  );
  await expect(
    page.getByRole("figure", { name: "Membership architecture", exact: true }),
  ).toBeVisible();
  await expect(
    page.locator("main").getByRole("link", { name: /GitHub|Live Demo/ }),
  ).toHaveCount(0);
  const media = page.getByRole("button", {
    name: "View larger: Loot membership tier editor",
  });
  await media.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("dialog").getByRole("button", { name: "Close" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(media).toBeFocused();
});
