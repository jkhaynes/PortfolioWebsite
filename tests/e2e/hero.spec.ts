import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { impactMetrics } from "../../src/data/impact";

const ROLE = "Senior Software Engineer · C#/.NET · Backend + Full Stack";
const TAGLINE = "I build reliable software for messy, real-world problems.";
const BIO =
  "9+ years building and modernizing production .NET systems, with AI used inside a disciplined engineering process.";

test.describe("hero copy and actions", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
  });

  test("has exactly one h1 greeting", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(/Hi, I.m Jessica/);
  });

  test("shows the role line, tagline and bio inside the hero", async ({
    page,
  }) => {
    const hero = page.locator("section.portfolio-hero");
    await expect(hero.getByText(ROLE, { exact: true })).toBeVisible();
    await expect(hero.getByText(TAGLINE, { exact: true })).toBeVisible();
    await expect(hero.getByText(BIO, { exact: true })).toBeVisible();
  });

  test("View Featured Work jumps to the projects heading", async ({ page }) => {
    const link = page
      .locator("section.portfolio-hero")
      .getByRole("link", { name: "View Featured Work" });
    await expect(link).toHaveAttribute("href", "#projects");
    await link.click();
    await expect(page.locator("#projects-heading")).toBeFocused();
  });

  test("Download Resume opens the PDF in a new tab", async ({ page }) => {
    const link = page
      .locator("section.portfolio-hero")
      .getByRole("link", { name: "Download Resume" });
    await expect(link).toHaveAttribute("href", "/Jessica_Haynes_Resume.pdf");
    await expect(link).toHaveAttribute("target", "_blank");
  });

  test("contact links keep their targets", async ({ page }) => {
    const hero = page.locator("section.portfolio-hero");
    await expect(hero.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:jkhaynes2390@gmail.com",
    );
    await expect(hero.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/jkhaynes",
    );
    await expect(hero.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://linkedin.com/in/jesshaynes",
    );
  });

  test("the four impact numbers live in the hero", async ({ page }) => {
    const links = page
      .locator("section.portfolio-hero")
      .getByRole("link", { name: /^Impact metric:/ });
    await expect(links).toHaveCount(4);
    for (const [i, metric] of impactMetrics.entries()) {
      const link = links.nth(i);
      await expect(link).toHaveAttribute("href", metric.href);
      await expect(link).toContainText(metric.value);
      await expect(link).toContainText(metric.label);
      await expect(link).toContainText("View evidence");
    }
  });

  test("the separate impact section is gone and projects follows the hero", async ({
    page,
  }) => {
    await expect(page.locator("#impact")).toHaveCount(0);
    await expect(
      page.locator("section.portfolio-hero + section"),
    ).toHaveAttribute("id", "projects");
  });
});

const THEMES = ["light", "dark", "pokemon"] as const;
type Theme = (typeof THEMES)[number];

async function openTheme(
  page: Page,
  theme: Theme,
  width: number,
  height: number,
) {
  await page.addInitScript(([key, value]) => localStorage.setItem(key, value), [
    "jessbuilds-theme",
    theme,
  ] as const);
  await page.setViewportSize({ width, height });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
}

const hero = (page: Page) => page.locator("section.portfolio-hero");
const impactLinks = (page: Page) =>
  hero(page).getByRole("link", { name: /^Impact metric:/ });

async function inViewport(locator: Locator) {
  return locator.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return (
      r.top >= 0 &&
      r.left >= 0 &&
      // 1px of slack: Firefox and WebKit report fractional layout (844.00002).
      r.bottom <= window.innerHeight + 1 &&
      r.right <= window.innerWidth + 1
    );
  });
}

