const CACHE_NAME = "portfolio-offline-v1";
const PAGE_PATHS = [
  "./",
  "./index.html",
  "./index_en.html",
  "./blog/blog000.html",
  "./blog/blog0000.html",
  "./blog/blog001.html",
  "./portfolio-details.html",
  "./portfolio001-details.html",
  "./portfolio002-details.html",
  "./portfolio003-details.html",
  "./portfolio004-details.html",
  "./portfolio005-details.html",
  "./portfolio006-details.html",
  "./portfolio007-details.html",
  "./portfolio008-details.html",
  "./portfolio009-details.html",
  "./portfolio010-details.html",
  "./portfolio011-details.html",
  "./subpages/clock/index.html",
  "./subpages/simon-says/index.html",
];
const SCOPE_URL = new URL(self.registration.scope);
const HTML_REFERENCE_PATTERN =
  /\b(?:href|src|data-src|poster)\s*=\s*(["'])(.*?)\1/gi;
const CSS_URL_PATTERN = /url\(\s*(?:(["'])(.*?)\1|([^)]*?))\s*\)/gi;

function localReferences(content, baseUrl, pattern, css = false) {
  const references = new Set();
  pattern.lastIndex = 0;
  for (const match of content.matchAll(pattern)) {
    const value = (css ? match[2] || match[3] : match[2]).trim();
    if (!value || value.startsWith("#")) continue;

    try {
      const url = new URL(value, baseUrl);
      url.hash = "";
      if (
        url.origin === SCOPE_URL.origin &&
        url.pathname.startsWith(SCOPE_URL.pathname)
      ) {
        references.add(url.href);
      }
    } catch (error) {
      console.warn("Ungültige Offline-Ressource übersprungen:", value, error);
    }
  }
  return references;
}

async function saveResponse(cache, url, response) {
  try {
    await cache.put(url, response.clone());
  } catch (error) {
    console.error("Ressource konnte nicht offline gespeichert werden:", url, error);
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const resources = new Set();
      const pageUrls = PAGE_PATHS.map((path) => new URL(path, SCOPE_URL).href);

      for (const pageUrl of pageUrls) {
        const response = await fetch(pageUrl);
        if (!response.ok) {
          throw new Error(`Portfolio-Seite konnte nicht geladen werden: ${pageUrl}`);
        }

        await saveResponse(cache, pageUrl, response);
        const html = await response.text();
        for (const resource of localReferences(
          html,
          pageUrl,
          HTML_REFERENCE_PATTERN
        )) {
          if (!pageUrls.includes(resource) && resource !== pageUrl) {
            resources.add(resource);
          }
        }
      }

      const pending = [...resources];
      const cached = new Set();
      while (pending.length > 0) {
        const batch = pending.splice(0, 8);
        await Promise.all(
          batch.map(async (url) => {
            if (cached.has(url)) return;
            cached.add(url);

            try {
              const response = await fetch(url);
              if (!response.ok) {
                console.warn("Offline-Ressource nicht verfügbar:", url, response.status);
                return;
              }

              await saveResponse(cache, url, response);
              if (url.endsWith(".css")) {
                const css = await response.text();
                for (const nestedResource of localReferences(
                  css,
                  url,
                  CSS_URL_PATTERN,
                  true
                )) {
                  if (!cached.has(nestedResource)) pending.push(nestedResource);
                }
              }
            } catch (error) {
              console.warn("Offline-Ressource konnte nicht geladen werden:", url, error);
            }
          })
        );
      }

      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(
            (cacheName) =>
              cacheName.startsWith("portfolio-offline-") &&
              cacheName !== CACHE_NAME
          )
          .map((cacheName) => caches.delete(cacheName))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (
    request.method !== "GET" ||
    url.origin !== SCOPE_URL.origin ||
    !url.pathname.startsWith(SCOPE_URL.pathname)
  ) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request);
        if (response.status === 200) {
          await saveResponse(cache, request, response);
        }
        if (response.ok) return response;

        return (
          (await cache.match(request)) ||
          (request.mode === "navigate"
            ? await cache.match(new URL("./index.html", SCOPE_URL).href)
            : response)
        );
      } catch (error) {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) return cachedResponse;
        if (request.mode === "navigate") {
          const homePage = await cache.match(new URL("./index.html", SCOPE_URL).href);
          if (homePage) return homePage;
        }
        throw error;
      }
    })()
  );
});
