# EB Volt — SEO Audit & Action Plan

**Site:** https://ebvolt.com/
**Reviewed:** 20 August 2026
**Scope:** Live site + source code (`C:\Users\user\Desktop\EB-Volt`)

---

## Executive summary

The good news first: the SEO *foundations* in your codebase are genuinely strong. You have a clean, sensible URL structure, a proper `robots.txt`, a full `sitemap.xml`, keyword‑targeted city and use‑case landing pages, per‑page titles and meta descriptions, and rich structured data (Organization, WebSite, LocalBusiness, FAQ, Breadcrumb). Whoever set up `seoContent.ts` and the `Seo` component did a thoughtful job.

**But there is one critical problem that currently cancels most of that work out:** the site is a client‑rendered single‑page app, and the pre‑render step that is supposed to give search engines fully‑built HTML **is not running in production.** As a result, every URL on the site — the homepage, `/ev-charging/accra`, every service page — is served to crawlers as the *same* near‑empty shell with the *same* generic homepage title and description, and no body content until JavaScript runs.

I confirmed this on the live site: `https://ebvolt.com/ev-charging/accra` returns the homepage's title ("EB Volt – Premier EV Charging Network") and the homepage meta description, not the Accra‑specific ones that exist in your code. That single issue is the difference between "we have 20 optimised pages" and "Google effectively sees one page." Fixing it is the highest‑leverage thing you can do, and the plumbing is already in place — it's a build‑configuration fix, not a rewrite.

The rest of this document is organised by priority: **Critical → High → Medium → Low**, followed by **off‑site recommendations** and a **prioritised checklist** at the end.

---

## 🔴 Critical issues (fix these first)

### 1. The production build never pre‑renders — crawlers see an empty shell

**What's happening.** Your `package.json` has two build scripts:

- `build` → `vite build && esbuild ...` (no pre‑render)
- `build:seo` → `vite build && node scripts/prerender.mjs && esbuild ...` (with pre‑render)

Your `Dockerfile` runs `RUN pnpm run build` — the one *without* pre‑rendering. On top of that it sets `ENV PUPPETEER_SKIP_DOWNLOAD=true`, so even if you switched scripts, Puppeteer would have no browser to render with.

**Why it matters.** `server/_core/static.ts` is already written to serve `dist/public/<route>/index.html` when a pre‑rendered file exists — but those files are never generated, so it always falls back to the bare `index.html`. Every route therefore ships:

- the generic homepage `<title>` and `<meta description>`, not the per‑page ones,
- an empty `<div id="root">` with no headings or body copy,
- none of the per‑page LocalBusiness / FAQ / Breadcrumb JSON‑LD (those inject via JavaScript).

Googlebot *can* render JavaScript, but it does so on a delay and imperfectly; Bing, social‑media crawlers, WhatsApp/LinkedIn previews and most AI crawlers do **not**. You're leaving your ranking to the one crawler that tries hardest, and even it is receiving duplicate titles/descriptions across every URL — a classic dilution signal.

**The fix.** Make the production image run the SEO build and give Puppeteer a browser. Concretely, edit the `build` stage of the `Dockerfile`:

```dockerfile
FROM deps AS build
# Install the system libraries Chromium needs, then a Chromium build for Puppeteer
RUN apt-get update && apt-get install -y --no-install-recommends \
      chromium ca-certificates fonts-liberation \
    && rm -rf /var/lib/apt/lists/*
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
COPY . .
RUN pnpm run build:seo        # <-- was: pnpm run build
```

Then in `scripts/prerender.mjs`, pass the executable path to `puppeteer.launch` so it uses the system Chromium:

```js
const browser = await puppeteer.launch({
  headless: "new",
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,   // add this line
  args: ["--no-sandbox"],
});
```

**How to verify after deploy.** `curl -s https://ebvolt.com/ev-charging/accra | grep -i "<title>"` should return *"EV Charging in Accra, Ghana | EB Volt"*, not the homepage title. Then submit the site in Google Search Console and use the URL Inspection tool's "View crawled page" to confirm the rendered HTML contains the city copy and JSON‑LD.

> If you'd rather not manage Chromium in Docker at all, the cleaner long‑term alternative is to migrate the front end to a framework with built‑in SSR/SSG (Next.js or Astro). That's a bigger project; the Docker fix above gets you 95% of the benefit now.

---

### 2. Unknown URLs return HTTP 200 instead of 404 (soft 404s)

**What's happening.** I requested `https://ebvolt.com/this-page-does-not-exist-xyz123` and the server returned the normal homepage shell with a **200 OK** status, not a 404. Your SPA renders a `NotFound` component client‑side, but the HTTP status the crawler receives is still 200.

**Why it matters.** Google treats "200 status on a page that's really 'not found'" as a *soft 404*. It wastes crawl budget, can cause junk/expired URLs to sit in the index, and is a documented quality issue in Search Console.

**The fix.** In `server/_core/static.ts`, when no static file and no pre‑rendered route match, decide whether the path is a known route. Serve the pre‑rendered `404` file (your sitemap‑driven pre‑render already produces `/404`) with a real 404 status for anything that isn't a known route:

