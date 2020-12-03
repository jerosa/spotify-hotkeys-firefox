/* global browser */

const defaultSettings = {
    openSpotify: true,
    spotifyNotifications: true
};

/*
On startup, check whether we have stored settings.
If we don't, then store the default settings.
*/
function checkStoredSettings(storedSettings) {
    for (const key in defaultSettings) {
        if (!storedSettings.hasOwnProperty(key)) {
            browser.storage.sync.set(defaultSettings);
            return;
        }
    }
}

const gettingStoredSettings = browser.storage.sync.get();
gettingStoredSettings.then(checkStoredSettings, error => console.error(error));


async function runCommand(command) {
    const tabs = await browser.tabs.query({ url: "https://*.spotify.com/*" });
    // Open a spotify tab if one does not exist yet.
    if (tabs.length === 0) {
        const gettingItem = browser.storage.sync.get("openSpotify");
        gettingItem.then((res) => {
            // check if user has enabled the option
            if (res.openSpotify) browser.tabs.create({ url: "https://open.spotify.com" });
        }, e => console.error(e));
    }

    let i = 0;
    let executed = false;
    while (i < tabs.length && !executed) {
        let code = "";
        if (tabs[i].url.startsWith("https://play.spotify.com")) {
            code = `document.getElementById('app-player').contentDocument.getElementById('${command}').click()`;
        } else if (tabs[i].url.startsWith("https://open.spotify.com")) {
            switch (command) {
                case "play-pause":
                    code = `(document.querySelector(".player-controls__buttons button[title='Play']") ||
                    document.querySelector(".player-controls__buttons button[title='Pause']")).click()`;
                    break;
                case "next":
                    code = `document.querySelector(".player-controls__buttons button[title='Next']").click()`;
                    break;
                case "previous":
                    code = `document.querySelector(".player-controls__buttons button[title='Previous']").click()`;
                    break;
                case "shuffle":
                    code = `(document.querySelector(".player-controls__buttons button[title='Enable shuffle']") ||
                    document.querySelector(".player-controls__buttons button[title='Disable shuffle']")).click()`;
                    break;
                case "repeat":
                    code = "(document.querySelector('.spoticon-repeat-16') || document.querySelector('.spoticon-repeatonce-16')).click()";
                    break;
                case "play-album":
                    code = `document.querySelector("[data-testid='play-button']").click()`;
                    break;
                case "save-track": {
                    code = `(document.querySelector(".now-playing button[title='Save to Your Library']") ||
                    document.querySelector(".now-playing button[title='Remove from Your Library']")).click()`;
                    break;
                }
                case "mute": {
                    code = "document.querySelector('.volume-bar__icon').click()";
                    break;
                }
            }
        }
        if (code.length) {
            browser.tabs.executeScript(tabs[i].id, { code: code }).catch(e => console.log(e));
            executed = true;
        }
        i++;
    }
}

function createNotification(request) {
    const gettingItem = browser.storage.sync.get("spotifyNotifications");
    gettingItem.then(res => {
        if (res.spotifyNotifications) {
            browser.notifications.create("spotifyNotification", {
                type: "basic",
                iconUrl: request.data.image,
                title: request.data.name,
                message: `Artists: ${request.data.artists}`
            });
            setTimeout(() => browser.notifications.clear("spotifyNotification"), 3000);
        } else { console.log("Notifications are disabled"); }
    }, e => console.error(e));
}

/**
 * Fired when a registered command is activated using a keyboard shortcut.
 */
browser.commands.onCommand.addListener(runCommand);
browser.runtime.onMessage.addListener(runCommand);
// eslint-disable-next-line no-unused-vars
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.src === "spotifyNotifications.notification") {
        createNotification(request);
    }
});
