#!/bin/bash
# usage: check.sh page.html  -> prints images loaded / bad / js errors
f="$1"; d=$(dirname "$f"); b=$(basename "$f")
cd "$d"
python3 - "$b" <<'PY'
import sys
s=open(sys.argv[1],encoding='utf-8').read().replace(' loading="lazy"','')
chk='<script>window.__e=[];window.onerror=function(m){window.__e.push(m)};addEventListener("load",function(){setTimeout(function(){var im=[...document.querySelectorAll(".pagebody img")];document.title="R imgs="+im.length+" bad="+im.filter(i=>!i.naturalWidth).length+" pins="+document.querySelectorAll(".pin-btn").length+" err="+window.__e.join("|")},3000)});</script>'
open('_t.html','w',encoding='utf-8').write(s.replace('<head>','<head>'+chk,1))
PY
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --allow-file-access-from-files --virtual-time-budget=20000 --dump-dom "file://$PWD/_t.html" 2>/dev/null | grep -o '<title>R[^<]*'
rm -f _t.html
