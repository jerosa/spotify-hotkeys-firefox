/* global browser document */
const checkbox = document.querySelector("input[id=chOpenSpotify]");

const gettingItem = browser.storage.sync.get("openSpotify");
gettingItem.then((res) => { checkbox.checked = res.openSpotify; });

// Listener to update settings
checkbox.addEventListener("change", (event) => {
    browser.storage.sync.set({ openSpotify: event.target.checked });
});
