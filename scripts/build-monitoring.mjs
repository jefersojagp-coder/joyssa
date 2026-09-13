import { build } from "esbuild";

await build({
  stdin: {
    contents: 'export { init, captureMessage } from "@sentry/browser";',
    resolveDir: process.cwd(),
  },
  bundle: true,
  format: "esm",
  minify: true,
  target: "es2022",
  outfile: "dist/vendor/sentry.js",
  legalComments: "eof",
});
