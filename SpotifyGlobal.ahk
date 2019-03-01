; GLOBAL SETTINGS ===================================================================
#NoEnv
;#Warn
#SingleInstance Force
SendMode Input


; SCRIPT ============================================================================

; Change to custom shortcuts
; https://www.autohotkey.com/docs/Hotkeys.htm
; https://www.autohotkey.com/docs_1.0/commands/Send.htm

; DEFINE AUTOHOTKEYS
;Hotkey, +!p, PlayPause
Hotkey, !p, PlayPause
return

; DEFINE SPOTIFY HOTKEYS
spotify_keys(name)
{
	if (name = "play")
	{
		Send +!p
		;Send !p
	}
}

run_spotify_hotkey(name) 
{
	SetTitleMatchMode, 2
	IfWinExist, Firefox
	{
		WinActivate,
		;WinActivate, ahk_class MozillaWindowClass
		;WinActivate, ahk_exe firefox.exe
		WinWaitActive, , , 2
		if ErrorLevel {
			Msgbox, Error: Timed out!
			Return
		}
		spotify_keys(name)
	}
	else Msgbox, No encontrado
}

PlayPause:
	run_spotify_hotkey("play")
	