for (const theme of THEMES) {
  test.describe(`hero layout, ${theme}`, () => {
    test("desktop 1280x800 shows the h1, actions and impact links without scrolling", async ({
      page,
    }) => {
      await openTheme(page, theme, 1280, 800);
      const targets = [
        page.locator("h1"),
        hero(page).getByRole("link", { name: "View Featured Work" }),
        hero(page).getByRole("link", { name: "Download Resume" }),
        ...[0, 1, 2, 3].map((i) => impactLinks(page).nth(i)),
      ];
      for (const target of targets) {
        expect(await inViewport(target)).toBe(true);
      }
      // One row of four on desktop.
      const tops = await impactLinks(page).evaluateAll((els) =>
        els.map((el) => Math.round(el.getBoundingClientRect().top)),
      );
      expect(new Set(tops).size).toBe(1);
    });

    test("desktop type sizes and stats width follow the mockup", async ({
      page,
    }) => {
      await openTheme(page, theme, 1280, 800);
      const size = (selector: string) =>
        page
          .locator(selector)
          .first()
          .evaluate((el) => getComputedStyle(el).fontSize);
      expect(await size("h1")).toBe("84px");
      expect(await size(".hero-tagline")).toBe("30px");
      expect(await size(".hero-bio")).toBe("16.5px");
      const stats = (await page.locator(".hero-stats").boundingBox())!;
      expect(stats.width).toBeGreaterThan(780);
      expect(stats.width).toBeLessThanOrEqual(820.5);
    });

    test("phone 390x844 stacks full-width actions and a 2 column stats grid", async ({
      page,
    }) => {
      await openTheme(page, theme, 390, 844);
      const size = (selector: string) =>
        page
          .locator(selector)
          .first()
          .evaluate((el) => getComputedStyle(el).fontSize);
      expect(await size("h1")).toBe("40px");
      expect(await size(".hero-tagline")).toBe("21px");
      expect(await size(".hero-bio")).toBe("15.5px");

      const primary = hero(page).getByRole("link", {
        name: "View Featured Work",
      });
      const secondary = hero(page).getByRole("link", {
        name: "Download Resume",
      });
      const targets = [
        page.locator("h1"),
        page.locator(".hero-role"),
        page.locator(".hero-tagline"),
        primary,
        secondary,
      ];
      for (const target of targets) {
        expect(await inViewport(target)).toBe(true);
      }
      const a = (await primary.boundingBox())!;
      const b = (await secondary.boundingBox())!;
      expect(Math.abs(a.width - b.width)).toBeLessThanOrEqual(1);
      expect(b.y).toBeGreaterThanOrEqual(a.y + a.height - 1);

      const xs = await impactLinks(page).evaluateAll((els) =>
        els.map((el) => Math.round(el.getBoundingClientRect().left)),
      );
      expect(new Set(xs).size).toBe(2);
    });

    test("phone shows all four impact links after scrolling one viewport", async ({
      page,
    }) => {
      await openTheme(page, theme, 390, 844);
      // "Within one scroll": the distance needed to bring the last impact
      // link into view is at most one viewport height.
      const needed = await page.evaluate(() => {
        const links = document.querySelectorAll(".hero-stats-grid a");
        const last = links[links.length - 1].getBoundingClientRect();
        const distance = Math.max(0, last.bottom - window.innerHeight);
        window.scrollTo({ top: distance, behavior: "instant" });
        return { distance, viewport: window.innerHeight };
      });
      expect(needed.distance).toBeLessThanOrEqual(needed.viewport);
      for (const i of [0, 1, 2, 3]) {
        expect(await inViewport(impactLinks(page).nth(i))).toBe(true);
      }
    });

    test("320px does not scroll sideways", async ({ page }) => {
      await openTheme(page, theme, 320, 700);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(320);
    });

    for (const width of [1280, 390]) {
      test(`the h1 and tagline text are centered at ${width}px`, async ({
        page,
      }) => {
        await openTheme(page, theme, width, 844);
        const heroBox = (await hero(page).boundingBox())!;
        const heroCenter = heroBox.x + heroBox.width / 2;
        for (const selector of ["h1", ".hero-tagline"]) {
          const textCenter = await page.locator(selector).evaluate((el) => {
            const range = document.createRange();
            range.selectNodeContents(el);
            const r = range.getBoundingClientRect();
            return r.left + r.width / 2;
          });
          expect(Math.abs(textCenter - heroCenter)).toBeLessThanOrEqual(3);
          expect(
            await page
              .locator(selector)
              .evaluate((el) => getComputedStyle(el).textAlign),
          ).toBe("center");
        }
      });
    }

    test("impact links hide the category visibly but keep it in the name", async ({
      page,
    }) => {
      await openTheme(page, theme, 1280, 800);
      for (const [i, metric] of impactMetrics.entries()) {
        const link = impactLinks(page).nth(i);
        await expect(link).not.toContainText(metric.category);
        await expect(link).toHaveAttribute(
          "aria-label",
          new RegExp(`Category: ${metric.category}$`),
        );
      }
    });

    test("there is one divider in the hero, above the stats", async ({
      page,
    }) => {
      await openTheme(page, theme, 1280, 800);
      await expect(hero(page).locator(".motif-divider")).toHaveCount(1);
      await expect(
        hero(page).locator(".hero-stats .motif-divider"),
      ).toBeVisible();
    });

    test("the scroll cue is decorative and static", async ({ page }) => {
      await openTheme(page, theme, 1280, 800);
      const cue = page.locator(".hero-scroll-cue");
      await expect(cue).toHaveAttribute("aria-hidden", "true");
      await expect(cue).toBeVisible();
      expect(
        await cue.evaluate((el) => getComputedStyle(el).animationName),
      ).toBe("none");
      const box = (await cue.boundingBox())!;
      expect(box.width).toBeCloseTo(22, 0);
      expect(box.height).toBeCloseTo(34, 0);
    });

    test("tab order runs from the actions through contact links to the impact links", async ({
      page,
      browserName,
    }) => {
      await openTheme(page, theme, 1280, 800);
      await hero(page)
        .getByRole("link", { name: "View Featured Work" })
        .focus();
      const expected = [
        "Download Resume",
        "Email",
        "GitHub",
        "LinkedIn",
        ...impactMetrics.map((m) => `Impact metric: ${m.value} ${m.label}`),
      ];
      if (browserName === "webkit") {
        // WebKit's Tab skips links (Safari's default; Alt+Tab is swallowed
        // here), so the keyboard walk below cannot run. With no tabindex in
        // the hero, document order is tab order: assert that instead.
        const order = await hero(page)
          .locator("a")
          .evaluateAll((els) =>
            els.map((el) => el.getAttribute("aria-label") ?? el.textContent),
          );
        const names = ["View Featured Work", ...expected];
        expect(order).toHaveLength(names.length);
        names.forEach((name, i) => expect(order[i]?.trim()).toContain(name));
        expect(await hero(page).locator("[tabindex]").count()).toBe(0);
        return;
      }
      for (const name of expected) {
        await page.keyboard.press("Tab");
        const focused = page.locator(":focus");
        const label = await focused.evaluate(
          (el) => el.getAttribute("aria-label") ?? el.textContent ?? "",
        );
        expect(label.trim()).toContain(name);
        const outline = await focused.evaluate((el) => {
          const cs = getComputedStyle(el);
          return {
            style: cs.outlineStyle,
            width: parseFloat(cs.outlineWidth),
            shadow: cs.boxShadow,
          };
        });
        const visible =
          (outline.style !== "none" && outline.width > 0) ||
          outline.shadow !== "none";
        expect(visible).toBe(true);
      }
    });
  });
}

