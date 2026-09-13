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

test("mobile delivery and Instagram retain their intended visual order", async ({
  page,
  isMobile,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".location-ribbon")).toHaveCount(0);
  expect(await page.locator("body").innerText()).not.toMatch(/[↗↓]/u);
  await expect(page.locator(".direction-icon").first()).toBeVisible();
  await page.locator("#delivery").scrollIntoViewIfNeeded();
  if (isMobile) {
    for (const option of await page.locator(".delivery-option").all()) {
      const center = await option.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        const icon = el.querySelector(".delivery-icon").getBoundingClientRect();
        return Math.abs(rect.x + rect.width / 2 - icon.x - icon.width / 2);
      });
      expect(center).toBeLessThan(2);
    }
  }
  await testInfo.attach("delivery-layout", {
    body: await page.screenshot(),
    contentType: "image/png",
  });
  await page.locator(".instagram-gallery").scrollIntoViewIfNeeded();
  const order = await page
    .locator(".instagram-gallery")
    .evaluate((gallery) =>
      [...gallery.children]
        .sort(
          (a, b) =>
            a.getBoundingClientRect().left - b.getBoundingClientRect().left,
        )
        .map((item) => item.classList.contains("instagram-center")),
    );
  expect(order.indexOf(true)).toBe(isMobile ? 0 : 2);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await testInfo.attach("instagram-layout", {
    body: await page.screenshot(),
    contentType: "image/png",
  });
});

test("Joy gallery cycles through six products and presents freshness information", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const gallery = page.locator(".experience-slider");
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery.locator(".experience-slide")).toHaveCount(6);
  for (let i = 0; i < 6; i++) {
    await gallery.locator("[data-experience-slide]").nth(i).click();
    await expect(gallery.locator(".experience-slide").nth(i)).toHaveClass(
      /active/,
    );
    await expect(gallery.locator(".experience-slide.active")).toHaveCount(1);
    await expect(
      gallery.locator("[data-experience-slide]").nth(i),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(gallery.locator(".experience-slide").nth(i)).toHaveJSProperty(
      "complete",
      true,
    );
  }
  await gallery.locator("[data-experience-slide]").first().click();
  await testInfo.attach("experience-six-photos", {
    body: await page.screenshot(),
    contentType: "image/png",
  });
  await expect(page.locator(".faq-list details").first()).toContainText(
    "Recebemos salmão todos os dias",
  );
  await expect(page.locator(".faq-list details").first()).toHaveAttribute(
    "open",
    "",
  );
});
