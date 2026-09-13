import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { expect, it } from "vitest";

it("exports indexable production metadata without changing the private preview", () => {
  const preview = readFileSync("dist/index.html", "utf8");
  execFileSync(process.execPath, ["scripts/prepare-seo.mjs", "production"]);
  expect(readFileSync("dist/index.html", "utf8")).toBe(preview);
  const privateDoc = new JSDOM(preview).window.document;
  expect(privateDoc.querySelector('meta[name="robots"]').content).toContain(
    "noindex",
  );
  expect(readFileSync("dist/robots.txt", "utf8")).toContain("Disallow: /");
  const doc = new JSDOM(readFileSync("work/joy-production/index.html", "utf8"))
    .window.document;
  const url = "https://joyrestaurante.com/";
  expect(doc.querySelectorAll("title")).toHaveLength(1);
  expect(doc.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
  expect(doc.querySelector('link[rel="canonical"]').href).toBe(url);
  expect(doc.querySelector('meta[property="og:url"]').content).toBe(url);
  expect(doc.querySelector('meta[name="robots"]').content).not.toContain(
    "noindex",
  );
  const sitemap = new JSDOM(
    readFileSync("work/joy-production/sitemap.xml", "utf8"),
    { contentType: "application/xml" },
  ).window.document;
  expect(
    [...sitemap.querySelectorAll("loc")].map((n) => n.textContent),
  ).toEqual([url]);
  expect(readFileSync("work/joy-production/robots.txt", "utf8")).toContain(
    `Sitemap: ${url}sitemap.xml`,
  );
  const graph = JSON.parse(
    doc.querySelector('script[type="application/ld+json"]').textContent,
  )["@graph"];
  const business = graph.find((n) => n["@type"] === "Restaurant");
  expect(business.telephone).toBe(
    doc.querySelector('a[href^="tel:"]').href.replace("tel:", ""),
  );
  expect(business.sameAs).toContain(
    doc.querySelector(".instagram-center").href,
  );
  expect(doc.querySelector("address").textContent).toContain(
    business.address.addressLocality,
  );
  expect(business.aggregateRating).toBeUndefined();
  expect(business.openingHoursSpecification).toBeUndefined();
  for (const image of business.image) {
    expect(image.startsWith(url)).toBe(true);
    expect(existsSync(`work/joy-production/${image.slice(url.length)}`)).toBe(
      true,
    );
  }
});

it("keeps the complete menu and local answers accessible without JavaScript", () => {
  const doc = new JSDOM(readFileSync("dist/index.html", "utf8")).window
    .document;
  expect(doc.querySelectorAll("h1")).toHaveLength(1);
  expect(doc.querySelector("h1").textContent).toBe("VOCÊ MERECEJOY!");
  expect(doc.querySelector(".hero-description").textContent).toContain(
    "Alphaville, Salvador",
  );
  expect(doc.querySelectorAll(".menu-item")).toHaveLength(141);
  expect(doc.querySelectorAll(".menu-group[hidden]")).toHaveLength(0);
  expect(doc.querySelectorAll("#duvidas details")).toHaveLength(5);
  for (const a of doc.querySelectorAll('#duvidas a[href^="#"]')) {
    expect(doc.getElementById(a.hash.slice(1))).not.toBeNull();
  }
});