const ACCENTS: Record<Theme, [string, string]> = {
  light: ["rgb(184, 48, 111)", "rgb(143, 95, 134)"],
  dark: ["rgb(244, 167, 203)", "rgb(201, 160, 220)"],
  pokemon: ["rgb(172, 54, 92)", "rgb(145, 69, 96)"],
};

for (const theme of THEMES) {
  test.describe(`hero styling, ${theme}`, () => {
    test.beforeEach(async ({ page }) => {
      await openTheme(page, theme, 1280, 800);
    });

    test("the h1 and impact values use the theme accent gradient", async ({
      page,
    }) => {
      const [a, b] = ACCENTS[theme];
      const targets = [
        page.locator("h1"),
        ...[0, 1, 2, 3].map((i) =>
          impactLinks(page).nth(i).locator("span").first(),
        ),
      ];
      for (const target of targets) {
        const bg = await target.evaluate(
          (el) => getComputedStyle(el).backgroundImage,
        );
        expect(bg).toContain("linear-gradient");
        expect(bg).toContain(a);
        expect(bg).toContain(b);
      }
    });

    test("View Featured Work has a gradient background", async ({ page }) => {
      const [a, b] = ACCENTS[theme];
      const bg = await hero(page)
        .getByRole("link", { name: "View Featured Work" })
        .evaluate((el) => getComputedStyle(el).backgroundImage);
      expect(bg).toContain("linear-gradient");
      expect(bg).toContain(a);
      expect(bg).toContain(b);
    });

    test("the glow is decorative and does not take pointer events", async ({
      page,
    }) => {
      const glow = await hero(page).evaluate((el) => {
        const cs = getComputedStyle(el, "::before");
        return {
          content: cs.content,
          pointerEvents: cs.pointerEvents,
          backgroundImage: cs.backgroundImage,
        };
      });
      expect(glow.content).not.toBe("none");
      expect(glow.pointerEvents).toBe("none");
      expect(glow.backgroundImage).toContain("radial-gradient");
    });

    test("the divider motif matches the theme", async ({ page }) => {
      const motif = await hero(page)
        .locator(".motif-divider span")
        .evaluate((el) => {
          const cs = getComputedStyle(el);
          return {
            mask:
              cs.maskImage ||
              (cs as unknown as Record<string, string>).webkitMaskImage ||
              "none",
            background: cs.backgroundImage,
          };
        });
      if (theme === "pokemon") {
        expect(motif.mask).toBe("none");
        expect(motif.background).toContain("ribbon-pink.svg");
      } else {
        expect(motif.mask).toContain("sparkle.svg");
      }
    });

    test("the hero has no automated accessibility violations at 1280 and 390", async ({
      page,
    }) => {
      for (const [width, height] of [
        [1280, 800],
        [390, 844],
      ] as const) {
        await page.setViewportSize({ width, height });
        await page.goto("/");
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();
        expect(results.violations).toEqual([]);
      }
    });
  });
}

