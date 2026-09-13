export async function connectSentry(
  config,
  win = window,
  load = () => import("../vendor/sentry.js"),
) {
  if (!config.enabled || !config.dsn) return false;
  try {
    const sdk = await load();
    sdk.init({
      dsn: config.dsn,
      environment: config.environment || "production",
      release: "joy-sushi-bar@1.0.0",
      defaultIntegrations: false,
      sendDefaultPii: false,
      tracesSampleRate: 0,
      beforeSend(event) {
        delete event.user;
        delete event.request;
        delete event.breadcrumbs;
        return event;
      },
    });
    win.Sentry = sdk;
    return true;
  } catch {
    return false;
  }
}
