/* global browser document MutationObserver */

var notifications = {

    createNotificationObserver(trackInfo) {
        return new MutationObserver(() => {
            this.sendNotification(trackInfo);
        });
    },

    getTrackData(trackInfo) {
        const elements = trackInfo.querySelectorAll("a");
        if (elements.length < 3) throw console.error("Not found correct track info");

        const [image, track, ...artists] = elements;
        const trackImage = image.querySelector(".now-playing__cover-art img").src;
        const trackName = track.textContent;
        const trackArtists = artists.map(e => e.textContent).join(", ");

        return {
            name: trackName,
            artists: trackArtists,
            image: trackImage
        };
    },

    sendNotification(trackInfo) {
        const data = this.getTrackData(trackInfo);
        browser.runtime.sendMessage({ src: "spotifyNotifications.notification", data: data });
    },

    findTrackInfo() {
        return new Promise(resolve => {
            const observer = new MutationObserver((records, instance) => {
                records.forEach(record => {
                    record.addedNodes.forEach(node => {
                        if (node.classList.contains("now-playing")) {
                            instance.disconnect();
                            resolve(node);
                        }
                    });
                });
            });
            const body = document.querySelector("body");
            observer.observe(body, { childList: true, subtree: true });

            const nodes = body.querySelector(".now-playing");
            if (nodes) {
                observer.disconnect();
                resolve(nodes);
            }
        });
    },

    run() {
        this.findTrackInfo().then(trackInfo => {
            this.notificationObserver = this.createNotificationObserver(trackInfo);
            this.notificationObserver.observe(trackInfo, { characterData: true, subtree: true });
            this.sendNotification(trackInfo);
        });
    }
};

notifications.run();
