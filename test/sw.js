importScripts('../async-waituntil.js');

self.onmessage = event => {
  event.waitUntil(
    new Promise(r => setTimeout(r, 500)).then(() => {
      event.waitUntil(new Promise(r => setTimeout(r, 500)));
      event.source.postMessage('PASS');
    }).catch(err => {
      event.source.postMessage('FAIL');
      throw err;
    })
  );
};