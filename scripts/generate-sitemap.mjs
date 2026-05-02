import fs from "node:fs/promises";
import path from "node:path";

const SITE_URL = process.env.SITE_URL || "https://trippolama.com";
const API_URL =
  process.env.VITE_API_URL ||
  process.env.API_URL ||
  "https://wtc-backend-production.up.railway.app";

const today = new Date().toISOString().slice(0, 10);

const staticRoutes = [
  { loc: "/", priority: "1.0" },
  { loc: "/packages", priority: "0.9" },
  { loc: "/trips", priority: "0.8" },
  { loc: "/kodaikanal", priority: "0.8" },
  { loc: "/kodaikanal/mannavanur", priority: "0.8" },
  { loc: "/kodaikanal/poondi", priority: "0.8" },
  { loc: "/kodaikanal/kookal", priority: "0.8" },
  { loc: "/ooty", priority: "0.8" },
  { loc: "/munnar", priority: "0.8" },
  { loc: "/valapari", priority: "0.8" },
  { loc: "/blog", priority: "0.7" },
  { loc: "/about", priority: "0.7" },
  { loc: "/reviews", priority: "0.7" },
  { loc: "/faq", priority: "0.6" },
  { loc: "/safety", priority: "0.6" },
  { loc: "/travel-agents", priority: "0.6" },
  { loc: "/roadside-assistance", priority: "0.6" },
  { loc: "/host/register", priority: "0.5" },
  { loc: "/host/login", priority: "0.5" },
];

const toXmlUrl = ({ loc, priority, lastmod = today }) => {
  const full = `${SITE_URL}${loc}`;
  return [
    "<url>",
    `  <loc>${full}</loc>`,
    `  <lastmod>${lastmod}</lastmod>`,
    `  <priority>${priority}</priority>`,
    "</url>",
  ].join("\n");
};

const fetchPackages = async () => {
  const endpoint = `${API_URL.replace(/\/+$/, "")}/api/packages`;
  const res = await fetch(endpoint, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Failed to fetch packages: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

const buildPackageRoutes = (packages = []) => {
  const unique = new Set();
  const routes = [];

  for (const item of packages) {
    const id = item?._id ? String(item._id).trim() : "";
    if (!id) continue;

    const loc = `/packages/${id}`;
    if (unique.has(loc)) continue;
    unique.add(loc);

    const lastmodRaw = item?.updatedAt || item?.createdAt || today;
    const lastmod = String(lastmodRaw).slice(0, 10);

    routes.push({ loc, priority: "0.8", lastmod });
  }

  return routes;
};

const buildSitemapXml = (urls) => {
  const body = urls.map(toXmlUrl).join("\n\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n${body}\n\n</urlset>\n`;
};

const run = async () => {
  let packageRoutes = [];

  try {
    const packages = await fetchPackages();
    packageRoutes = buildPackageRoutes(packages);
    console.log(`SITEMAP: loaded ${packageRoutes.length} package URLs from API`);
  } catch (error) {
    console.warn(`SITEMAP WARNING: ${error.message}`);
    console.warn("SITEMAP: continuing with static routes only");
  }

  const all = [...staticRoutes, ...packageRoutes];
  const xml = buildSitemapXml(all);
  const outputPath = path.join(process.cwd(), "public", "sitemap.xml");
  await fs.writeFile(outputPath, xml, "utf8");
  console.log(`SITEMAP: written ${all.length} URLs to public/sitemap.xml`);
};

run().catch((error) => {
  console.error("SITEMAP ERROR:", error);
  process.exit(1);
});
