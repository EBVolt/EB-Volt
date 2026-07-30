/* ============================================================
   EB Volt - Static prerender step (post `vite build`)
   ------------------------------------------------------------
   Renders each public route in a headless browser and writes the
   fully-rendered HTML (including <Seo>-injected <title>, meta,
   Open Graph and JSON-LD) to dist/public/<route>/index.html.

   Search-engine crawlers then receive complete HTML per route,
   while real users still get the live SPA.

   Requires: puppeteer  (npm i -D puppeteer)
   Run:      node scripts/prerender.mjs      (after `vite build`)
   ============================================================ */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist", "public");
const PORT = 4183;

// Routes to prerender — read from the sitemap so the two stay in sync.
function routesFromSitemap() {
  const sitemapPath = path.join(DIST, "sitemap.xml");
  if (!fs.existsSync(sitemapPath)) return ["/"];
  const xml = fs.readFileSync(sitemapPath, "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const paths = locs
    .map((u) => u.replace(/^https?:\/\/[^/]+/, ""))
    .map((p) => (p === "" ? "/" : p.replace(/\/$/, "") || "/"))
    // Skip utility routes that should not be indexed
    .filter((p) => !/^\/(account|admin|unsubscribe|ussd-simulator)/.test(p));
  return [...new Set(paths)];
}

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml",
  ".ico": "image/x-icon", ".mp4": "video/mp4", ".woff2": "font/woff2",
  ".xml": "application/xml", ".txt": "text/plain",
};

// Minimal static server with SPA fallback (no extra deps).
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      let filePath = path.join(DIST, urlPath);
      if (!filePath.startsWith(DIST)) { res.statusCode = 403; return res.end(); }
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.setHeader("Content-Type", MIME[path.extname(filePath)] || "application/octet-stream");
        return fs.createReadStream(filePath).pipe(res);
      }
      // SPA fallback
      res.setHeader("Content-Type", "text/html");
      fs.createReadStream(path.join(DIST, "index.html")).pipe(res);
    });
    server.listen(PORT, () => resolve(server));
  });
}

async function run() {
  if (!fs.existsSync(path.join(DIST, "index.html"))) {
    console.error(`[prerender] ${DIST}/index.html not found — run \`vite build\` first.`);
    process.exit(1);
  }

  let puppeteer;
  try {
    puppeteer = (await import("puppeteer")).default;
  } catch {
    console.error("[prerender] puppeteer is not installed. Run: npm i -D puppeteer");
    process.exit(1);
  }

  const routes = routesFromSitemap();
  const server = await startServer();
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });

  console.log(`[prerender] rendering ${routes.length} routes...`);
  for (const route of routes) {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle0", timeout: 30000 });
    // Give the <Seo> effect a tick to inject head tags.
    await page.evaluate(() => new Promise((r) => setTimeout(r, 150)));
    const html = "<!doctype html>\n" + (await page.evaluate(() => document.documentElement.outerHTML));
    await page.close();

    const outDir = route === "/" ? DIST : path.join(DIST, route);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "index.html"), html, "utf8");
    console.log(`  ✓ ${route}`);
  }

  await browser.close();
  server.close();
  console.log("[prerender] done.");
}

run();
