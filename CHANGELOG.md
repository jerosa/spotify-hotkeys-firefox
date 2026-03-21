# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2026-03-21
### Added
- skip-forward and skip-back commands with configurable duration
- Skip duration setting in options page (1–60 seconds, default 10)
- Reset button for skip duration in options page
- `gecko` `data_collection_permissions` (no data collection declared)

### Changed
- Panel and options page UI improvements

### Removed
- Redundant `host_permissions` from manifest

## [2.0.0] - 2026-03-20
### Changed
- Migrate from Manifest V2 to Manifest V3
- `browser_action` → `action`
- `applications` → `browser_specific_settings` (strict_min_version 109.0)
- URL permissions separated into `host_permissions`
- Remove `options_ui.browser_style`, use own styles in options.css
- Move extension source files to `extension/` directory for cleaner builds
- Notification selectors updated to `data-testid`, deduplicate by track name

## [1.6.0] - 2026-03-19
### Fixed
- Fix `throw console.error()` throwing undefined instead of an Error
- Fix `var` → `const` in notifications.js
- Fix `checkStoredSettings` overwriting all defaults when a single key is missing
- Fix options page not validating settings existence before assigning
- Fix volume control: use `input` event and align delta to slider step (0.1)
- Fix save track selector: use `now-playing-widget` instead of language-dependent `aria-label`

### Changed
- Migrate from `executeScript({code})` to content script + message passing
- Centralize all Spotify DOM selectors in `spotify-player.js`
- Unify two `onMessage` listeners into one with type dispatch
- ESLint env: `node` → `browser` + `webextensions`
- Add `web-ext` to devDependencies with `start`/`build` scripts
- Add `lang="en"` to panel and options HTML

## [1.5.5] - 2024-07-11
### Fixed
- Fix volume up/down commands

## [1.5.4] - 2024-07-10
### Fixed
- Fix selectors

## [1.5.3] - 2021-10-21
### Fixed
- Fix heart selector
- Fix mute selector

## [1.5.2] - 2020-12-03
### Added
- Display notification with track info when the song have multiple artists.

### Fixed
- Query now playing buttons and get them by index, title differs by browser language.

## [1.5.1] - 2020-12-03
### Added
- Add timeout of 3 seconds to the notifications.
- Added CHANGELOG.md.

### Changed
- Change default hotkeys due to Firefox using the previous ones.

### Fixed
- Query buttons by title due to Firefox autogenerating the css classes.

## [1.5.0] - 2020-09-20
### Added
- Add notifications with the current playing song info.

This project is MIT Licensed // Created & maintained by Jerosa
