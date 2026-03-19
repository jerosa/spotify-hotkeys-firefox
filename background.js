const defaultSettings = {
    openSpotify: true,
    spotifyNotifications: true
};

/*
On startup, check whether we have stored settings.
If we don't, then store the default settings.
*/
function checkStoredSettings(storedSettings) {
    const missing = {};
    for (const key in defaultSettings) {
        if (!Object.prototype.hasOwnProperty.call(storedSettings, key)) {
            missing[key] = defaultSettings[key];
        }
    }
    if (Object.keys(missing).length > 0) {
        browser.storage.sync.set(missing);
    }
}

const gettingStoredSettings = browser.storage.sync.get();
gettingStoredSettings.then(checkStoredSettings, (error) => console.error(error));

async function sendCommandToSpotify(command) {
    const tabs = await browser.tabs.query({
        url: "https://*.spotify.com/*"
    });

    if (tabs.length === 0) {
        const res = await browser.storage.sync.get("openSpotify");
        if (res.openSpotify) {
            browser.tabs.create({ url: "https://open.spotify.com" });
        }
        return;
    }

    for (const tab of tabs) {
        const { hostname } = new URL(tab.url);
        if (hostname === "open.spotify.com") {
            browser.tabs.sendMessage(tab.id, { command }).catch(
                (e) => console.log(e)
            );
            return;
        }
    }
}

function createNotification(request) {
    const gettingItem = browser.storage.sync.get("spotifyNotifications");
    gettingItem.then((res) => {
        if (res.spotifyNotifications) {
            browser.notifications.create("spotifyNotification", {
                type: "basic",
                iconUrl: request.data.image,
                title: request.data.name,
                message: `Artists: ${request.data.artists}`
            });
            setTimeout(
                () => browser.notifications.clear("spotifyNotification"),
                3000
            );
        } else {
            console.log("Notifications are disabled");
        }
    }, (e) => console.error(e));
}

browser.commands.onCommand.addListener(sendCommandToSpotify);
// eslint-disable-next-line no-unused-vars
browser.runtime.onMessage.addListener((request, sender) => {
    if (typeof request === "string") {
        sendCommandToSpotify(request);
    } else if (request.src === "spotifyNotifications.notification") {
        createNotification(request);
    }
});
