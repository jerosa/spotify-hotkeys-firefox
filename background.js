/* global browser document window WheelEvent */

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
        if (!Object.prototype.hasOwnProperty.call(storedSettings, key)) {
            browser.storage.sync.set(defaultSettings);
            return;
        }
    }
}

const gettingStoredSettings = browser.storage.sync.get();
gettingStoredSettings.then(checkStoredSettings, error => console.error(error));

// Spotify decided to use randomized CSS classes for some of their buttons
// For this reason the button indexes are used.
const CONTROL_BUTTON_INDEXES = {
    SHUFFLE: 0,
    PREVIOUS: 1,
    PLAY: 2,
    NEXT: 3,
    REPEAT: 4
};

const CONTROL_VOLUME_DELTA = {
    UP: -60,
    DOWN: 60
};

async function runCommand(command) {
    const tabs = await browser.tabs.query({
        url: "https://*.spotify.com/*"
    });
    // Open a spotify tab if one does not exist yet.
    if (tabs.length === 0) {
        const gettingItem = browser.storage.sync.get("openSpotify");
        gettingItem.then((res) => {
            if (res.openSpotify) {
                browser.tabs.create({
                    url: "https://open.spotify.com"
                });
            }
        }, e => console.error(e));
    }

    let i = 0;
    let executed = false;
    while (i < tabs.length && !executed) {
        let code = "";
        const {
            hostname
        } = new URL(tabs[i].url);
        if (hostname === "open.spotify.com") {
            switch (command) {
                case "play-pause":
                    code = getControlButtonCode(CONTROL_BUTTON_INDEXES.PLAY);
                    break;
                case "next":
                    code = getControlButtonCode(CONTROL_BUTTON_INDEXES.NEXT);
                    break;
                case "previous":
                    code = getControlButtonCode(CONTROL_BUTTON_INDEXES.PREVIOUS);
                    break;
                case "shuffle":
                    code = getControlButtonCode(CONTROL_BUTTON_INDEXES.SHUFFLE);
                    break;
                case "repeat":
                    code = getControlButtonCode(CONTROL_BUTTON_INDEXES.REPEAT);
                    break;
                case "play-album":
                    code = getPlayAlbumCode();
                    break;
                case "save-track": {
                    code = getSaveTrackCode();
                    break;
                }
                case "mute": {
                    code = getMuteCode();
                    break;
                }
                case "volume-up": {
                    code = getVolumeCode(CONTROL_VOLUME_DELTA.UP);
                    break;
                }
                case "volume-down": {
                    code = getVolumeCode(CONTROL_VOLUME_DELTA.DOWN);
                    break;
                }
            }
        }
        if (code.length) {
            browser.tabs.executeScript(tabs[i].id, {
                code: code
            }).catch(e => console.log(e));
            executed = true;
        }
        i++;
    }
}

function getControlButtonCode(buttonIndex) {
    function clickButton() {
        const controlElements = document.querySelectorAll("div.player-controls__buttons button");
        if (!controlElements || (controlElements.length !== 5)) {
            return;
        }
        controlElements[buttonIndex].click();
    }
    return `var buttonIndex=${buttonIndex}; ${clickButton} clickButton();`;
}

function clickCustomButton(buttonSelector) {
    const button = document.querySelector(buttonSelector);
    if (!button) {
        return;
    }
    button.click();
}

function getPlayAlbumCode() {
    const buttonSelector = `"[data-testid='play-button']"`;
    return `${clickCustomButton} clickCustomButton(${buttonSelector});`;
}

function getSaveTrackCode() {
    const buttonSelector = `"button.control-button-heart"`;
    return `${clickCustomButton} clickCustomButton(${buttonSelector});`;
}

function getMuteCode() {
    const buttonSelector = `".volume-bar button"`;
    return `${clickCustomButton} clickCustomButton(${buttonSelector});`;
}

function getVolumeCode(volumeDelta) {
    function setVolume() {
        const volumeElement = document.querySelector(".volume-bar");

        if (!volumeElement) {
            return;
        }

        const event = new WheelEvent("wheel", {
            bubbles: true,
            cancelable: true,
            view: window,
            deltaY: volumeDelta
        });

        volumeElement.dispatchEvent(event);
    }

    return `var volumeDelta=${volumeDelta}; ${setVolume} setVolume();`;
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
        } else {
            console.log("Notifications are disabled");
        }
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
