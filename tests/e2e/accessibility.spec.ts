import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/", "/work/loot-singles", "/work/pokejudge"] as const;
const themes = ["light", "dark"] as const;

for (const route of routes) {
  for (const theme of themes) {
    test(`${route} has no automated accessibility violations in ${theme} mode`, async ({
      page,
    }) => {
      await page.addInitScript(
        ({ value }) => localStorage.setItem("jessbuilds-theme", value),
        { value: theme },
      );
      await page.goto(route);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
}

for (const route of routes) {
  test(`${route} has a coherent document outline and working skip link`, async ({
    page,
  }) => {
    await page.goto(route);

    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    const headingLevels = await page
      .locator("h1, h2, h3, h4, h5, h6")
      .evaluateAll((headings) =>
        headings.map((heading) => Number(heading.tagName.slice(1))),
      );
    for (let index = 1; index < headingLevels.length; index += 1) {
      expect(headingLevels[index] - headingLevels[index - 1]).toBeLessThanOrEqual(
        1,
      );
    }

    const ids = await page.locator("[id]").evaluateAll((elements) =>
      elements.map((element) => element.id),
    );
    expect(new Set(ids).size).toBe(ids.length);

    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await expect(skipLink).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });
}

test("public routes emit unique canonical and social metadata", async ({ page }) => {
  const expected = [
    {
      route: "/",
      canonical: "https://www.jessbuilds.dev",
      title: "Jessica Haynes | Software Engineer",
    },
    {
      route: "/work/loot-singles",
      canonical: "https://www.jessbuilds.dev/work/loot-singles",
      title: "Loot Singles Fulfillment Case Study | Jessica Haynes",
    },
    {
      route: "/work/pokejudge",
      canonical: "https://www.jessbuilds.dev/work/pokejudge",
      title: "PokéJudge AI Case Study | Jessica Haynes",
    },
  ] as const;

  for (const entry of expected) {
    await page.goto(entry.route);
    await expect(page).toHaveTitle(entry.title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      entry.canonical,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      entry.title,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      entry.canonical,
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      "content",
      entry.title,
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.{40,}/,
    );
    await expect(
      page.locator('meta[property="og:description"]'),
    ).toHaveAttribute("content", /.{40,}/);
    await expect(
      page.locator('meta[name="twitter:description"]'),
    ).toHaveAttribute("content", /.{40,}/);
  }
});

test("local assets and new-tab links expose safe contracts", async ({ page }) => {
  await page.goto("/");

  const resume = page.getByRole("link", { name: /Download Resume/ }).first();
  const resumeHref = await resume.getAttribute("href");
  expect(resumeHref).toBe("/Jessica_Haynes_Resume.pdf");
  const response = await page.request.get(resumeHref!);
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("application/pdf");

  const blankLinks = page.locator('a[target="_blank"]');
  const count = await blankLinks.count();
  expect(count).toBeGreaterThan(0);
  for (let index = 0; index < count; index += 1) {
    const link = blankLinks.nth(index);
    await expect(link).toHaveAttribute("rel", /noopener/);
    await expect(link).toContainText("opens in a new tab");
  }

  for (const selector of ['a[href^="#"]', 'a[href^="/#"]']) {
    const links = page.locator(selector);
    for (let index = 0; index < (await links.count()); index += 1) {
      const href = await links.nth(index).getAttribute("href");
      const hash = href?.split("#")[1];
      if (hash) await expect(page.locator(`#${hash}`)).toHaveCount(1);
    }
  }
});

test("forced colors preserve visible controls and dialog focus", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("/");

  const themeToggle = page.getByRole("button", { name: /Switch to .* theme/ });
  await themeToggle.focus();
  await expect(themeToggle).toBeFocused();
  await expect(themeToggle).toHaveCSS("outline-style", "solid");

  const mediaTrigger = page.getByRole("button", { name: /^View larger:/ }).first();
  await mediaTrigger.click();
  const close = page.getByRole("dialog").getByRole("button", { name: "Close" });
  await expect(close).toBeFocused();
  await expect(close).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(mediaTrigger).toBeFocused();
});

test("both themes reflow at 320px without page-level overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });

  for (const theme of themes) {
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(
        ({ value }) => localStorage.setItem("jessbuilds-theme", value),
        { value: theme },
      );
      await page.reload();
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        )
        .toBe(true);
    }
  }

  await page.goto("/");
  await page.getByRole("button", { name: /^View larger:/ }).first().click();
  await expect(
    page.getByRole("dialog").getByRole("button", { name: "Close" }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
});
