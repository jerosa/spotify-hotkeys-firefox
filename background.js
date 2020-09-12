/* global browser */

const defaultSettings = {
    openSpotify: true
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
                    code = "(document.querySelector('.spoticon-play-16') || document.querySelector('.spoticon-pause-16')).click()";
                    break;
                case "next":
                    code = "document.querySelector('.spoticon-skip-forward-16').click()";
                    break;
                case "previous":
                    code = "document.querySelector('.spoticon-skip-back-16').click()";
                    break;
                case "shuffle":
                    code = "document.querySelector('.spoticon-shuffle-16').click()";
                    break;
                case "repeat":
                    code = "(document.querySelector('.spoticon-repeat-16') || document.querySelector('.spoticon-repeatonce-16')).click()";
                    break;
                case "play-album":
                    code = "document.querySelector('.btn-green').click()";
                    break;
                case "save-track": {
                    // CHECK: Region difference (heart/add)
                    let checkCode = "document.querySelector('.control-button').classList.contains('spoticon-heart-16') || ";
                    checkCode += "document.querySelector('.control-button').classList.contains('spoticon-heart-active-16')";
                    const res = await browser.tabs.executeScript(tabs[i].id, { code: checkCode });
                    if (res[0]) code = "(document.querySelector('.spoticon-heart-16') || document.querySelector('.spoticon-heart-active-16')).click()";
                    else code = "(document.querySelector('.spoticon-add-16') || document.querySelector('.spoticon-added-16')).click()";
                    break;
                }
            }
        }
        if (code.length) {
            browser.tabs.executeScript(tabs[i].id, { code: code });
            executed = true;
        }
        i++;
    }
}

/**
 * Fired when a registered command is activated using a keyboard shortcut.
 */
browser.commands.onCommand.addListener(runCommand);
browser.runtime.onMessage.addListener(runCommand);
