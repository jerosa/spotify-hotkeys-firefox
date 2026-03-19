const SELECTORS = {
    playerControls: "[data-testid=player-controls] button",
    playAlbum: "[data-testid='play-button']",
    saveTrack: "button[aria-label='Add to Liked Songs']",
    muteButton: "[data-testid=volume-bar-toggle-mute-button]",
    volumeBar: "[data-testid=volume-bar] input"
};

const CONTROL_BUTTON_INDEXES = {
    shuffle: 0,
    previous: 1,
    "play-pause": 2,
    next: 3,
    repeat: 4
};

const VOLUME_DELTA = 0.05;

function clickControlButton(command) {
    const index = CONTROL_BUTTON_INDEXES[command];
    if (index === undefined) return;

    const buttons = document.querySelectorAll(SELECTORS.playerControls);
    if (!buttons || buttons.length !== 5) {
        console.error("Unable to get Player Controls");
        return;
    }
    buttons[index].click();
}

function clickCustomButton(selector) {
    const button = document.querySelector(selector);
    if (button) button.click();
}

function adjustVolume(direction) {
    const volumeElement = document.querySelector(SELECTORS.volumeBar);
    if (!volumeElement) return;

    const current = parseFloat(volumeElement.value) || 0;
    const delta = direction === "up" ? VOLUME_DELTA : -VOLUME_DELTA;
    const next = Math.min(1, Math.max(0, current + delta));
    const valSet = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype, "value"
    ).set;
    valSet.call(volumeElement, next);
    volumeElement.dispatchEvent(new Event("change", { bubbles: true }));
}

const COMMAND_HANDLERS = {
    "play-pause": () => clickControlButton("play-pause"),
    next: () => clickControlButton("next"),
    previous: () => clickControlButton("previous"),
    shuffle: () => clickControlButton("shuffle"),
    repeat: () => clickControlButton("repeat"),
    "play-album": () => clickCustomButton(SELECTORS.playAlbum),
    "save-track": () => clickCustomButton(SELECTORS.saveTrack),
    mute: () => clickCustomButton(SELECTORS.muteButton),
    "volume-up": () => adjustVolume("up"),
    "volume-down": () => adjustVolume("down")
};

browser.runtime.onMessage.addListener((message) => {
    const command = message.command || message;
    const handler = COMMAND_HANDLERS[command];
    if (handler) handler();
});
