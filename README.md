# What?

In earlier versions of the service worker spec, `event.waitUntil` had to be called synchronously, as in during the initial execution of the event handler. Meaning this would fail:

```js
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open('mysite-dynamic').then(cache => {
      // try the cache first
      return cache.match(event.request).then(response => {
        // if we get a response, use it
        if (response) return response;
        // otherwise, go to the network
        return fetch(event.request).then(response => {
          // cache it asynchronously for next time
          event.waitUntil(
            cache.put(event.request, response.clone())
          );

          // return the response
          return response;
        });
      });
    })
  );
});
```

This fails because `waitUntil` was called after the execution of the event handler. But we need to use `waitUntil` here because the browser needs to know to keep the service worker alive after we've sent the response back.

We fixed this in the spec, so you can call `waitUntil` as long as the promises already passed to `waitUntil` & `respondWith` haven't settled yet.

The browser haven't caught up yet, but this polyfill makes it work as expected.

# Usage

In your service worker:

```js
importScripts('async-waituntil.js');
```

That's it! The above example now works.