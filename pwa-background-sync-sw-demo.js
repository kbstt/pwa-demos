//NOTE: the following is Service Worker code

// 1. BACKGROUND SYNC (One-off)
// Fires when the user regains connectivity
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-messages") {
    // event.waitUntil() keeps the SW alive until the promise resolves
    event.waitUntil(doSomethingWhenUserRegainsConnectivity());
  }
});

// 2. PERIODIC BACKGROUND SYNC
// Fires at intervals determined by the browser (battery, frequency of use, etc.)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "do-something-on-regular-basis") {
    event.waitUntil(processSomethingOnARegularBasis();
  }
});

function doSomethingWhenUserRegainsConnectivity(){
  //do something when the user regains connectivity
}

function processSomethingOnARegularBasis(){
  //process something on a regular basis
  //e.g. query the latest entries in a newsfeed
  //e.g. update the user's analytics data
}
