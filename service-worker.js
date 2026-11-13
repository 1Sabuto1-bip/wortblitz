const CACHE_NAME = "wortblitz-v19";
const ANLAUT_IMAGES = ["a", "e", "i", "o", "u", "au", "eu", "ei", "oe", "ue", "sch", "g", "b", "d", "w", "s", "l", "m", "ch", "r", "k", "p", "t", "f", "z", "h", "n", "y", "x", "v", "c", "qu", "sp", "st"].map((symbol) => `./anlaute/${symbol}.png`);
const WRITING_CARDS = ["b", "c", "d", "p"].map((letter) => `./writing-cards/${letter}.jpg`);
const APP_FILES = ["./", "./index.html", "./styles.css", "./app.js", "./writing.js", "./words.json", "./secret-words.csv", "./manifest.webmanifest", "./icons/icon.svg", ...ANLAUT_IMAGES, ...WRITING_CARDS];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      }
      return response;
    }).catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
  );
});
