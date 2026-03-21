const chOpenSpotify = document.getElementById("chOpenSpotify");
const chSpotifyNotifications = document.getElementById("chSpotifyNotifications");
const inputSkipSeconds = document.getElementById("skipSeconds");
const btnResetSkipSeconds = document.getElementById("resetSkipSeconds");

const DEFAULT_SKIP_SECONDS = 10;

browser.storage.sync.get().then((res) => {
    if (res.openSpotify !== undefined) {
        chOpenSpotify.checked = res.openSpotify;
    }
    if (res.spotifyNotifications !== undefined) {
        chSpotifyNotifications.checked = res.spotifyNotifications;
    }
    if (res.skipSeconds !== undefined) {
        inputSkipSeconds.value = res.skipSeconds;
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
btnResetSkipSeconds.addEventListener("click", () => {
    inputSkipSeconds.value = DEFAULT_SKIP_SECONDS;
    browser.storage.sync.set({ skipSeconds: DEFAULT_SKIP_SECONDS }).catch(
        (e) => console.error(e)
    );
});
inputSkipSeconds.addEventListener("change", (event) => {
    const value = event.target.valueAsNumber;
    if (Number.isNaN(value) || value < 1 || value > 60) {
        event.target.value = DEFAULT_SKIP_SECONDS;
        browser.storage.sync.set({ skipSeconds: DEFAULT_SKIP_SECONDS }).catch(
            (e) => console.error(e)
        );
        return;
    }
    browser.storage.sync.set({ skipSeconds: value }).catch(
        (e) => console.error(e)
    );
});
