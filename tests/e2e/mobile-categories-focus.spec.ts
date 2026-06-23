/**
 * E2E: keyboard navigation stays inside the mobile menu while the
 * Categories accordion is expanded, and focus returns to the Categories
 * trigger after the accordion is collapsed.
 *
 * Run from the project root (dev server on :8080):
 *   bunx playwright test tests/e2e/mobile-categories-focus.spec.ts
 *
 * Or with the helper script: see tests/e2e/run-mobile-categories.mjs
 */
import { test, expect } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:8080";

test.use({ viewport: { width: 390, height: 844 } });

test.describe("mobile menu — Categories accordion focus", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
  });

  test("Tab cycles inside the open mobile menu and never leaves it", async ({ page }) => {
    await page.getByRole("button", { name: /open menu/i }).click();
    const dialog = page.getByRole("dialog", { name: /main menu/i });
    await expect(dialog).toBeVisible();

    // Expand Categories
    const catTrigger = dialog.getByRole("button", { name: /^categories$/i });
    await catTrigger.click();
    await expect(catTrigger).toHaveAttribute("aria-expanded", "true");
    await expect(dialog.locator("#mobile-cat-list")).toBeVisible();

    // Tab through every focusable; ensure focus never escapes the dialog.
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Tab");
      const inside = await dialog.evaluate((el) =>
        el.contains(document.activeElement),
      );
      expect(inside, `focus escaped on Tab #${i + 1}`).toBe(true);
    }

    // Shift+Tab the other way too.
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Shift+Tab");
      const inside = await dialog.evaluate((el) =>
        el.contains(document.activeElement),
      );
      expect(inside, `focus escaped on Shift+Tab #${i + 1}`).toBe(true);
    }
  });

  test("Escape closes mobile menu and returns focus to the open-menu trigger", async ({ page }) => {
    const opener = page.getByRole("button", { name: /open menu/i });
    await opener.click();
    const dialog = page.getByRole("dialog", { name: /main menu/i });
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    const focused = await page.evaluate(
      () => document.activeElement?.getAttribute("aria-label"),
    );
    expect(focused).toMatch(/open menu/i);
  });

  test("collapsing Categories returns focus to the Categories trigger", async ({ page }) => {
    await page.getByRole("button", { name: /open menu/i }).click();
    const dialog = page.getByRole("dialog", { name: /main menu/i });
    const catTrigger = dialog.getByRole("button", { name: /^categories$/i });

    await catTrigger.click(); // expand
    await expect(catTrigger).toHaveAttribute("aria-expanded", "true");

    await catTrigger.click(); // collapse
    await expect(catTrigger).toHaveAttribute("aria-expanded", "false");

    // After collapse, focus should be on the Categories trigger.
    await expect(catTrigger).toBeFocused();
  });
});