```js
// after the prerendered-file check, before the final fallback:
const known = KNOWN_ROUTES.has(urlPath) || /^\/ev-charging\/(accra|kumasi|tema|takoradi)$/.test(urlPath);
if (!known) {
  const notFound = path.resolve(distPath, "404", "index.html");
  return res
    .status(404)
    .sendFile(fs.existsSync(notFound) ? notFound : path.resolve(distPath, "index.html"));
}
```

(Build `KNOWN_ROUTES` from the same route list you already keep in `App.tsx` / the sitemap so the two stay in sync.)

---

## 🟠 High priority

### 3. Oversized, unoptimised images and a 25 MB autoplay hero video

Your hero and section images are extremely heavy for a site whose core audience is on Ghanaian mobile networks and mobile data:

| File | Size |
|---|---|
| `hero_ev_dawn.mp4` (autoplay hero video) | **25.7 MB** |
| `sustainability_bg_8949fa1f.png` | **6.5 MB** |
| `hero_charging_f0301604.png` | **5.3 MB** |
| `charging_steps_28dee001.png` | **3.4 MB** |
| `hero_map_bg_85e4564f.png` | **3.4 MB** |
| `app_mockup_b7c11162.png` | **2.9 MB** |

Core Web Vitals (Largest Contentful Paint in particular) are a ranking factor, and this much weight above the fold will produce poor LCP on mobile and burn users' data before the page is usable. Recommended actions:

- Convert all PNG photos/backgrounds to **WebP or AVIF** and resize to the largest size they're actually displayed at (a background shown at ~1600px wide never needs to be a 4000px PNG). Expect 80–95% size reductions.
- Compress and shorten the hero video, offer a much smaller poster‑image fallback, and consider not autoplaying a 25 MB file on mobile at all — a static optimised hero image often performs better for both speed and conversions.
- Add explicit `width` and `height` (or an `aspect-ratio`) to every `<img>` to prevent layout shift (CLS). Most of your images currently have none.
- You already use `loading="lazy"` on the charger‑type images — extend that to all below‑the‑fold images.

### 4. Two images are hot‑linked from Unsplash

In `Home.tsx` the "Charging Technology" section pulls two photos directly from `images.unsplash.com`. That's an external dependency you don't control (it can change, rate‑limit, or disappear), it adds third‑party connections that slow the page, and stock photos of generic chargers are weaker for brand/E‑E‑A‑T than real photos of *your* stations. Replace them with self‑hosted, optimised images of actual EB Volt hardware where possible.

### 5. Duplicate / conflicting `document.title` on the homepage

`Home.tsx` sets `document.title = "EB Volt - Premier EV Charging Network"` in its own `useEffect`, while the `<Seo>` component *also* sets the title from `PAGE_SEO.home` (which uses an en‑dash: "EB Volt – Premier EV Charging Network"). Two components fighting over the title is fragile, and the punctuation is inconsistent with the rest of the site. Remove the manual `document.title` line in `Home.tsx` and let `<Seo>` be the single source of truth.

### 6. Set up Google Search Console + Bing Webmaster Tools + analytics verification

I couldn't confirm these are in place, and they're essential for measuring everything below:

- **Google Search Console** — verify the domain, submit `sitemap.xml`, and watch the Coverage/Indexing and Core Web Vitals reports. This is where you'll confirm fix #1 actually worked.
- **Bing Webmaster Tools** — same, and it feeds other engines.
- Your analytics snippet in `index.html` uses unresolved placeholders (`%VITE_ANALYTICS_ENDPOINT%/umami`, `%VITE_ANALYTICS_WEBSITE_ID%`). If those env vars aren't set at build time, the script tag is broken and you're collecting no data. Confirm the values are injected in the production build, or remove the tag.

---

## 🟡 Medium priority

### 7. Claim and optimise a Google Business Profile

For a location‑based service in Ghana, a **Google Business Profile** (formerly Google My Business) is arguably as important as the website for local "EV charging near me" searches and Google Maps visibility. Create one per city hub if you have physical stations, with accurate hours, photos, and the same NAP (name, address, phone) as your `LocalBusiness` schema. This also strengthens the structured data you already emit.

### 8. Strengthen the homepage H1 for your primary keyword

Your homepage H1 is *"Charge Anywhere in Ghana. Arrive Confident."* — good for branding, but it doesn't contain your core search term. Consider working "EV charging" into the H1 or the first H2, e.g. an H1 of *"EV Charging in Ghana — Charge Anywhere, Arrive Confident"* or an early H2 like *"Ghana's solar‑powered EV charging network."* The page body already uses the phrasing well; it's mainly the H1 that's under‑optimised.

### 9. Add `LocalBusiness`/`Organization` NAP consistency and a physical address

Your `Organization` schema currently gives locality/region/country (Accra / Greater Accra / GH) but no street address. If you have a real address, add it — it improves local trust signals and lets the schema qualify more fully. Keep the phone (+233 59 560 2717) and email identical everywhere (site, schema, Google Business Profile, social profiles).

