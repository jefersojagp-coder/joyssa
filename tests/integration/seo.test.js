import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { expect, it } from "vitest";

it("exports indexable production metadata without changing the presentation preview", () => {
  const preview = readFileSync("dist/index.html", "utf8");
  execFileSync(process.execPath, ["scripts/prepare-seo.mjs", "production"]);
  expect(readFileSync("dist/index.html", "utf8")).toBe(preview);
  const privateDoc = new JSDOM(preview).window.document;
  expect(privateDoc.querySelector('meta[name="robots"]').content).toContain(
    "noindex",
  );
  expect(readFileSync("dist/robots.txt", "utf8")).toContain("Allow: /");
  expect(readFileSync("dist/robots.txt", "utf8")).not.toMatch(
    /^Disallow: \/$/m,
  );
  const doc = new JSDOM(readFileSync("work/joy-production/index.html", "utf8"))
    .window.document;
  const url = "https://joysushibar.com.br/";
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
  expect(business.openingHoursSpecification).toHaveLength(2);
  expect(business.openingHoursSpecification[0]).toMatchObject({
    opens: "11:00",
    closes: "23:00",
  });
  expect(business.openingHoursSpecification[0].dayOfWeek).toHaveLength(6);
  expect(business.openingHoursSpecification[1]).toMatchObject({
    dayOfWeek: "https://schema.org/Sunday",
    opens: "15:00",
    closes: "23:00",
  });
  const menus = graph.filter((entry) => entry["@type"] === "Menu");
  expect(menus).toHaveLength(2);
  expect(menus[0].hasMenuSection.map((entry) => entry.name)).toEqual([
    "Entradas",
    "Sushis & sashimis",
    "Barcas & combinados",
    "Temakis",
    "Quentes & doces",
    "Bebidas",
  ]);
  for (const menu of menus) {
    expect(business.hasMenu).toContainEqual({ "@id": menu["@id"] });
    expect(
      existsSync(`work/joy-production/${new URL(menu.subjectOf.url).pathname}`),
    ).toBe(true);
  }
  expect(menus[0].subjectOf.url).toContain("cardapio-joy.pdf?v=17");
  expect(menus[1].subjectOf.url).toContain("menu-executivo-joy-v4.pdf");
  expect(doc.documentElement.outerHTML).not.toContain("joyrestaurante.com");
  expect(doc.documentElement.outerHTML).not.toContain(
    "jefersojagp.chatgpt.site",
  );
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
  expect(doc.querySelectorAll("#duvidas details")).toHaveLength(6);
  for (const id of ["joy-menu-panel", "executive-menu-panel"]) {
    expect(doc.getElementById(id).hasAttribute("hidden")).toBe(false);
    expect(doc.getElementById(id).hasAttribute("inert")).toBe(false);
  }
  for (const a of doc.querySelectorAll('#duvidas a[href^="#"]')) {
    expect(doc.getElementById(a.hash.slice(1))).not.toBeNull();
  }
});

it("keeps one canonical and one schema block after repeated SEO generation", () => {
  const before = readFileSync("dist/index.html", "utf8");
  execFileSync(process.execPath, ["scripts/prepare-seo.mjs", "preview"]);
  execFileSync(process.execPath, ["scripts/prepare-seo.mjs", "preview"]);
  expect(readFileSync("dist/index.html", "utf8")).toBe(before);
});
