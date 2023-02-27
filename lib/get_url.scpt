#! /usr/bin/osascript

set active_tab to 0
set title_string to ""

set js to "_isPlaying = (e) => { return (e && e.currentTime > 0 && !e.paused && !e.ended && e.readyState > 2); };"
set js to js & "ret = [...document.getElementsByTagName('audio'), ...document.getElementsByTagName('video')].some(_isPlaying) ? 1 : 0;"

if application "Safari" is running then
  tell application "Safari"
    repeat with the_window in every window of application "Safari"
      repeat with the_tab in every tab in the_window
        tell the_tab
          try
            set is_playing to do JavaScript js
            if is_playing is 1.0 then return (name of the_tab) & "\n" & (URL of the_tab)
          end try
        end tell
      end repeat
    end repeat
  end tell
end if
