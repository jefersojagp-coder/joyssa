const easing = "cubic-bezier(0.22, 1, 0.36, 1)";

export function revealState(rect, viewportHeight, allowed, focused = false) {
  return {
    ready:
      allowed && !focused && (rect.bottom <= 0 || rect.top >= viewportHeight),
    offset: rect.bottom <= 0 ? "-16px" : "16px",
  };
}

export function createDisclosure(panel, allowed) {
  let animation;
  let revision = 0;
  return async (open, keyboard = false) => {
    const ticket = ++revision;
    animation?.cancel();
    panel.inert = !open;
    if (open) panel.hidden = false;
    if (!allowed() || keyboard || !panel.animate) {
      panel.hidden = !open;
      return;
    }
    animation = panel.animate(
      open
        ? [
            { opacity: 0, transform: "translateY(-8px)" },
            { opacity: 1, transform: "translateY(0)" },
          ]
        : [
            { opacity: 1, transform: "translateY(0)" },
            { opacity: 0, transform: "translateY(-4px)" },
          ],
      { duration: open ? 240 : 140, easing },
    );
    try {
      await animation.finished;
    } catch {
      /* A newer interaction superseded this one. */
    }
    if (ticket === revision) panel.hidden = !open;
  };
}

export function enhanceImages(root = document) {
  root.querySelectorAll("main img:not(.hero-art)").forEach((img) => {
    img.decoding = "async";
    img.loading = "lazy";
    function finish(failed) {
      img.classList.remove("image-pending");
      img.classList.toggle("image-unavailable", failed);
      img.dataset.loadState = failed ? "error" : "loaded";
    }
    img.addEventListener("load", () => finish(false));
    img.addEventListener("error", () => finish(true));
    if (img.complete) finish(img.naturalWidth === 0);
    else {
      img.classList.add("image-pending");
      img.dataset.loadState = "loading";
    }
  });
}

export function installScrollProgress(root = document, win = window) {
  const bar = root.querySelector(".reading-progress");
  let scheduled = false;
  function update() {
    scheduled = false;
    const max = root.documentElement.scrollHeight - win.innerHeight;
    const progress = max > 0 ? Math.max(0, Math.min(1, win.scrollY / max)) : 0;
    bar.style.transform = `scaleX(${progress})`;
  }
  function schedule() {
    if (!scheduled) {
      scheduled = true;
      win.requestAnimationFrame(update);
    }
  }
  win.addEventListener("scroll", schedule, { passive: true });
  win.addEventListener("resize", schedule);
  update();
}
