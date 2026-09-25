import { expect, test, type Locator, type Page } from "@playwright/test";

const SET = [
  {
    title: "Job Hunt Pipeline",
    href: "/work/job-hunt-pipeline",
    summary:
      "A daily AI job search that screens LinkedIn roles against my rules and resume.",
  },
  {
    title: "PokéJudge AI",
    href: "/work/pokejudge",
    summary:
      "An AI rules assistant that asks the right questions before it recommends a cited ruling.",
  },
  {
    title: "Loot Singles Fulfillment",
    href: "/work/loot-singles",
    summary:
      "A set-aware picking app built to prevent wrong-card mistakes and order collisions.",
  },
  {
    title: "Loot Membership Integration",
    href: "/work/loot-membership",
    summary: "A Shopify app that ties member discounts to verified Discord roles.",
  },
  {
    title: "pricewatch",
    href: "/work/pricewatch",
    summary:
      "A Go CLI that prices an 8,800-card collection on 1,000 API requests a day.",
  },
] as const;

// Rotation of an element in degrees, read from its computed transform matrix.
function angle(locator: Locator) {
  return locator.evaluate((element) => {
    const transform = getComputedStyle(element).transform;
    if (transform === "none") return 0;
    const [a, b] = transform.match(/matrix\(([^)]+)\)/)![1].split(",").map(Number);
    return Math.round((Math.atan2(b, a) * 180) / Math.PI);
  });
}

async function openProjects(page: Page, width: number) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto("/");
  await page.locator("#projects").scrollIntoViewIfNeeded();
}

test("the hand holds five compact cards that each open their case study", async ({
  page,
}) => {
  await openProjects(page, 1280);
  const cards = page.locator("[data-project-card]");
  await expect(cards).toHaveCount(5);

  for (const [index, project] of SET.entries()) {
    const card = cards.nth(index);
    await expect(card.getByRole("heading", { level: 3 })).toHaveText(project.title);
    const links = card.getByRole("link");
    await expect(links).toHaveCount(1);
    await expect(links).toHaveAccessibleName(project.title);
    await expect(links).toHaveAttribute("href", project.href);
    await expect(card).toContainText(project.summary);
    await expect(card.locator(".tag, [data-tag]")).toHaveCount(3);
    await expect(card.getByRole("button")).toHaveCount(0);
  }
});

test("on desktop the cards fan out, overlap and straighten on hover", async ({
  page,
}) => {
  await openProjects(page, 1280);
  const cards = page.locator("[data-project-card]");
  await expect.poll(() => angle(cards.nth(0))).toBeLessThan(-9);
  await expect.poll(() => angle(cards.nth(1))).toBeLessThan(-3);
  await expect.poll(() => angle(cards.nth(1))).toBeGreaterThan(-9);
  await expect.poll(() => angle(cards.nth(2))).toBe(0);
  await expect.poll(() => angle(cards.nth(3))).toBeGreaterThan(3);
  await expect.poll(() => angle(cards.nth(3))).toBeLessThan(9);
  await expect.poll(() => angle(cards.nth(4))).toBeGreaterThan(9);

  const first = (await cards.nth(0).boundingBox())!;
  const second = (await cards.nth(1).boundingBox())!;
  expect(first.x + first.width).toBeGreaterThan(second.x);

  await cards.nth(0).hover();
  await expect.poll(() => angle(cards.nth(0))).toBe(0);
});

test("the hand is dealt once when the section comes into view", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const hand = page.locator(".project-hand");
  // Waiting below the fold: held back and hidden, not dealt yet.
  await expect(hand).toHaveAttribute("data-dealt", "pending");
  await expect(hand.locator("[data-project-card]").first()).toHaveCSS("opacity", "0");

  // Just peeking over the fold is not enough to deal.
  await page.evaluate(() => {
    const top = document.querySelector(".project-hand")!.getBoundingClientRect().top;
    window.scrollBy(0, top - window.innerHeight + 80);
  });
  await page.waitForTimeout(300);
  await expect(hand).toHaveAttribute("data-dealt", "pending");

  // Well into view: the deal plays.
  await page.evaluate(() => {
    const top = document.querySelector(".project-hand")!.getBoundingClientRect().top;
    window.scrollBy(0, top - window.innerHeight / 2);
  });
  await expect(hand).toHaveAttribute("data-dealt", "true");
});

test("reduced motion skips the deal animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openProjects(page, 1280);
  const running = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter((animation) => (animation as CSSAnimation).animationName === "project-deal").length,
  );
  expect(running).toBe(0);
});

test("on mobile the hand becomes a swipeable row without tilt", async ({
  page,
}) => {
  await openProjects(page, 390);
  const hand = page.locator(".project-hand");
  expect(
    await hand.evaluate((element) => element.scrollWidth > element.clientWidth),
  ).toBe(true);
  const cards = page.locator("[data-project-card]");
  for (let index = 0; index < 5; index += 1) {
    expect(await angle(cards.nth(index))).toBe(0);
  }
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBe(true);
});

test("in Pokémon mode the hand lifts in place and Sylveon peeks over the picked card", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("jessbuilds-theme", "pokemon"));
  await openProjects(page, 1440);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "pokemon");
  const cards = page.locator("[data-project-card]");
  const side = cards.nth(0);
  // Let the deal finish: the card rests fanned to the left.
  await expect.poll(() => angle(side)).toBe(-10);

  // Aim inside the rotated card; its bounding box corners are empty space.
  const box = (await side.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.4, box.y + box.height / 2);
  await expect.poll(() => angle(side)).toBe(0);
  // Still spread to the left of the hand and lifted, not snapped to the middle.
  const offset = await side.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform));
  expect(offset.e).toBeLessThan(-200);
  expect(offset.f).toBeLessThan(-30);

  // Sylveon sits above the card's top edge, clear of its text.
  const peek = side.locator(".project-sylveon-peek > span");
  await expect.poll(() => peek.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  const peekBox = (await side.locator(".project-sylveon-peek").boundingBox())!;
  const status = (await side.getByText("Live", { exact: true }).boundingBox())!;
  expect(peekBox.y + peekBox.height).toBeLessThanOrEqual(status.y);
});
