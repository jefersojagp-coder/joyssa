import { readFileSync } from "node:fs";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

let preference;
beforeEach(async () => {
  vi.resetModules();
  vi.useFakeTimers();
  document.documentElement.innerHTML = readFileSync("dist/index.html", "utf8");
  preference = { matches: false, addEventListener: vi.fn() };
  vi.stubGlobal("matchMedia", () => preference);
  vi.stubGlobal("requestAnimationFrame", (fn) => setTimeout(fn, 1));
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.animate = undefined;
  await import("../../dist/app.js");
});
afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
it("filters the real 141-item menu and supports photo-free beverages", () => {
  document.querySelector('[data-filter="bebidas"]').click();
  const visible = [...document.querySelectorAll(".menu-group")].filter(
    (g) => !g.hidden,
  );
  expect(visible.length).toBeGreaterThan(0);
  expect(visible.every((g) => g.dataset.group === "bebidas")).toBe(true);
  expect(document.querySelector("#category-photo").parentElement.hidden).toBe(
    true,
  );
  document.querySelector('[data-jump="temakis"]').click();
  expect(document.querySelector("#category-photo").parentElement.hidden).toBe(
    false,
  );
  expect(document.querySelectorAll(".menu-item")).toHaveLength(141);
});
it("opens menu, closes via Escape, and restores focus", () => {
  const button = document.querySelector(".menu-toggle");
  button.click();
  expect(button.getAttribute("aria-expanded")).toBe("true");
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  expect(document.querySelector("#mobile-nav").hidden).toBe(true);
  expect(document.activeElement).toBe(button);
});
it("cycles hero photographs, pauses and allows manual selection", () => {
  vi.advanceTimersByTime(7000);
  expect(
    document.querySelector('[data-slide="1"]').getAttribute("aria-pressed"),
  ).toBe("true");
  document.querySelector("#motion-toggle").click();
  vi.advanceTimersByTime(14000);
  expect(
    document.querySelector('[data-slide="1"]').getAttribute("aria-pressed"),
  ).toBe("true");
  document.querySelector('[data-slide="2"]').click();
  expect(
    document.querySelector('[data-slide="2"]').getAttribute("aria-pressed"),
  ).toBe("true");
  document.querySelector("#motion-toggle").click();
  expect(document.body.classList.contains("motion-paused")).toBe(false);
});
it("keeps all three delivery destinations and the correct Instagram", () => {
  expect(
    [...document.querySelectorAll(".delivery-option")]
      .map((a) => a.href)
      .join(" "),
  ).toContain("0017a584-29b8-4727-8b43-1caff1eb7f55");
  expect(document.querySelector(".delivery-99").closest("a").href).toBe(
    "https://oia.99app.com/dlp9/jsrttK?area=BR",
  );
  expect(document.querySelector(".instagram-center").href).toBe(
    "https://www.instagram.com/joysushibarssa/",
  );
});

it("interrupts pointer accordion transitions without losing the final state", async () => {
  const group = document.querySelector(".menu-group");
  group.open = false;
  const finishes = [];
  group.animate = vi.fn(() => ({
    cancel: vi.fn(),
    finished: new Promise((resolve) => finishes.push(resolve)),
  }));
  const click = () =>
    group
      .querySelector("summary")
      .dispatchEvent(
        new MouseEvent("click", { detail: 1, bubbles: true, cancelable: true }),
      );
  click();
  expect(group.open).toBe(true);
  click();
  click();
  for (const finish of finishes) finish();
  await Promise.resolve();
  await Promise.resolve();
  expect(group.open).toBe(true);
  click();
  finishes.at(-1)();
  await Promise.resolve();
  await Promise.resolve();
  expect(group.open).toBe(false);
});
