import { useEffect } from "react";

/* ============================================================
   EB Volt - Reusable SEO head manager
   Sets <title>, meta description, canonical, Open Graph / Twitter
   cards, robots, and optional JSON-LD structured data.
   Works in a client-rendered SPA by upserting tags into <head>.
   ============================================================ */

export const SITE_URL = "https://ebvolt.com";
export const SITE_NAME = "EB Volt";
const DEFAULT_IMAGE = `${SITE_URL}/manus-storage/hero_charging_f0301604.png`;

type JsonLd = Record<string, unknown>;

interface SeoProps {
  /** Full <title>. Keep under ~60 chars. */
  title: string;
  /** Meta description. Keep between ~120-160 chars. */
  description: string;
  /** Path only, e.g. "/ev-charging/accra". Used for canonical + og:url. */
  canonicalPath?: string;
  /** Absolute or root-relative social share image. */
  image?: string;
  /** og:type, defaults to "website". Use "article" for guides. */
  type?: string;
  /** One or more JSON-LD structured-data blocks. */
  jsonLd?: JsonLd | JsonLd[];
  /** Set true to keep a page out of the index. */
  noindex?: boolean;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  // Reuse an existing tag (e.g. a static default from index.html) if present,
  // otherwise create one. Avoids duplicate meta tags across route changes.
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("data-seo", "true");
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("data-seo", "true");
  el.setAttribute("href", href);
}

export default function Seo({
  title,
  description,
  canonicalPath,
  image,
  type = "website",
  jsonLd,
  noindex,
}: SeoProps) {
  useEffect(() => {
    const url = canonicalPath
      ? `${SITE_URL}${canonicalPath}`
      : typeof window !== "undefined"
        ? window.location.href
        : SITE_URL;
    const img = image
      ? image.startsWith("http")
        ? image
        : `${SITE_URL}${image}`
      : DEFAULT_IMAGE;

    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex,nofollow" : "index,follow");
    upsertLink("canonical", url);

    // Open Graph
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", img);
    upsertMeta("property", "og:site_name", SITE_NAME);

    // Twitter
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", img);

    // JSON-LD structured data
    const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
    const scripts = blocks.map((block) => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.setAttribute("data-seo", "true");
      s.text = JSON.stringify(block);
      document.head.appendChild(s);
      return s;
    });

    return () => {
      scripts.forEach((s) => s.remove());
    };
  }, [title, description, canonicalPath, image, type, noindex, JSON.stringify(jsonLd)]);

  return null;
}
