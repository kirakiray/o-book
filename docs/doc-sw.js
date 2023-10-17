if (serviceWorker.scriptURL.includes("127")) {
  importScripts(`../src/sw/base.js`);
} else {
  importScripts(`https://cdn.jsdelivr.net/npm/obook@2.1.30/src/sw/base.js`);
}
