import { expect, it, vi } from "vitest";
import {
  createTelemetry,
  installObservability,
} from "../../dist/lib/observability.js";

it("limits records, accepts only safe metrics, isolates exporter failures", () => {
  const send = vi.fn(() => {
    throw Error("offline");
  });
  const telemetry = createTelemetry(send);
  telemetry.record("user-email", 1);
  telemetry.record("lcp", NaN);
  expect(send).not.toHaveBeenCalled();
  for (let i = 0; i < 60; i++) telemetry.record("lcp", i);
  const records = telemetry.snapshot();
  expect(records).toHaveLength(50);
  expect(records[0].value).toBe(10);
  records[0].value = 999;
  expect(telemetry.snapshot()[0].value).toBe(10);
  expect(Object.keys(records[0]).sort()).toEqual([
    "name",
    "timestamp",
    "value",
  ]);
});
it("collects safe diagnostics with no external SDK enabled", () => {
  const handlers = {};
  const Sentry = { captureMessage: vi.fn() };
  const win = {
    addEventListener: (key, fn) => {
      handlers[key] = fn;
    },
    document: { querySelectorAll: () => [] },
    Sentry,
  };
  const t = installObservability({}, win);
  handlers.error({ target: { tagName: "IMG" }, message: "private@email.com" });
  handlers.unhandledrejection();
  expect(t.snapshot().map((e) => e.name)).toEqual([
    "image-error",
    "unhandled-rejection",
  ]);
  expect(Sentry.captureMessage).not.toHaveBeenCalled();
  expect(JSON.stringify(win.joyDiagnostics())).not.toContain("private");
});
it("exports when explicitly enabled and observes performance", () => {
  const observers = {};
  const handlers = {};
  const clicks = [];
  const Sentry = { captureMessage: vi.fn() };
  class PO {
    constructor(fn) {
      this.fn = fn;
    }
    observe({ type }) {
      observers[type] = this.fn;
    }
  }
  const win = {
    addEventListener: (key, fn) => {
      handlers[key] = fn;
    },
    document: {
      querySelectorAll: () => [
        { addEventListener: (_, fn) => clicks.push(fn) },
      ],
    },
    PerformanceObserver: PO,
    Sentry,
  };
  installObservability({ enabled: true }, win);
  handlers.error({});
  clicks[0]();
  observers["largest-contentful-paint"]({
    getEntries: () => [{ startTime: 900 }],
  });
  observers["layout-shift"]({
    getEntries: () => [
      { value: 0.04, hadRecentInput: false },
      { value: 1, hadRecentInput: true },
    ],
  });
  observers.event({
    getEntries: () => [
      { interactionId: 3, duration: 100 },
      { interactionId: 0, duration: 1 },
    ],
  });
  expect(Sentry.captureMessage).toHaveBeenCalledTimes(5);
  expect(win.joyDiagnostics().map((e) => e.value)).toEqual([
    1, 1, 900, 0.04, 100,
  ]);
});

it("loads Sentry only with explicit public configuration", async () => {
  const { connectSentry } = await import("../../dist/lib/sentry.js");
  const load = vi.fn();
  expect(await connectSentry({}, {}, load)).toBe(false);
  expect(load).not.toHaveBeenCalled();
  const sdk = { init: vi.fn() };
  const win = {};
  expect(
    await connectSentry(
      { enabled: true, dsn: "https://public@example.com/1" },
      win,
      async () => sdk,
    ),
  ).toBe(true);
  expect(win.Sentry).toBe(sdk);
  const options = sdk.init.mock.calls[0][0];
  expect(options.sendDefaultPii).toBe(false);
  expect(options.defaultIntegrations).toBe(false);
  expect(
    options.beforeSend({
      user: { id: "a" },
      request: { url: "private" },
      breadcrumbs: [],
      message: "safe",
    }),
  ).toEqual({ message: "safe" });
  expect(
    await connectSentry({ enabled: true, dsn: "x" }, {}, async () => {
      throw Error("offline");
    }),
  ).toBe(false);
});
