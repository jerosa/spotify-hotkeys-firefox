; GLOBAL SETTINGS ===================================================================
#Requires AutoHotkey v1.0
#NoEnv
;#Warn
#SingleInstance Force
SendMode Input


; SCRIPT ============================================================================

; Change to custom shortcuts
; https://www.autohotkey.com/docs/Hotkeys.htm
; https://www.autohotkey.com/docs_1.0/commands/Send.htm

; ----- Change this to whatever you want -----
; DEFINE CUSTOM AUTOHOTKEYS 
Hotkey, !p, PlayPause
Hotkey, !m, Mute
return
; ----- END -----

; DEFINE SPOTIFY HOTKEYS - Do not modify unless default settings were changed
spotify_keys(name)
{
    if (name = "play")
    {
        Send +!w
    }
    if (name = "next")
    {
        Send +!Right
    }
    if (name = "previous")
    {
        Send +!Left
    }
    if (name = "shuffle")
    {
        Send +!d
    }
    if (name = "repeat")
    {
        Send +!r
    }
    if (name = "save")
    {
        Send +!l
    }
    if (name = "mute")
    {
        Send +!m
    }
}

run_spotify_hotkey(name) 
{
    SetTitleMatchMode, 2
    IfWinExist, Firefox
    {
        WinActivate,
        WinWaitActive, , , 2
        if ErrorLevel {
            Msgbox, Error: Timed out!
            Return
        }
        spotify_keys(name)
    }
    else Msgbox, Not found
}

PlayPause:
    run_spotify_hotkey("play")
Next:
    run_spotify_hotkey("next")
Previous:
    run_spotify_hotkey("previous")
Shuffle:
    run_spotify_hotkey("shuffle")
Repeat:
    run_spotify_hotkey("repeat")
Save:
    run_spotify_hotkey("save")
Mute:
    run_spotify_hotkey("mute")
