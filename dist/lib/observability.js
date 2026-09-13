// No external transport is enabled until the restaurant configures its project.
export function createTelemetry(transport = () => {}) {
  const events = [];
  const names = new Set([
    "runtime-error",
    "unhandled-rejection",
    "image-error",
    "lcp",
    "cls",
    "interaction",
    "delivery",
  ]);
  return {
    record(name, value = 1) {
      if (!names.has(name) || !Number.isFinite(value)) return;
      const event = { name, value, timestamp: Date.now() };
      events.push(event);
      if (events.length > 50) events.shift();
      try {
        transport(event);
      } catch {
        /* Monitoring must never break ordering. */
      }
    },
    snapshot() {
      return events.map((event) => ({ ...event }));
    },
  };
}

export function installObservability(config = {}, win = window) {
  const telemetry = createTelemetry((event) => {
    if (config.enabled && win.Sentry) {
      win.Sentry.captureMessage(`joy.${event.name}`, {
        level:
          event.name.includes("error") || event.name === "unhandled-rejection"
            ? "error"
            : "info",
        extra: { value: event.value },
      });
    }
  });
  win.addEventListener(
    "error",
    (event) => {
      telemetry.record(
        event.target?.tagName === "IMG" ? "image-error" : "runtime-error",
      );
    },
    true,
  );
  win.addEventListener("unhandledrejection", () =>
    telemetry.record("unhandled-rejection"),
  );
  win.document.querySelectorAll(".delivery-option").forEach((link) => {
    link.addEventListener("click", () => telemetry.record("delivery"));
  });
  if (win.PerformanceObserver) {
    let cls = 0;
    for (const type of ["largest-contentful-paint", "layout-shift", "event"]) {
      try {
        const observer = new win.PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (type === "largest-contentful-paint")
              telemetry.record("lcp", entry.startTime);
            else if (type === "layout-shift" && !entry.hadRecentInput) {
              cls += entry.value;
              telemetry.record("cls", cls);
            } else if (type === "event" && entry.interactionId)
              telemetry.record("interaction", entry.duration);
          }
        });
        observer.observe({ type, buffered: true });
      } catch {
        /* Older browsers can still use the complete site. */
      }
    }
  }
  // Diagnostics contain no messages, stack traces, URLs, input values or identity.
  win.joyDiagnostics = () => telemetry.snapshot();
  return telemetry;
}