### 10. Fix misleading footer links and use client‑side navigation consistently

- In `Footer.tsx`, both "Careers" and "Press" link to `/contact`. That's thin and can read as low‑quality. Either build simple real pages or remove the links until you have content.
- The footer's "Privacy Policy" and "Terms of Service" use plain `<a href>` tags, causing full page reloads instead of your app's client‑side navigation. Switch them to the `Link` component for consistency (minor, but tidy).
- You maintain two privacy routes (`/privacy` and `/privacy-policy`). You've correctly canonicalised `/privacy-policy` → `/privacy`, which is fine — just make sure only `/privacy` is in the sitemap (it is) and prefer linking to `/privacy` internally.

### 11. Add an XML sitemap `lastmod` process and consider an image/video sitemap

Your sitemap dates are hard‑coded to `2026-08-12`. When you publish or materially update a page, bump its `lastmod` (ideally generate the sitemap at build time from real file dates). Fresh, accurate `lastmod` values help recrawling.

### 12. Content depth & internal linking opportunities

Your city, use‑case (taxi, apartments) and guide pages are a strong start. To compound them:

- Add more **guide/blog content** targeting real Ghanaian EV search intent: "cost of an EV in Ghana," "best EVs for Ghana," "charging an EV during dumsor," "EV import duties Ghana," etc. This is how you earn top‑of‑funnel traffic and backlinks.
- Add contextual **internal links** from the homepage and guides into the city pages (e.g. link "Accra," "Kumasi," "Tema," "Takoradi" wherever they're mentioned). Right now the city pages mostly link to each other; pull link equity into them from higher‑authority pages too.
- Expand the two use‑case pages into a small hub (delivery fleets, ride‑hailing, corporate fleets, estates/apartments) since these are high commercial‑intent queries.

---

## 🟢 Low priority / nice‑to‑have

- **`hreflang`:** You target Ghana in English only, so this isn't urgent, but adding `hreflang="en-gh"` (and `x-default`) is a small signal that reinforces geo‑targeting.
- **Favicon/PWA:** Favicons and `theme-color` are in place. If you want the "install app" experience, add a `manifest.json` (you're already positioning a mobile app).
- **Open Graph image dimensions:** Add `og:image:width` / `og:image:height` and ensure the OG image is a reasonably sized (~1200×630) optimised file — the current OG image points at the 5.3 MB hero PNG, which is slow for link‑preview crawlers.
- **Breadcrumbs UI:** You emit Breadcrumb JSON‑LD on city pages but don't render a visible breadcrumb trail. Adding the visible UI (and extending breadcrumbs to service/guide pages) is a small UX + SEO win.
- **Accessibility passes double as SEO:** the navigation lives entirely inside a hamburger drawer at all breakpoints. It's crawlable (the links are in the DOM), but a couple of always‑visible primary links (Find a Charger, How It Works) could help both users and crawlers.

---

## Off‑site / ongoing (rankings aren't only on‑page)

Technical fixes get you *eligible* to rank; these get you *ranking*:

1. **Backlinks & PR.** Get listed in Ghanaian business directories, EV/clean‑energy publications, startup and investor coverage, and partner sites. Your "Investors" and "Business Partnerships" angles are natural PR hooks. Quality local links are the strongest off‑page lever in a low‑competition niche like Ghanaian EV charging.
2. **Google Business Profile reviews.** Encourage charging customers to leave reviews; volume and recency of reviews drive local pack rankings.
3. **Social & video.** You already have TikTok/Instagram/X. Consistent posting that links back builds brand signals; embedding your own hosted video (optimised) on key pages can improve dwell time.
4. **Consistency of NAP** across every directory and profile — mismatches dilute local ranking.

---

## Prioritised action checklist

**Do now (biggest impact, mostly one‑time):**

1. Switch the Docker build to `build:seo` and give Puppeteer a Chromium binary (issue #1). *This is the single most important fix.*
2. Return real 404 status codes for unknown URLs (issue #2).
3. Verify the site in Google Search Console + Bing, submit the sitemap, confirm analytics is actually firing (issue #6).

**Do next (weeks 1–3):**

4. Compress/convert all images to WebP/AVIF, resize them, add width/height, and slim or replace the 25 MB hero video (issue #3).
5. Replace the two Unsplash hot‑links with self‑hosted station photos (issue #4).
6. Remove the duplicate `document.title` in `Home.tsx` (issue #5).
7. Create and optimise a Google Business Profile (issue #7).

**Ongoing:**

8. Strengthen the homepage H1, fix footer links, add address to schema (issues #8–10).
9. Automate sitemap `lastmod`; expand guides/blog and internal linking (issues #11–12).
10. Build backlinks, gather reviews, keep NAP consistent (off‑site section).

---

*Prepared from a review of the live site and the EB‑Volt source. The headline takeaway: your on‑page SEO work is already good — it's just not reaching search engines because the production build skips pre‑rendering. Fix that one deployment setting and most of the value you've already built starts working.*
