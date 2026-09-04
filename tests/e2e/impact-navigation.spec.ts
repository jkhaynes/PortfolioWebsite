import { expect, test } from "@playwright/test";

const metrics = [
  {
    name: /9\+.*years of experience.*Experience/i,
    hash: "#experience-heading",
    target: "experience-heading",
    evidence: /Experience/i,
  },
  {
    name: /95%.*faster nightly job runtime.*Performance/i,
    hash: "#impact-nightly-job",
    target: "impact-nightly-job",
    evidence: /cutting runtime by 95%/i,
  },
  {
    name: /81%.*fewer security flaws.*Application Security/i,
    hash: "#impact-security-flaws",
    target: "impact-security-flaws",
    evidence: /security vulnerabilities by 81%/i,
  },
  {
    name: /50%.*fewer support escalations.*Quality & Reliability/i,
    hash: "#impact-support-escalations",
    target: "impact-support-escalations",
    evidence: /50% drop in support escalations/i,
  },
] as const;

test("impact metrics navigate to and focus their exact evidence", async ({
  page,
}) => {
  await page.goto("/");

  for (const metric of metrics) {
    const link = page.getByRole("link", { name: metric.name });
    await expect(link).toHaveAttribute("href", metric.hash);
    await link.focus();
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(new RegExp(`${metric.hash}$`));
    const target = page.locator(`#${metric.target}`);
    await expect(target).toContainText(metric.evidence);
    await expect(target).toBeFocused();
    await expect(target).toHaveCSS("animation-name", "impact-target-pulse");
    await expect
      .poll(() =>
        target.evaluate((element) => element.getBoundingClientRect().top),
      )
      .toBeGreaterThanOrEqual(64);
  }
});

test("direct fragments and browser history keep evidence aligned", async ({
  page,
}) => {
  await page.goto("/#impact-nightly-job");
  await expect(page.locator("#impact-nightly-job")).toContainText(
    /cutting runtime by 95%/i,
  );

  await page
    .getByRole("link", {
      name: /81%.*fewer security flaws.*Application Security/i,
    })
    .click();
  await expect(page).toHaveURL(/#impact-security-flaws$/);

  await page.goBack();
  await expect(page).toHaveURL(/#impact-nightly-job$/);
  await expect(page.locator("#impact-nightly-job")).toBeInViewport();
});

test("reduced motion keeps a non-animated target cue", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await page.getByRole("link", { name: /50%.*Quality & Reliability/i }).click();

  const target = page.locator("#impact-support-escalations");
  await expect(target).toBeFocused();
  await expect(target).toHaveCSS("animation-name", "none");
  await expect(target).toHaveCSS("outline-style", "solid");
});

for (const viewport of [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
]) {
  test(`impact links avoid overflow at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    await expect(
      page.getByRole("link", { name: /Impact metric:/i }),
    ).toHaveCount(4);
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      )
      .toBe(true);
  });
}
