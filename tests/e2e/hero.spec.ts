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

const badge = (page: Page) =>
  hero(page).getByRole("button", { name: "Take a play break", exact: true });

test.describe("hero game badge", () => {
  for (const width of [1280, 390]) {
    test(`Pokémon badge sits centered above the h1, ${width}px`, async ({
      page,
    }) => {
      await openTheme(page, "pokemon", width, 800);
      const button = badge(page);
      await expect(button).toBeVisible();
      const before = await hero(page).evaluate((section) => {
        const b = section.querySelector("button.roundup-launcher")!;
        const h = section.querySelector("h1")!;
        return !!(
          b.compareDocumentPosition(h) & Node.DOCUMENT_POSITION_FOLLOWING
        );
      });
      expect(before).toBe(true);
      const b = (await button.boundingBox())!;
      const h = (await page.locator("h1").boundingBox())!;
      expect(Math.abs(b.x + b.width / 2 - (h.x + h.width / 2))).toBeLessThan(2);
      expect(b.y + b.height).toBeLessThanOrEqual(h.y);
    });
  }

  test("click and Enter open Ribbon Roundup; Escape returns focus to the badge", async ({
    page,
  }) => {
    await openTheme(page, "pokemon", 1280, 800);
    const button = badge(page);
    await button.click();
    await expect(
      page.getByRole("dialog", { name: "Ribbon Roundup" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(button).toBeFocused();
    await button.press("Enter");
    await expect(
      page.getByRole("dialog", { name: "Ribbon Roundup" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(button).toBeFocused();
  });

  test("does not overflow at 320px", async ({ page }) => {
    await openTheme(page, "pokemon", 320, 568);
    const b = (await badge(page).boundingBox())!;
    expect(b.x).toBeGreaterThanOrEqual(0);
    expect(b.x + b.width).toBeLessThanOrEqual(320);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  });

  for (const theme of ["light", "dark"] as const) {
    test(`is not visible in ${theme}`, async ({ page }) => {
      await openTheme(page, theme, 1280, 800);
      await expect(badge(page)).toBeHidden();
    });
  }

  for (const theme of THEMES) {
    test(`no Sylveon portrait card, ${theme}`, async ({ page }) => {
      await openTheme(page, theme, 1280, 800);
      await expect(page.locator(".sylveon-portrait")).toHaveCount(0);
    });
  }
});

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

/** Switches theme like the switcher does (it is in a menu on phones). */
const setThemeInPage = (page: Page, theme: Theme) =>
  page.evaluate((t) => {
    document.documentElement.dataset.theme = t;
    window.dispatchEvent(new Event("themechange"));
  }, theme);

// US4: the decorative fairy canvas. Its state is exposed as data attributes
// (contracts/hero-ui.md) so these tests never read pixels.
const fairy = (page: Page) =>
  page.locator("section.portfolio-hero canvas.hero-fairy");
const fairyState = (page: Page) => fairy(page).getAttribute("data-fairy-state");

type StateLog = { state: string; at: number }[];

/**
 * Waits until the client has started the fairy: the server renders
 * `data-fairy-state="resting"`, but only the client writes the position.
 */
async function fairyReady(page: Page) {
  await expect(fairy(page)).toHaveAttribute("data-fairy-x", /\d/);
}

/** Records every data-fairy-state change with its performance.now() time. */
async function recordFairyStates(page: Page) {
  await page.addInitScript(() => {
    const log: { state: string; at: number }[] = [];
    (window as unknown as { __fairyStates: typeof log }).__fairyStates = log;
    new MutationObserver((records) => {
      for (const r of records) {
        const el = r.target as Element;
        if (el.matches("canvas.hero-fairy")) {
          log.push({
            state: el.getAttribute("data-fairy-state") ?? "",
            at: performance.now(),
          });
        }
      }
    }).observe(document, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-fairy-state"],
    });
  });
}

const fairyLog = (page: Page) =>
  page.evaluate(
    () => (window as unknown as { __fairyStates: StateLog }).__fairyStates,
  );

/** Moves the mouse over the hero in a few steps. */
async function wiggle(page: Page) {
  const box = (await hero(page).boundingBox())!;
  const y = box.y + Math.min(box.height, 700) * 0.6;
  for (const x of [0.3, 0.4, 0.5, 0.6, 0.7]) {
    await page.mouse.move(box.x + box.width * x, y, { steps: 4 });
  }
}

/**
 * The fairy's position, the h1 text box and the role line and tagline's
 * line boxes, all in canvas CSS pixels.
 */
async function fairyGeometry(page: Page) {
  return fairy(page).evaluate((canvas) => {
    const c = canvas.getBoundingClientRect();
    const local = (r: DOMRect) => ({
      left: r.left - c.left,
      right: r.right - c.left,
      top: r.top - c.top,
      bottom: r.bottom - c.top,
    });
    const range = document.createRange();
    range.selectNodeContents(document.querySelector("h1")!);
    const text = local(range.getBoundingClientRect());
    const nearby = [];
    for (const el of document.querySelectorAll(".hero-role, .hero-tagline")) {
      range.selectNodeContents(el);
      for (const r of range.getClientRects()) nearby.push(local(r));
    }
    return {
      x: Number(canvas.getAttribute("data-fairy-x")),
      y: Number(canvas.getAttribute("data-fairy-y")),
      width: c.width,
      height: c.height,
      text,
      nearby,
    };
  });
}

type Geometry = Awaited<ReturnType<typeof fairyGeometry>>;

/** True when a 24px box around the fairy misses the box. */
function clearOf(g: Geometry, box: Geometry["text"]) {
  const r = 12;
  return (
    g.x + r <= box.left ||
    g.x - r >= box.right ||
    g.y + r <= box.top ||
    g.y - r >= box.bottom
  );
}

/** True when the fairy misses the h1 text box and the nearby copy. */
function clearOfText(g: Geometry) {
  return clearOf(g, g.text) && g.nearby.every((box) => clearOf(g, box));
}

test.describe("hero fairy", () => {
  test("is a decorative canvas that never takes pointer events", async ({
    page,
  }) => {
    await openTheme(page, "light", 1280, 800);
    await fairyReady(page);
    const canvas = fairy(page);
    await expect(canvas).toHaveCount(1);
    await expect(canvas).toHaveAttribute("aria-hidden", "true");
    expect(
      await canvas.evaluate((el) => getComputedStyle(el).pointerEvents),
    ).toBe("none");
  });

  test("is a butterfly in Light and Dark and a ribbon fairy in Pokémon, without a reload", async ({
    page,
  }) => {
    await openTheme(page, "light", 1280, 800);
    await fairyReady(page);
    await expect(fairy(page)).toHaveAttribute("data-fairy-kind", "butterfly");
    await page.getByRole("radio", { name: "Dark", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(fairy(page)).toHaveAttribute("data-fairy-kind", "butterfly");
    await page.getByRole("radio", { name: "Pokémon", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "pokemon");
    await expect(fairy(page)).toHaveAttribute("data-fairy-kind", "ribbon");
    await page.getByRole("radio", { name: "Light", exact: true }).click();
    await expect(fairy(page)).toHaveAttribute("data-fairy-kind", "butterfly");
  });

  test("drifts in an intro, then rests within 5 seconds with no input (SC-005)", async ({
    page,
  }) => {
    await recordFairyStates(page);
    await openTheme(page, "light", 1280, 800);
    await fairyReady(page);
    await expect
      .poll(async () => (await fairyLog(page)).some((e) => e.state === "intro"))
      .toBe(true);
    await expect
      .poll(() => fairyState(page), { timeout: 5500 })
      .toBe("resting");
    const log = await fairyLog(page);
    const intro = log.find((e) => e.state === "intro")!;
    const rest = log.find((e) => e.state === "resting" && e.at > intro.at)!;
    expect(rest.at - intro.at).toBeLessThanOrEqual(5000);
    // Nothing moves after resting.
    const before = await fairyGeometry(page);
    await page.waitForTimeout(600);
    const after = await fairyGeometry(page);
    expect([after.x, after.y]).toEqual([before.x, before.y]);
    expect(await fairyState(page)).toBe("resting");
  });

  test("follows the mouse over the hero, then rests within 5 seconds of it stopping", async ({
    page,
  }) => {
    await openTheme(page, "light", 1280, 800);
    await fairyReady(page);
    await wiggle(page);
    await expect(fairy(page)).toHaveAttribute("data-fairy-state", "following");
    await expect
      .poll(() => fairyState(page), { timeout: 5500 })
      .toBe("resting");
  });

  test("settles and rests after the mouse leaves the hero", async ({
    page,
  }) => {
    await openTheme(page, "light", 1280, 800);
    await fairyReady(page);
    await wiggle(page);
    await expect(fairy(page)).toHaveAttribute("data-fairy-state", "following");
    const box = (await hero(page).boundingBox())!;
    await page.mouse.move(box.x + 10, box.y + box.height + 40, { steps: 2 });
    await expect
      .poll(() => fairyState(page), { timeout: 5500 })
      .toBe("resting");
  });

  test("with reduced motion it rests from the first paint and stays resting through mouse moves", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await recordFairyStates(page);
    await openTheme(page, "light", 1280, 800);
    await fairyReady(page);
    await wiggle(page);
    await page.waitForTimeout(300);
    expect(await fairyState(page)).toBe("resting");
    const states = (await fairyLog(page)).map((e) => e.state);
    expect(states.filter((s) => s !== "resting")).toEqual([]);
  });

  test.describe("on a touch phone", () => {
    test.skip(
      ({ browserName }) => browserName === "firefox",
      "Playwright Firefox has no isMobile emulation",
    );
    test.use({
      hasTouch: true,
      isMobile: true,
      viewport: { width: 390, height: 844 },
    });

    test("rests beside the name", async ({ page }) => {
      await recordFairyStates(page);
      await page.goto("/");
      await expect(fairy(page)).toHaveAttribute("data-fairy-state", "resting");
      await expect(fairy(page)).toHaveAttribute("data-fairy-x", /\d/);
      await page.waitForTimeout(500);
      expect(await fairyState(page)).toBe("resting");
      const states = (await fairyLog(page)).map((e) => e.state);
      expect(states.filter((s) => s !== "resting")).toEqual([]);
      expect(clearOfText(await fairyGeometry(page))).toBe(true);
    });
  });

  test("follows reduced motion changes made while the page is open (FR-020)", async ({
    page,
  }) => {
    await openTheme(page, "light", 1280, 800);
    await fairyReady(page);
    await wiggle(page);
    await expect(fairy(page)).toHaveAttribute("data-fairy-state", "following");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(fairy(page)).toHaveAttribute("data-fairy-state", "resting");
    await wiggle(page);
    await page.waitForTimeout(300);
    expect(await fairyState(page)).toBe("resting");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await wiggle(page);
    await expect(fairy(page)).toHaveAttribute("data-fairy-state", "following");
  });

  for (const theme of ["light", "pokemon"] as const) {
    test(`stays inside the hero and clear of the h1 text across resizes, ${theme}`, async ({
      page,
    }) => {
      await openTheme(page, theme, 1280, 800);
      await fairyReady(page);
      await expect
        .poll(() => fairyState(page), { timeout: 5500 })
        .toBe("resting");
      for (const width of [390, 320, 1280]) {
        await page.setViewportSize({ width, height: 800 });
        // No Pokémon ribbon fairy below 360px: covered by the test below.
        if (theme === "pokemon" && width < 360) continue;
        // A resize can send the browser's own mouse move, so allow one settle.
        await expect
          .poll(
            async () => {
              const g = await fairyGeometry(page);
              return {
                state: await fairyState(page),
                inside:
                  g.width <= width &&
                  g.x >= 0 &&
                  g.x <= g.width &&
                  g.y >= 0 &&
                  g.y <= g.height,
                clear: clearOfText(g),
              };
            },
            { timeout: 5500 },
          )
          .toEqual({ state: "resting", inside: true, clear: true });
      }
    });
  }

  // Owner decision 2026-10-20 (FR-015): no ribbon fairy below 360px.
  for (const width of [320, 359]) {
    test(`shows no ribbon fairy at ${width}px in Pokémon and never animates`, async ({
      page,
    }) => {
      await recordFairyStates(page);
      await openTheme(page, "pokemon", width, 800);
      await expect(fairy(page)).toHaveAttribute("data-fairy-kind", "ribbon");
      await expect(fairy(page)).toBeHidden();
      await expect(fairy(page)).toHaveAttribute("data-fairy-hidden", "true");
      await wiggle(page);
      await page.waitForTimeout(2000);
      await wiggle(page);
      await expect(fairy(page)).toBeHidden();
      const states = (await fairyLog(page)).map((e) => e.state);
      expect(states.filter((s) => s !== "resting" && s !== "paused")).toEqual(
        [],
      );
      expect(await fairyState(page)).toMatch(/^(resting|paused)$/);
    });
  }

  for (const width of [360, 390]) {
    test(`shows the ribbon fairy at ${width}px in Pokémon`, async ({
      page,
    }) => {
      await openTheme(page, "pokemon", width, 800);
      await fairyReady(page);
      await expect(fairy(page)).toBeVisible();
      await expect(fairy(page)).not.toHaveAttribute(
        "data-fairy-hidden",
        "true",
      );
      await expect(fairy(page)).toHaveAttribute("data-fairy-kind", "ribbon");
      await expect
        .poll(() => fairyState(page), { timeout: 5500 })
        .toBe("resting");
      expect(clearOfText(await fairyGeometry(page))).toBe(true);
    });
  }

  for (const theme of ["light", "dark"] as const) {
    test(`still shows the butterfly at 320px, ${theme}`, async ({ page }) => {
      await openTheme(page, theme, 320, 800);
      await fairyReady(page);
      await expect(fairy(page)).toBeVisible();
      await expect(fairy(page)).toHaveAttribute("data-fairy-kind", "butterfly");
      await expect
        .poll(() => fairyState(page), { timeout: 5500 })
        .toBe("resting");
      expect(clearOfText(await fairyGeometry(page))).toBe(true);
    });
  }

  test("hides and shows the ribbon fairy as Pokémon is resized across 360px or the theme changes", async ({
    page,
  }) => {
    await openTheme(page, "pokemon", 390, 800);
    await fairyReady(page);
    await expect(fairy(page)).toBeVisible();
    await page.setViewportSize({ width: 320, height: 800 });
    await expect(fairy(page)).toBeHidden();
    await page.setViewportSize({ width: 390, height: 800 });
    await expect(fairy(page)).toBeVisible();
    await expect
      .poll(() => fairyState(page), { timeout: 5500 })
      .toBe("resting");
    expect(clearOfText(await fairyGeometry(page))).toBe(true);
    // Theme switches while narrow.
    await page.setViewportSize({ width: 320, height: 800 });
    await expect(fairy(page)).toBeHidden();
    await setThemeInPage(page, "light");
    await expect(fairy(page)).toBeVisible();
    await expect(fairy(page)).toHaveAttribute("data-fairy-kind", "butterfly");
    await setThemeInPage(page, "pokemon");
    await expect(fairy(page)).toBeHidden();
  });

  test("pauses while the hero is off screen and rests when it returns", async ({
    page,
  }) => {
    await openTheme(page, "light", 1280, 800);
    await fairyReady(page);
    await page.evaluate(() => {
      const section = document.querySelector("section.portfolio-hero")!;
      const bottom = section.getBoundingClientRect().bottom + window.scrollY;
      window.scrollTo({ top: bottom + 200, behavior: "instant" });
    });
    await expect(fairy(page)).toHaveAttribute("data-fairy-state", "paused");
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect(fairy(page)).toHaveAttribute("data-fairy-state", "resting");
  });

  for (const theme of ["light", "pokemon"] as const) {
    test(`never covers a hero link or button for the pointer (SC-006), ${theme}`, async ({
      page,
    }) => {
      await openTheme(page, theme, 1280, 800);
      await fairyReady(page);
      const targets = hero(page).locator("a:visible, button:visible");
      const count = await targets.count();
      expect(count).toBeGreaterThanOrEqual(theme === "pokemon" ? 10 : 9);
      for (let i = 0; i < count; i++) {
        const target = targets.nth(i);
        const box = (await target.boundingBox())!;
        const x = box.x + box.width / 2;
        const y = box.y + box.height / 2;
        // The fairy follows the mouse, so it flies over the target.
        await page.mouse.move(x, y, { steps: 3 });
        const hit = await target.evaluate(
          (el, [px, py]) => {
            const top = document.elementFromPoint(px, py);
            return {
              canvas: !!top?.matches("canvas.hero-fairy"),
              inside: !!top && el.contains(top),
            };
          },
          [x, y] as const,
        );
        expect(hit.canvas).toBe(false);
        expect(hit.inside).toBe(true);
      }
      // A click with the fairy right over the link activates it.
      const featured = hero(page).getByRole("link", {
        name: "View Featured Work",
      });
      const box = (await featured.boundingBox())!;
      await page.mouse.move(box.x + 10, box.y + box.height / 2, { steps: 4 });
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await expect(page.locator("#projects-heading")).toBeFocused();
    });
  }
});
