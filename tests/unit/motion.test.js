import { describe, expect, it, vi } from "vitest";
import {
  createDisclosure,
  enhanceImages,
  installScrollProgress,
  revealState,
} from "../../dist/lib/motion.js";

describe("repeatable motion", () => {
  it.each([
    [{ top: 800, bottom: 1100 }, true, "16px"],
    [{ top: -100, bottom: 0 }, true, "-16px"],
    [{ top: 20, bottom: 220 }, false, "16px"],
  ])("handles each viewport boundary", (rect, ready, offset) => {
    expect(revealState(rect, 800, true)).toEqual({ ready, offset });
    expect(revealState(rect, 800, false).ready).toBe(false);
    expect(revealState(rect, 800, true, true).ready).toBe(false);
  });
  it("keeps the latest menu intention after interrupted exit", async () => {
    const panel = document.createElement("nav");
    const finishes = [];
    panel.animate = vi.fn(() => ({
      cancel: vi.fn(),
      finished: new Promise((resolve) => finishes.push(resolve)),
    }));
    const setOpen = createDisclosure(panel, () => true);
    const a = setOpen(true);
    finishes.shift()();
    await a;
    const b = setOpen(false);
    const c = setOpen(true);
    finishes.shift()();
    await b;
    expect(panel.hidden).toBe(false);
    finishes.shift()();
    await c;
    expect(panel.hidden).toBe(false);
    expect(panel.inert).toBe(false);
    const d = setOpen(false);
    finishes.shift()();
    await d;
    expect(panel.hidden).toBe(true);
  });
  it("uses immediate keyboard and reduced-motion changes", async () => {
    const panel = document.createElement("nav");
    panel.animate = vi.fn();
    await createDisclosure(panel, () => false)(false);
    expect(panel.hidden).toBe(true);
    await createDisclosure(panel, () => true)(true, true);
    expect(panel.hidden).toBe(false);
    expect(panel.animate).not.toHaveBeenCalled();
  });
  it("resolves real image loading and errors without an endless skeleton", () => {
    document.body.innerHTML =
      '<main><img src="a.jpg"><img class="hero-art" src="b.jpg"></main>';
    const img = document.querySelector("img");
    Object.defineProperty(img, "complete", { value: false });
    enhanceImages();
    expect(img.dataset.loadState).toBe("loading");
    expect(img.loading).toBe("lazy");
    img.dispatchEvent(new Event("load"));
    expect(img.dataset.loadState).toBe("loaded");
    expect(img.classList.contains("image-pending")).toBe(false);
    img.dispatchEvent(new Event("error"));
    expect(img.dataset.loadState).toBe("error");
    expect(img.classList.contains("image-unavailable")).toBe(true);
    expect(
      document.querySelector(".hero-art").dataset.loadState,
    ).toBeUndefined();
  });
  it("computes actual scroll progress and batches frames", () => {
    const bar = { style: {} };
    const handlers = {};
    let frame;
    const root = {
      querySelector: () => bar,
      documentElement: { scrollHeight: 1800 },
    };
    const win = {
      innerHeight: 800,
      scrollY: 500,
      addEventListener: (name, fn) => {
        handlers[name] = fn;
      },
      requestAnimationFrame: vi.fn((fn) => {
        frame = fn;
      }),
    };
    installScrollProgress(root, win);
    expect(bar.style.transform).toBe("scaleX(0.5)");
    win.scrollY = 2000;
    handlers.scroll();
    handlers.scroll();
    expect(win.requestAnimationFrame).toHaveBeenCalledTimes(1);
    frame();
    expect(bar.style.transform).toBe("scaleX(1)");
    root.documentElement.scrollHeight = 200;
    handlers.resize();
    frame();
    expect(bar.style.transform).toBe("scaleX(0)");
  });
});

it("recognizes both cached photos and cached failures without a loading flash", () => {
  document.body.innerHTML = '<main><img id="ok"><img id="failed"></main>';
  const ok = document.querySelector("#ok"),
    failed = document.querySelector("#failed");
  Object.defineProperty(ok, "naturalWidth", { value: 800 });
  enhanceImages();
  expect(ok.dataset.loadState).toBe("loaded");
  expect(failed.dataset.loadState).toBe("error");
  expect(document.querySelectorAll(".image-pending")).toHaveLength(0);
});
