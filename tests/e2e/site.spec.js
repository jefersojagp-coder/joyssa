import { expect, test } from "@playwright/test";

test("cardápio, delivery and responsive layout", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator("#hero-title")).toContainText("VOCÊ MERECE");
  await page.locator('[data-filter="temakis"]').click();
  await expect(page.locator(".menu-group:visible").first()).toHaveAttribute(
    "data-group",
    "temakis",
  );
  await page.locator('[data-filter="bebidas"]').click();
  await expect(page.locator("#category-photo")).toBeHidden();
  await expect(page.locator(".delivery-option")).toHaveCount(3);
  await expect(page.locator(".instagram-center")).toHaveAttribute(
    "href",
    "https://www.instagram.com/joysushibarssa/",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});
test("motion replays up and down; pause remains functional", async ({
  page,
}) => {
  await page.goto("/");
  const el = page.locator(".experience-copy");
  await el.scrollIntoViewIfNeeded();
  await expect(el).toHaveClass(/in-view/);
  await page.locator("#tour-virtual").scrollIntoViewIfNeeded();
  await expect(el).toHaveClass(/reveal-ready/);
  await el.scrollIntoViewIfNeeded();
  await expect(el).toHaveClass(/in-view/);
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.locator("#motion-toggle").click();
  await expect(page.locator("body")).toHaveClass(/motion-paused/);
  await expect(page.locator(".reading-progress")).toBeAttached();
});
test("reduced motion and keyboard navigation", async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#motion-toggle")).toBeDisabled();
  if (isMobile) {
    await page.locator(".menu-toggle").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#mobile-nav")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-nav")).toBeHidden();
    await expect(page.locator(".menu-toggle")).toBeFocused();
  }
  await page.locator('[data-filter="sushis"]').click();
  await expect(page.locator(".menu-group:visible").first()).toHaveAttribute(
    "data-group",
    "sushis",
  );
});
test("failed photographs leave loading state and preserve the page", async ({
  page,
}) => {
  await page.route("**/instagram-temaki.jpg", (route) => route.abort());
  await page.goto("/");
  const img = page.locator('img[src$="instagram-temaki.jpg"]');
  await img.scrollIntoViewIfNeeded();
  await expect(img).toHaveAttribute("data-load-state", "error");
  await expect(page.locator("#tour-virtual")).toContainText("Em breve");
});
