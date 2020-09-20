/* global browser document */
const chOpenSpotify = document.querySelector("input[id=chOpenSpotify]");
const chSpotifyNotifications = document.querySelector("input[id=chSpotifyNotifications]");

browser.storage.sync.get().then(res => {
    chOpenSpotify.checked = res.openSpotify;
    chSpotifyNotifications.checked = res.spotifyNotifications;
});

// Listener to update settings
chOpenSpotify.addEventListener("change", (event) => {
    browser.storage.sync.set({ openSpotify: event.target.checked });
});
chSpotifyNotifications.addEventListener("change", (event) => {
    browser.storage.sync.set({ spotifyNotifications: event.target.checked });
});
