/**
 * E2E: /terms page SEO surface — title, meta description, and JSON-LD schema.
 *
 *   bunx playwright test tests/e2e/terms-seo.spec.ts
 */
import { test, expect } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:8080";

test.describe("/terms — SEO metadata", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/terms`, { waitUntil: "domcontentloaded" });
    // Title/meta are written by TanStack's HeadContent after hydration.
    await page.waitForFunction(() =>
      /Terms of Use/.test(document.title ?? ""),
    );
  });

  test("document title contains 'Terms of Use'", async ({ page }) => {
    await expect(page).toHaveTitle(/Terms of Use\s+—\s+love4prompts/);
  });

  test("meta description is present and non-empty", async ({ page }) => {
    const description = await page
      .locator('head > meta[name="description"]')
      .getAttribute("content");
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(50);
    expect(description!.toLowerCase()).toContain("terms of use");
  });

  test("Open Graph + Twitter tags self-reference /terms", async ({ page }) => {
    const ogUrl = await page
      .locator('head > meta[property="og:url"]')
      .getAttribute("content");
    expect(ogUrl).toMatch(/\/terms$/);

    const ogTitle = await page
      .locator('head > meta[property="og:title"]')
      .getAttribute("content");
    expect(ogTitle).toMatch(/Terms of Use/);

    const twCard = await page
      .locator('head > meta[name="twitter:card"]')
      .getAttribute("content");
    expect(twCard).toBeTruthy();

    const canonical = await page
      .locator('head > link[rel="canonical"]')
      .getAttribute("href");
    expect(canonical).toMatch(/\/terms$/);
  });

  test("JSON-LD WebPage schema is valid and well-formed", async ({ page }) => {
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    expect(blocks.length).toBeGreaterThan(0);

    const parsed = blocks
      .map((raw) => {
        try {
          return JSON.parse(raw);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    const webPage = parsed.find(
      (p) =>
        p?.["@type"] === "WebPage" &&
        typeof p?.url === "string" &&
        /\/terms$/.test(p.url),
    );
    expect(webPage, "WebPage JSON-LD entry").toBeTruthy();
    expect(webPage["@context"]).toBe("https://schema.org");
    expect(webPage.name).toMatch(/Terms of Use/);
    expect(webPage.description).toBeTruthy();
  });
});
