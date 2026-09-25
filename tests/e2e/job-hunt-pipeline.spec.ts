import { expect, test } from "@playwright/test";

const TEMPLATE = "https://github.com/jkhaynes/job-hunt-pipeline-template";

test("Job Hunt Pipeline card opens its case study and returns to featured projects", async ({
  page,
}) => {
  await page.goto("/");
  const card = page.locator("[data-project-card]").filter({
    has: page.getByRole("heading", { name: "Job Hunt Pipeline", exact: true }),
  });
  await card.getByRole("link", { name: "Job Hunt Pipeline" }).click();
  await expect(page).toHaveURL(/\/work\/job-hunt-pipeline$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Job Hunt Pipeline");
  await page.getByRole("link", { name: "Explore more projects" }).click();
  await expect(page).toHaveURL(/\/#projects$/);
});

test("Job Hunt Pipeline case study shows the run, the funnel and links only to the template", async ({
  page,
}) => {
  await page.goto("/work/job-hunt-pipeline");
  await expect(page).toHaveTitle("Job Hunt Pipeline Case Study | Jessica Haynes");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.jessbuilds.dev/work/job-hunt-pipeline",
  );

  const hero = page.locator(".case-card-back");
  await expect(hero.getByText("Live", { exact: true })).toBeVisible();
  await expect(hero.getByRole("link", { name: /View the template/ })).toHaveAttribute(
    "href",
    TEMPLATE,
  );

  await expect(
    page.getByRole("list", { name: "Job Hunt Pipeline run" }).getByRole("listitem"),
  ).toHaveCount(6);
  await expect(page.getByText("It never contacts anyone.")).toBeVisible();
  await expect(
    page.getByRole("img", { name: "181 roles screened, 16 surfaced, 7 applications" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "A few weeks of tuning" })).toBeVisible();

  // Only the public template: never the private repo.
  const hrefs = await page.locator("a[href*='github.com']").evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")),
  );
  expect(hrefs.length).toBeGreaterThan(0);
  expect(new Set(hrefs)).toEqual(new Set([TEMPLATE]));

  const media = page.getByRole("button", {
    name: "View larger: Job Hunt Pipeline digest",
    exact: true,
  });
  await media.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(media).toBeFocused();
});
