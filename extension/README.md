# Spotify Web Player Hotkeys Firefox Extension

This extension adds keyboard shortcuts to Firefox to play, pause, next and previous tracks in [Spotify Web Player](https://open.spotify.com).

![(Screenshot of running extension)](images/Spotify.png)

## Usage

Default Keyboard shortcuts are:
```
- Play/Pause  : Alt + Shift + W
- Next        : Alt + Shift + Right Arrow
- Previous    : Alt + Shift + Left Arrow
- Shuffle     : Alt + Shift + D
- Repeat      : Alt + Shift + R
- Play-Album  : Alt + Shift + G
- Save Track  : Alt + Shift + L
- Mute/Unmute : Alt + Shift + M
- Volume Up   : Alt + Shift + Up Arrow
- Volume Down : Alt + Shift + Down Arrow
```

The `Play Album or PlayGreen` shortcut play also play/pause the songs like the `Play/Pause` shortcut but is useful when Spotify Web Player gets stuck with an ad.

Instead of using the keybord it's possible to click on the icon of the toolbar which will show the keybindings.

## Installation

You can find the signed Firefox Extension at https://addons.mozilla.org/en-US/firefox/addon/spotify-hotkeys/

## [Customizing the shortcuts](https://support.mozilla.org/en-US/kb/manage-extension-shortcuts-firefox)

You can now change your extensions' keyboard shortcuts on the add-ons page.

1. Click the menu button, click `Add-ons` and select `Extensions`.
2. Click the Tools for all add-ons cogwheel.
3. Click `Manage Extension Shortcuts` in the menu.
4. You will see the shortcut options (if available) for your installed add-ons. 

![(Screenshot of managing extension shortcuts 1)](images/ManageExtensions1.png)
![(Screenshot of managing extension shortcuts 2)](images/ManageExtensions2.png)

## Option page

The option page of the extension allows the user to customize the shortcuts and some settings. See the [wiki](https://github.com/TsunDoge/spotify-hotkeys-firefox/wiki/How-to-use-Spotify-Shortcuts) for more information.

### Settings

The following options can be enabled/disabled in the option page.

- Open Spotify with shortcuts: When the user hit a shortcut open spotify if it is not opened yet.
- Create notifications when song changes

### Custom Shorcuts **(legacy)**

It is possible to change the default shortcuts to custom ones in the option page of the addon. See the [wiki](https://github.com/TsunDoge/spotify-hotkeys-firefox/wiki/How-to-use-Spotify-Shortcuts#configure-shortcuts) for more information.

**NOTE:** On Firefox >= 66.0-build3 or Firefox >= 67.0a1 a new interface has been implemented to change the default shortcuts. See the [docs](https://support.mozilla.org/en-US/kb/manage-extension-shortcuts-firefox)