for (const theme of THEMES) {
  for (const width of [1280, 390]) {
    test(`no arch portrait is rendered, ${theme} ${width}px`, async ({
      page,
    }) => {
      await openTheme(page, theme, width, 800);
      await expect(page.locator(".hero-portrait")).toHaveCount(0);
      await expect(page.getByAltText("Portrait of Jessica Haynes")).toHaveCount(
        0,
      );
    });
  }
}

test("forced colors turn the gradient text into readable system text", async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: "active" });
  await openTheme(page, "light", 1280, 800);
  const targets = [
    page.locator("h1"),
    impactLinks(page).first().locator("span").first(),
  ];
  for (const target of targets) {
    const style = await target.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { color: cs.color, backgroundImage: cs.backgroundImage };
    });
    expect(style.color).not.toBe("rgba(0, 0, 0, 0)");
    expect(style.color).not.toBe("transparent");
    expect(style.backgroundImage).toBe("none");
  }
});

test.describe("hero without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("still renders the copy, actions and contact links", async ({
    page,
  }) => {
    await page.goto("/");
    const hero = page.locator("section.portfolio-hero");
    await expect(page.locator("h1")).toHaveText(/Hi, I.m Jessica/);
    await expect(hero.getByText(ROLE, { exact: true })).toBeVisible();
    await expect(
      hero.getByRole("link", { name: "View Featured Work" }),
    ).toHaveAttribute("href", "#projects");
    await expect(
      hero.getByRole("link", { name: "Download Resume" }),
    ).toHaveAttribute("href", "/Jessica_Haynes_Resume.pdf");
    await expect(hero.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:jkhaynes2390@gmail.com",
    );
    await expect(hero.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/jkhaynes",
    );
    await expect(hero.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://linkedin.com/in/jesshaynes",
    );
    const impact = hero.getByRole("link", { name: /^Impact metric:/ });
    await expect(impact).toHaveCount(4);
    for (const [i, metric] of impactMetrics.entries()) {
      await expect(impact.nth(i)).toHaveAttribute("href", metric.href);
    }
  });
});
