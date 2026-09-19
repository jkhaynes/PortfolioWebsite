import { expect, test } from "@playwright/test";

const STOPS = [
  { role: "Programmer", meta: "Proplanner · 2016", href: "#experience-proplanner-programmer" },
  { role: "Senior Developer", meta: "Proplanner · 2017", href: "#experience-proplanner-senior-developer", promoted: true },
  { role: "Team Lead", meta: "Growers Edge · 2019", href: "#experience-growers-edge-team-lead" },
  { role: "Lead Developer", meta: "Proplanner · 2020", href: "#experience-proplanner-lead-developer" },
  { role: "Senior III", meta: "8am · 2022", href: "#experience-8am-senior-iii" },
  { role: "Team Lead / Senior IV", meta: "8am · 2024 – now", href: "#experience-8am-team-lead", promoted: true },
];

test("the career line shows every role oldest first, marking promotions", async ({ page }) => {
  await page.goto("/");
  const line = page.getByRole("list", { name: "Career path, 2016 to now" });
  const stops = line.getByRole("listitem");
  await expect(stops).toHaveCount(STOPS.length);

  for (const [i, stop] of STOPS.entries()) {
    const item = stops.nth(i);
    const link = item.getByRole("link");
    await expect(link).toHaveAttribute("href", stop.href);
    await expect(item).toContainText(stop.role);
    await expect(item).toContainText(stop.meta);
    await expect(link).toHaveAccessibleName(
      new RegExp(`^${stop.role.replace(/[/]/g, "\\/")}.*${stop.promoted ? "promoted" : ""}`),
    );
  }
  // "promoted" sits on the track only where it applies.
  await expect(line.getByText("promoted", { exact: true })).toHaveCount(2);

  // Only the current role is marked as the current step.
  await expect(line.locator('[aria-current="step"]')).toHaveCount(1);
  await expect(stops.last().getByRole("link")).toHaveAttribute("aria-current", "step");
});

test("reduced motion keeps the current stop still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const current = page.locator('.career-line [aria-current="step"] .career-stop__dot');
  await expect(current).toBeVisible();
  expect(await current.evaluate((el) => el.getAnimations().length)).toBe(0);
});

test("on a phone the line scrolls inside its own row", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const line = page.locator(".career-line");
  await line.scrollIntoViewIfNeeded();
  expect(await line.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBe(true);
});
