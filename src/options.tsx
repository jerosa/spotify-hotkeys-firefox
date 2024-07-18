import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import ".options.css";

const Options = () => {
  return (
    <>
      <p>
        <a href="https://addons.mozilla.org/es/firefox/addon/spotify-hotkeys/">Add a Review</a> |
        <a href="https://github.com/TsunDoge/spotify-hotkeys-firefox/wiki/How-to-use-Spotify-Shortcuts">Documentation</a> |
        <a href="https://github.com/TsunDoge/spotify-hotkeys-firefox/issues">Support</a>
      </p>
      <div>
        <label>
          <input
            type="checkbox"
          />
          Open Spotify with shortcuts
        </label>
      </div>
      <h1>Shortcuts</h1>

      <div id="shortcuts"></div>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
