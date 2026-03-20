const NOTIFICATION_SELECTORS = {
    nowPlaying: "[data-testid='now-playing-widget']",
    coverArt: "[data-testid='cover-art-image']",
    trackName: "[data-testid='context-item-link']",
    artistName: "[data-testid='context-item-info-artist']"
};

const notifications = {

    lastTrackName: null,

    createNotificationObserver(trackInfo) {
        return new MutationObserver(() => {
            try {
                const data = this.getTrackData(trackInfo);
                if (data.name !== this.lastTrackName) {
                    this.lastTrackName = data.name;
                    browser.runtime.sendMessage({
                        src: "spotifyNotifications.notification",
                        data: data
                    });
                }
            } catch (e) {
                // Track info not ready yet
            }
        });
    },

    getTrackData(trackInfo) {
        const image = trackInfo.querySelector(NOTIFICATION_SELECTORS.coverArt);
        const track = trackInfo.querySelector(NOTIFICATION_SELECTORS.trackName);
        const artists = trackInfo.querySelectorAll(
            NOTIFICATION_SELECTORS.artistName
        );

        if (!image || !track || artists.length === 0) {
            throw new Error("Not found correct track info");
        }

        return {
            name: track.textContent,
            artists: Array.from(artists).map(e => e.textContent).join(", "),
            image: image.src
        };
    },

    sendNotification(trackInfo) {
        try {
            const data = this.getTrackData(trackInfo);
            this.lastTrackName = data.name;
            browser.runtime.sendMessage({
                src: "spotifyNotifications.notification",
                data: data
            });
        } catch (e) {
            // Track info not ready yet
        }
    },

    findTrackInfo() {
        return new Promise(resolve => {
            const existing = document.querySelector(
                NOTIFICATION_SELECTORS.nowPlaying
            );
            if (existing) {
                resolve(existing);
                return;
            }

            const observer = new MutationObserver((records, instance) => {
                const node = document.querySelector(
                    NOTIFICATION_SELECTORS.nowPlaying
                );
                if (node) {
                    instance.disconnect();
                    resolve(node);
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    },

    run() {
        this.findTrackInfo().then(trackInfo => {
            this.notificationObserver =
                this.createNotificationObserver(trackInfo);
            this.notificationObserver.observe(trackInfo, {
                childList: true,
                subtree: true,
                characterData: true
            });
            this.sendNotification(trackInfo);
        });
    }
};

notifications.run();
