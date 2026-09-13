import {
  cpSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";

const mode = process.argv[2] || "preview";
if (!["preview", "production"].includes(mode))
  throw new Error("Use preview or production");
const production = mode === "production";
const target = production ? resolve("work/joy-production") : resolve("dist");
if (production) {
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
  cpSync("dist", target, { recursive: true });
}
const url = production
  ? "https://joyrestaurante.com/"
  : "https://joy-sushi-bar-nova-versao.jefersojagp.chatgpt.site/";
const title = "Joy Sushi Bar | Restaurante japonês em Alphaville, Salvador";
const description =
  "Sushis, sashimis, temakis e combinados no Alpha Mall, em Alphaville, Salvador. Veja o cardápio do Joy e peça por WhatsApp, iFood ou 99Food.";
let html = readFileSync(`${target}/index.html`, "utf8");
const doc = new JSDOM(html).window.document;
const restaurant = {
  "@type": "Restaurant",
  "@id": `${url}#restaurante`,
  name: "Joy Sushi Bar",
  url,
  description,
  telephone: "+5571981890965",
  servesCuisine: "Japonesa",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Av. Alphaville, 151, Shopping Alpha Mall, loja 11 — Alphaville",
    addressLocality: "Salvador",
    addressRegion: "BA",
    addressCountry: "BR",
  },
  image: ["barca.jpg", "sashimi.jpg", "temaki.jpg"].map(
    (file) => `${url}assets/${file}`,
  ),
  logo: `${url}assets/logo.png`,
  hasMenu: `${url}#cardapio`,
  hasMap: doc.querySelector(".visit-photo").href,
  sameAs: [doc.querySelector(".instagram-center").href],
};
const graph = {
  "@context": "https://schema.org",
  "@graph": [
    restaurant,
    {
      "@type": "WebSite",
      "@id": `${url}#website`,
      name: "Joy Sushi Bar",
      url,
      inLanguage: "pt-BR",
      publisher: { "@id": restaurant["@id"] },
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: "pt-BR",
      isPartOf: { "@id": `${url}#website` },
      mainEntity: { "@id": restaurant["@id"] },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${url}assets/barca.jpg`,
        width: 1600,
        height: 1000,
      },
    },
  ],
};
const robots = production
  ? "index, follow, max-image-preview:large"
  : "noindex, nofollow";
const tags = `<!-- joy-seo:start -->
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Joy Sushi Bar">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${url}assets/barca.jpg">
<meta property="og:image:width" content="1600">
<meta property="og:image:height" content="1000">
<meta property="og:image:alt" content="Barca do Joy Sushi Bar com sushis e sashimis">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${url}assets/barca.jpg">
<meta name="twitter:image:alt" content="Barca do Joy Sushi Bar com sushis e sashimis">
<script type="application/ld+json">${JSON.stringify(graph).replaceAll("<", "\\u003c")}</script>
<!-- joy-seo:end -->`;
html = html.replace(
  /<!-- joy-seo:start -->[\s\S]*?<!-- joy-seo:end -->\s*/g,
  "",
);
html = html
  .replace(/<title>[\s\S]*?<\/title>/g, "")
  .replace(/<meta name="description"[^>]*>/g, "");
html = html.replace("</head>", `${tags}\n</head>`);
writeFileSync(`${target}/index.html`, html);
writeFileSync(
  `${target}/robots.txt`,
  production
    ? `User-agent: *\nAllow: /\n\nSitemap: ${url}sitemap.xml\n`
    : "User-agent: *\nDisallow: /\n",
);
rmSync(`${target}/sitemap.xml`, { force: true });
if (production) {
  writeFileSync(
    `${target}/sitemap.xml`,
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${url}</loc></url></urlset>\n`,
  );
}
console.log(`SEO ${mode}: ${target}`);
