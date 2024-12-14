const cacheName = "solzam-PuzzleCoin-1.0";

const contentToCache = [
    "Build/dcc6c041abf02de3f4a97fad5698b6ee.loader.js",
    "Build/c995577daacc0e5de1ccd9bacd055f54.framework.js",
    "Build/834caf12ce0701b7b887e0f57f48fa20.data",
    "Build/9921fe74ef6f2db985b863cca195e440.wasm",
    "TemplateData/style.css"
];

// ���� ��Ŀ ��ġ
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing and caching app shell');

    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(contentToCache);
        })
    );
});


// ���� ĳ�� ����
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating and cleaning old caches');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== cacheName) {
                        console.log(`[Service Worker] Deleting old cache: ${name}`);
                        return caches.delete(name);
                    }
                })
            );
        })
    );
});


// ��Ʈ��ũ ��û ó��
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {

            // ĳ�õ� ���ҽ��� �ִ� ��� ��ȯ
            if (cachedResponse) {
                console.log(`[Service Worker] Serving from cache: ${event.request.url}`);
                return cachedResponse;
            }

            // ������ ��Ʈ��ũ���� �������� ĳ�ÿ� �߰�
            return fetch(event.request).then((networkResponse) => {
                return caches.open(cacheName).then((cache) => {
                    console.log(`[Service Worker] Caching new resource: ${event.request.url}`);
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        })
    );
});
