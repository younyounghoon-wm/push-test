self.addEventListener("install", function (event) {
  // The promise that skipWaiting() returns can be safely ignored.
  self.skipWaiting();

  // Perform any other actions required for your service worker to install,
  // like caching content, etc.
});

self.addEventListener("activate", function (event) {
  // The promise that clients.claim() returns can be safely ignored.
  self.clients.claim();

  // Perform any other actions required for your service worker to activate
});

self.addEventListener("fetch", function (event) {
  // Add logic to respond to the fetch event
});

self.addEventListener("push", function (event) {
  // Add logic to respond to the push event
  const data = event.data.json();

  console.log("data");

  new Notification("HI");
});

self.addEventListener("sync", function (event) {
  // Add logic to respond to the sync event
});
