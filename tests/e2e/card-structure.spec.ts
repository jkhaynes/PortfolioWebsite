import { expect, test, type Page } from "@playwright/test";

const storageKey = "jessbuilds-theme";
const SPARKLE = "/images/motif/sparkle.svg";
const BOW = "/images/pokemon/ribbon-pink.svg";

type Theme = "light" | "dark" | "pokemon";

async function openTheme(page: Page, theme: Theme) {
  await page.addInitScript(
    ([key, value]) => localStorage.setItem(key, value),
    [storageKey, theme] as const,
  );
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
}

function computed(
  page: Page,
  selector: string,
  pseudo: "::before" | "::after" | null,
  property: string,
) {
  return page
    .locator(selector)
    .first()
    .evaluate(
      (element, [pseudoElement, name]) =>
        getComputedStyle(element, pseudoElement).getPropertyValue(name),
      [pseudo, property] as const,
    );
}

for (const theme of ["light", "dark", "pokemon"] as const) {
  test(`facet icons are sparkles in ${theme} mode`, async ({ page }) => {
    await openTheme(page, theme);
    for (const selector of [
      "[data-project-card] .specimen-facet",
      "#learning-now .specimen-facet--quiet",
    ]) {
      expect(await computed(page, selector, null, "mask-image")).toContain(
        SPARKLE,
      );
    }
  });
}

for (const theme of ["light", "dark"] as const) {
  test(`brand, name divider and headers carry the sparkle in ${theme} mode`, async ({
    page,
  }) => {
    await openTheme(page, theme);
    expect(
      await computed(page, ".portfolio-brand", "::before", "mask-image"),
    ).toContain(SPARKLE);
    await expect(page.locator(".motif-divider")).toBeVisible();
    expect(
      await computed(page, ".motif-divider span", null, "mask-image"),
    ).toContain(SPARKLE);
    for (const heading of ["#projects h2", "#experience h2", "#about h2"]) {
      expect(await computed(page, heading, "::before", "mask-image")).toContain(
        SPARKLE,
      );
      expect(await computed(page, heading, "::after", "height")).toBe("1px");
    }
    // Decorative only: accessible names are unchanged.
    await expect(
      page.getByRole("heading", { level: 2, name: "Featured Projects", exact: true }),
    ).toBeVisible();
  });
}

test("pokemon keeps bows on the brand, divider and headers", async ({ page }) => {
  await openTheme(page, "pokemon");
  for (const [selector, pseudo] of [
    [".portfolio-brand", "::before"],
    ["#projects h2", "::before"],
    [".motif-divider span", null],
  ] as const) {
    expect(await computed(page, selector, pseudo, "background-image")).toContain(
      BOW,
    );
    expect(await computed(page, selector, pseudo, "mask-image")).toBe("none");
  }
});

for (const theme of ["light", "dark"] as const) {
  test(`impact, about and contact are framed in ${theme} mode`, async ({
    page,
  }) => {
    await openTheme(page, theme);
    for (const selector of ["#impact .grid", "#about > div", "#contact > div"]) {
      for (const side of ["top", "right", "bottom", "left"]) {
        expect(
          await computed(page, selector, null, `border-${side}-width`),
        ).toBe("1px");
        expect(
          await computed(page, selector, null, `border-${side}-style`),
        ).toBe("solid");
      }
      expect(
        await computed(page, selector, null, "border-top-left-radius"),
      ).toBe("24px");
      expect(
        await computed(page, selector, null, "background-color"),
      ).not.toBe("rgba(0, 0, 0, 0)");
    }
  });
}

for (const theme of ["light", "dark"] as const) {
  test(`project cards get a gradient frame and top-edge sparkle in ${theme} mode`, async ({
    page,
  }) => {
    await openTheme(page, theme);
    const card = "[data-project-card]";
    expect(await computed(page, card, null, "background-image")).toContain(
      "linear-gradient",
    );
    expect(await computed(page, card, null, "border-top-width")).toBe("0px");
    expect(await computed(page, card, "::after", "mask-image")).toContain(
      SPARKLE,
    );
    expect(await computed(page, card, "::before", "border-top-left-radius")).toBe(
      "999px",
    );
    // The sparkle sits on the top edge, above the card box.
    expect(
      parseFloat(await computed(page, card, "::after", "top")),
    ).toBeLessThan(0);
  });
}

test("pokemon cards keep the bow and bookmark ribbon", async ({ page }) => {
  await openTheme(page, "pokemon");
  const card = "[data-project-card]";
  expect(await computed(page, card, "::before", "background-image")).toContain(
    BOW,
  );
  expect(await computed(page, card, "::after", "clip-path")).not.toBe("none");
  expect(await computed(page, card, "::after", "mask-image")).toBe("none");
});

for (const theme of ["light", "dark", "pokemon"] as const) {
  test(`framed panels line up with the other sections in ${theme} mode`, async ({
    page,
  }) => {
    await openTheme(page, theme);
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const strip = (await page.locator("#impact .grid").boundingBox())!;
      for (const panel of ["#about > div", "#contact > div"]) {
        const box = (await page.locator(panel).boundingBox())!;
        expect(Math.abs(box.x - strip.x)).toBeLessThan(1);
        expect(Math.abs(box.width - strip.width)).toBeLessThan(1);
      }
    }
  });
}
