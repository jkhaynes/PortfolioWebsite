import { expect, test } from "@playwright/test";

const STOPS = [
  { role: "Programmer", meta: "Proplanner · 2016", href: "#experience-proplanner-programmer" },
  { role: "Senior Developer", meta: "Proplanner · 2017", href: "#experience-proplanner-senior-developer", promoted: true },
  { role: "Senior Developer", meta: "Growers Edge · 2019", href: "#experience-growers-edge-senior-developer" },
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

test("roles before 2020 fold behind one closed toggle", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#experience");
  const group = section.locator("details.earlier-roles");
  await expect(group).not.toHaveAttribute("open", "");
  await expect(group.locator("summary")).toHaveText(/Earlier roles \(3\)\s*2016 – 2020/);
  // Three roles inside the fold, three in full outside it.
  await expect(group.locator("h3, h4")).toHaveText([
    "Senior Software Engineer (Team Lead), Growers Edge",
    "Proplanner.net",
    "Senior Software Developer",
    "Programmer",
  ]);
  await expect(section.locator(":is(h3, h4):not(details *)")).toHaveCount(4);
  await expect(group.getByText("Increased the client base by 200%", { exact: false })).toBeHidden();
});

test("a stop for an earlier role opens the fold and focuses that role", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /^Programmer/ }).click();
  const group = page.locator("details.earlier-roles");
  await expect(group).toHaveAttribute("open", "");
  await expect(page.locator("#experience-proplanner-programmer")).toBeFocused();
});

test("a link straight to an earlier role opens the fold", async ({ page }) => {
  await page.goto("/#experience-proplanner-programmer");
  await expect(page.locator("details.earlier-roles")).toHaveAttribute("open", "");
  await expect(page.locator("#experience-proplanner-programmer")).toBeInViewport();
});

test("Experience ends with the full résumé", async ({ page }) => {
  await page.goto("/");
  const link = page.locator("#experience").getByRole("link", { name: /View full résumé/ });
  await expect(link).toHaveAttribute("href", "/Jessica_Haynes_Resume.pdf");
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("data-umami-event", "resume_download");
});
