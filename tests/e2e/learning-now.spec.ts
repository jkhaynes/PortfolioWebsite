import { expect, test } from "@playwright/test";

const themes = [
  "Agentic engineering workflows",
  "AI evaluation & reliability",
  "Human-in-the-loop product design",
] as const;

test("learning now is a compact, non-interactive theme strip", async ({
  page,
}) => {
  await page.goto("/");

  const section = page.getByRole("region", { name: "Learning now" });
  await expect(section).toHaveCount(1);
  await expect(
    section.getByRole("heading", { name: "Learning now" }),
  ).toHaveCount(1);
  await expect(section).toContainText(
    "I’m deepening how I use AI in real engineering work—designing better agent workflows, evaluating system behavior, and keeping automation grounded in human judgment.",
  );

  const themeList = section.getByRole("list", {
    name: "Current learning themes",
  });
  await expect(themeList.getByRole("listitem")).toHaveCount(3);
  for (const theme of themes) {
    await expect(themeList.getByText(theme, { exact: true })).toBeVisible();
  }
  await expect(section.getByRole("link")).toHaveCount(0);
  await expect(section.getByRole("button")).toHaveCount(0);
});

test("learning now sits between work principles and about without old copy", async ({
  page,
}) => {
  await page.goto("/");

  const order = await page
    .locator("main > section")
    .evaluateAll((sections) => sections.map((section) => section.id));
  expect(order.indexOf("learning-now")).toBeGreaterThan(
    order.indexOf("how-i-work"),
  );
  expect(order.indexOf("learning-now")).toBeLessThan(order.indexOf("about"));

  await expect(
    page.getByRole("heading", { name: "Currently Exploring" }),
  ).toHaveCount(0);
  await expect(page.locator("#learning-now")).not.toContainText(/PokéJudge/i);
  await expect(page.locator("#about")).not.toContainText(
    /including, lately, AI-assisted development|still early in that exploration/i,
  );
});

for (const viewport of [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
]) {
  test(`learning now avoids overflow at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    await expect(page.locator("#learning-now")).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      )
      .toBe(true);
  });
}
