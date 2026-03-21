const SELECTORS = {
    playerControls: "[data-testid=player-controls] button",
    playAlbum: "[data-testid='play-button']",
    saveTrack: "[data-testid='now-playing-widget'] button[data-encore-id='buttonTertiary']",
    muteButton: "[data-testid=volume-bar-toggle-mute-button]",
    volumeBar: "[data-testid=volume-bar] input",
    progressBar: "input[type='range'][aria-valuetext]"
};

const CONTROL_BUTTON_INDEXES = {
    shuffle: 0,
    previous: 1,
    "play-pause": 2,
    next: 3,
    repeat: 4
};

const VOLUME_DELTA = 0.1;
const DEFAULT_SKIP_SECONDS = 10;
let skipSeconds = DEFAULT_SKIP_SECONDS;

browser.storage.sync.get("skipSeconds").then((res) => {
    if (res.skipSeconds !== undefined) {
        ({ skipSeconds } = res);
    }
});

browser.storage.onChanged.addListener((changes) => {
    if (changes.skipSeconds) {
        skipSeconds = changes.skipSeconds.newValue;
    }
});

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
    volumeElement.dispatchEvent(new Event("input", { bubbles: true }));
}

function skipPlayback(direction) {
    const progressBar = document.querySelector(SELECTORS.progressBar);
    if (!progressBar) return;

    const current = parseFloat(progressBar.value) || 0;
    const max = parseFloat(progressBar.max) || 0;
    if (max <= 0 || max > 3600000) return;
    const seconds = Math.max(1, Math.min(60, skipSeconds || DEFAULT_SKIP_SECONDS));
    const delta = direction === "forward" ? seconds * 1000 : -(seconds * 1000);
    const next = Math.min(max, Math.max(0, current + delta));

    const valSet = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype, "value"
    ).set;
    valSet.call(progressBar, next);
    progressBar.dispatchEvent(new Event("input", { bubbles: true }));
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
    "volume-down": () => adjustVolume("down"),
    "skip-forward": () => skipPlayback("forward"),
    "skip-back": () => skipPlayback("back")
};

browser.runtime.onMessage.addListener((message) => {
    const command = message.command || message;
    const handler = COMMAND_HANDLERS[command];
    if (handler) handler();
});
