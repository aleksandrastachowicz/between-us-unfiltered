// Between Us service worker: makes the app installable and lets it open without a connection.
// Pages: network first (always the newest version), cached copy when offline.
// Built files (/assets/…, hashed names) and icons: cache first. Fonts: cached after first use.
const VERSION = "bu-v3";
const SHELL = ["/", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png", "/og-image.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Never touch login, database or AI calls.
  if (url.hostname.includes("supabase") || url.pathname.startsWith("/auth") || url.pathname.startsWith("/~") || url.pathname.startsWith("/__")) return;

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // Keep only a real, working page as the offline copy (never an error page).
          if (res.ok && url.pathname === "/") {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put("/", copy));
          }
          return res;
        })
        .catch(() => caches.match("/").then((r) => r || Response.error())),
    );
    return;
  }

  const sameOrigin = url.origin === self.location.origin;
  const isStatic = sameOrigin && (url.pathname.startsWith("/assets/") || url.pathname.startsWith("/icons/"));
  const isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";

  if (isStatic || isFont) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok || res.type === "opaque") {
              const copy = res.clone();
              caches.open(VERSION).then((c) => c.put(req, copy));
            }
            return res;
          }),
      ),
    );
  }
});
