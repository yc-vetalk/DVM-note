#!/bin/bash
# 用無頭 Chrome 逐章開自我測驗、每題點第一個選項，確認題數、每題都有解析、沒有 JS 錯誤。
# 用法（在 repo 根目錄）：bash 讀書筆記/scripts/course_tools/quiz_check.sh DVM-note/大四上/反芻動物疾病學/自我測驗
# 輸出每章一行：R cards=題數 clicked=點擊數 exp=解析數 err=（err 空白、三個數字相同才算過）
cd "$1" || exit 1
python3 - <<'PY'
s=open('quiz.html',encoding='utf-8').read()
chk='''<script>window.__e=[];window.onerror=function(m){window.__e.push(m)};addEventListener("load",function(){setTimeout(function(){
var cards=[...document.querySelectorAll(".qz-card")];var n=0;cards.forEach(function(c){var o=c.querySelector(".qz-opt");if(o){o.click();n++;}});
setTimeout(function(){document.title="R cards="+cards.length+" clicked="+n+" exp="+document.querySelectorAll(".qz-exp").length+" err="+window.__e.join("|")},800)},2500)});</script>'''
open('_t.html','w',encoding='utf-8').write(s.replace('</body>',chk+'</body>',1))
PY
for c in $(ls data | grep -v chapters | sed 's/\.js$//'); do
  Q=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$c")
  printf "%s " "$c"
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --allow-file-access-from-files --virtual-time-budget=20000 --dump-dom "file://$PWD/_t.html?c=$Q" 2>/dev/null | grep -o '<title>R[^<]*'
done
rm -f _t.html
