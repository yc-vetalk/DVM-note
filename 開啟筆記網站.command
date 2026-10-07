#!/bin/bash
cd "$(dirname "$0")"
PORT=8765
if ! lsof -i :$PORT >/dev/null 2>&1; then
  python3 DVM-note/_scripts/notes_server.py $PORT >/dev/null 2>&1 &
  sleep 1
fi
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)
echo ""
echo "電腦：http://localhost:$PORT/DVM-note/index.html"
echo "手機（同一個 Wi-Fi，第一次開）：http://$IP:$PORT/DVM-note/index.html?key=$(cat .notes_server_key)"
echo ""
open -a Safari "http://localhost:$PORT/DVM-note/index.html"
