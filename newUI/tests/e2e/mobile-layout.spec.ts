/**
 * E2E: mobile responsive layout checks
 *  - Hero `love4prompts` heading fits a 320px viewport without overflow.
 *  - /categories renders a 2-column grid with cards in the intended shape.
 *
 *   bunx playwright test tests/e2e/mobile-layout.spec.ts
 */
import { test, expect } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:8080";

test.describe("hero typography @ 320px", () => {
  test.use({ viewport: { width: 320, height: 700 } });

  test("the 'love4prompts' wordmark fits without horizontal overflow", async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });

    const hero = page.getByRole("heading", { name: /love4prompts/i }).first();
    await expect(hero).toBeVisible();

    const metrics = await hero.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }));
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);

    // Document-level guard: no horizontal scrollbar on the page.
    const doc = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(doc.scroll).toBeLessThanOrEqual(doc.client + 1);
  });
});

test.describe("/categories mobile grid", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("renders a 2-column grid of category cards", async ({ page }) => {
    await page.goto(`${BASE_URL}/categories`, { waitUntil: "domcontentloaded" });

    const cards = page.getByTestId("category-card");
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(8);

    // First two cards should share the same `top` (= same row, 2 columns).
    const a = await cards.nth(0).boundingBox();
    const b = await cards.nth(1).boundingBox();
    const c = await cards.nth(2).boundingBox();
    expect(a && b && c).toBeTruthy();
    expect(Math.abs(a!.top - b!.top)).toBeLessThan(2);
    expect(c!.top).toBeGreaterThan(a!.top); // new row

    // Cards keep a 3:4 cover (height ≈ width * 4/3) within the card.
    const img = cards.nth(0).locator("img").first();
    const ibox = await img.boundingBox();
    expect(ibox).toBeTruthy();
    expect(ibox!.height / ibox!.width).toBeGreaterThan(1.2);
    expect(ibox!.height / ibox!.width).toBeLessThan(1.45);

    // First image is eager-loaded with fetchpriority=high (LCP hint).
    await expect(img).toHaveAttribute("fetchpriority", "high");
    await expect(img).toHaveAttribute("loading", "eager");

    // No horizontal scroll on the page.
    const doc = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(doc.scroll).toBeLessThanOrEqual(doc.client + 1);
  });
});
