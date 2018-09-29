/* global browser document */
const checkbox = document.querySelector("input[id=chOpenSpotify]");

const gettingItem = browser.storage.local.get("openSpotify");
gettingItem.then((res) => { checkbox.checked = res.openSpotify; });

// Listener to update settings
checkbox.addEventListener("change", (event) => {
    browser.storage.local.set({ openSpotify: event.target.checked });
});
