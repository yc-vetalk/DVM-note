#!/bin/bash
# 開機登入時自動執行：在背景啟動筆記網站（port 8765），不開瀏覽器
cd "$(dirname "$0")"
PORT=8765
if ! lsof -i :$PORT >/dev/null 2>&1; then
  nohup python3 DVM-note/_scripts/notes_server.py $PORT >/dev/null 2>&1 &
  disown
fi
osascript -e 'tell application "Terminal" to close (every window whose name contains "啟動筆記伺服器")' >/dev/null 2>&1 &
exit 0
