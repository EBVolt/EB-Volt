import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist.
  // If a prerendered per-route file exists (dist/public/<route>/index.html),
  // serve that so crawlers receive fully-rendered HTML with SEO tags.
  app.use("*", (req, res) => {
    const urlPath = (req.originalUrl || "/").split("?")[0].replace(/\/+$/, "");
    if (req.method === "GET" && urlPath && !urlPath.includes(".")) {
      const prerendered = path.resolve(distPath, "." + urlPath, "index.html");
      if (prerendered.startsWith(distPath) && fs.existsSync(prerendered)) {
        return res.sendFile(prerendered);
      }
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
