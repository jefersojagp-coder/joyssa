import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { JSDOM } from "jsdom";

const html = readFileSync("dist/index.html", "utf8");
const doc = new JSDOM(html).window.document;
assert.equal(doc.querySelectorAll(".menu-item").length, 141);
assert.equal(doc.querySelectorAll(".experience-slide").length, 6);
assert.equal(doc.querySelectorAll(".delivery-option").length, 3);
assert.equal(doc.querySelectorAll('a[href^="mailto:"]').length, 0);
for (const node of doc.querySelectorAll("[src],link[href]")) {
  const src = node.getAttribute("src") || node.getAttribute("href");
  if (!src || src.startsWith("https:")) continue;
  assert(existsSync(`dist/${src.split("?")[0]}`), src);
}
for (const node of doc.querySelectorAll('a[href^="#"]'))
  assert(doc.getElementById(node.hash.slice(1)), node.hash);
for (const file of readdirSync("dist/lib").filter((file) =>
  file.endsWith(".js"),
)) {
  assert(
    !/from ["'](?:node:|.*app\.js)/.test(
      readFileSync(`dist/lib/${file}`, "utf8"),
    ),
    `Invalid browser capability import: ${file}`,
  );
}
console.log("Architecture and restaurant content contracts passed.");
