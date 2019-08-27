const staticCacheName = 'site-static-v3'
const dynamicCacheName = 'site-dynamic-v3'
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/img/dish.png',
    '/pages/fallback.html',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2'
];

// Install service worker
self.addEventListener('install', evt => {
    console.log('Install event')
    evt.waitUntil(
        caches.open(staticCacheName).then((cache) => {
        console.log('Caching shell assets')
        cache.addAll(assets)
    })
    )

    // console.log('service  worker has been installed')
})

// Cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {

        cache.keys().then(keys => {


            if(keys.length > size){
                cache.delete(keys[0]).then(limitCacheSize(name,size))
            }


        })


    })
}

self.addEventListener('activate', evt => {
    console.log("activate Event")
    evt.waitUntil(
        caches.keys().then( keys => {
            // console.log(keys)
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
                )
        })
    )
    // console.log('Service worker has been activated')
})


self.addEventListener('fetch', evt => {
    console.log("Fetch Event")
    if(evt.request.url.indexOf('firestore.googleapis.com') === -1 ){
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request).then(fetchRes => {
                return caches.open(dynamicCacheName).then(cache => {
                    cache.put(evt.request.url,fetchRes.clone());

                    //Limit Caching size here 
                    limitCacheSize(dynamicCacheName,10)
                    return fetchRes
                })
            })
        }).catch(e => {
            if(evt.request.url.indexOf('.html') >= 0){
                return caches.match('/pages/fallback.html')
            }
        })
    )
    }

})