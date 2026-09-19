import { expect, test } from "@playwright/test";

// Visitor-facing copy uses commas and periods, not em dashes. Terminal output
// samples (monospace panels) are quoted program output and may keep them.
for (const path of ["/", "/work/pokejudge", "/work/loot-singles", "/work/loot-membership"]) {
  test(`${path} copy has no em dashes`, async ({ page }) => {
    await page.goto(path);
    const copy = await page.evaluate(() => {
      const body = document.body.cloneNode(true) as HTMLElement;
      body.querySelectorAll(".font-mono, script, style").forEach((el) => el.remove());
      return body.textContent ?? "";
    });
    expect(copy).not.toContain("—");

    const meta = await page.evaluate(() =>
      [...document.querySelectorAll("meta[name='description'], meta[property^='og:'], meta[name^='twitter:']")]
        .map((m) => m.getAttribute("content") ?? ""),
    );
    for (const content of meta) expect(content).not.toContain("—");
  });
}
