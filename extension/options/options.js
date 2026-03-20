const chOpenSpotify = document.getElementById("chOpenSpotify");
const chSpotifyNotifications = document.getElementById("chSpotifyNotifications");

browser.storage.sync.get().then((res) => {
    if (res.openSpotify !== undefined) {
        chOpenSpotify.checked = res.openSpotify;
    }
    if (res.spotifyNotifications !== undefined) {
        chSpotifyNotifications.checked = res.spotifyNotifications;
    }
}).catch((e) => console.error(e));

chOpenSpotify.addEventListener("change", (event) => {
    browser.storage.sync.set({ openSpotify: event.target.checked }).catch(
        (e) => console.error(e)
    );
});
chSpotifyNotifications.addEventListener("change", (event) => {
    browser.storage.sync.set({ spotifyNotifications: event.target.checked }).catch(
        (e) => console.error(e)
    );
});
