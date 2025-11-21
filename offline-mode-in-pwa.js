//The code below belongs in a service worker

const CACHE_NAME = 'resource-cache';
const PRECACHE_ASSETS = [
    './', // Alias for index.html
    './index.html',
    'https://cdn.tailwindcss.com'
];

// 1. Install Event: Pre-cache assets for "Cache Only" and "Cache First" demos
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Activate immediately
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS);
        })
    );
});

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// --- STRATEGIES ---

// Strategy A: Cache Only
// Good for: Generic offline fallbacks, static assets that never change.
const cacheOnly = (request) => {
    return caches.match(request).then((response) => {
        return response || new Response("Item not in cache!", { status: 404 });
    });
};

// Strategy B: Network Only
// Good for: Real-time API calls, non-get requests (POST), analytics.
const networkOnly = (request) => {
    return fetch(request).catch(() => {
        return new Response("Network error (You are offline)", { status: 503 });
    });
};

// Strategy C: Cache First (Falling back to Network)
// Good for: Images, fonts, scripts (things that don't change often).
const cacheFirst = (request) => {
    return caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, networkResponse.clone());
                return networkResponse;
            });
        });
    });
};

// Strategy D: Stale While Revalidate
// Good for: Avatars, timelines, latest news (show cached immediately, update in background).
const staleWhileRevalidate = (request) => {
    return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
            const networkFetch = fetch(request).then((networkResponse) => {
                cache.put(request, networkResponse.clone());
                return networkResponse;
            });
            // Return cached response immediately if available, otherwise wait for network
            return cachedResponse || networkFetch;
        });
    });
};

// 3. Fetch Event: Router Logic
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Demo Route 1: Force Network Only for /api/ requests
    // (We will use jsonplaceholder for the demo)
    if (url.pathname.includes('/todos/')) {
        event.respondWith(networkOnly(event.request));
        return;
    }

    // Demo Route 2: Cache Only (for specific tested files)
    // In a real app, this might be your 'offline.html' page
    if (url.searchParams.get('strategy') === 'cache-only') {
        event.respondWith(cacheOnly(event.request));
        return;
    }

    // Demo Route 3: Stale While Revalidate (Self-updating data)
    if (url.searchParams.get('strategy') === 'swr') {
        event.respondWith(staleWhileRevalidate(event.request));
        return;
    }

    // Default: Cache First for everything else (like HTML, CSS)
    event.respondWith(cacheFirst(event.request));
});
