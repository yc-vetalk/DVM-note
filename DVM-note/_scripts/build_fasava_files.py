#!/usr/bin/env python3
"""掃描 repo 外的 DVM/2026 Fasava/<日期>/<X廳>/第N節 .../，產生 上群AH/FASAVA2026/fasava-files.js。
網站用 研討會講義/FASAVA2026/場次（symlink → 2026 Fasava）連到這些檔案，只有本機打得開。
用法：python3 DVM-note/_scripts/build_fasava_files.py"""
import json, os, re

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SRC = os.path.join(os.path.dirname(REPO), '2026 Fasava')
LINK = os.path.join(REPO, '研討會講義', 'FASAVA2026', '場次')
OUT = os.path.join(REPO, '上群AH', 'FASAVA2026', 'fasava-files.js')

KINDS = {'.pdf': 'pdf', '.m4a': 'audio', '.mp3': 'audio', '.wav': 'audio', '.txt': 'text'}

def main():
    if not os.path.islink(LINK):
        os.symlink(os.path.relpath(SRC, os.path.dirname(LINK)), LINK)
    files = {}
    for day in sorted(os.listdir(SRC)):
        m = re.match(r'^(\d{4})（', day)
        if not m or not os.path.isdir(os.path.join(SRC, day)):
            continue
        for room in sorted(os.listdir(os.path.join(SRC, day))):
            r = re.match(r'^([A-Z])廳$', room)
            rdir = os.path.join(SRC, day, room)
            if not r or not os.path.isdir(rdir):
                continue
            for root, _, names in os.walk(rdir):
                rel = os.path.relpath(root, rdir)
                s = re.match(r'^第(\d)節', rel)
                slot = int(s.group(1)) if s else 0   # 0＝直接放在廳的資料夾、沒分節
                for n in sorted(names):
                    kind = KINDS.get(os.path.splitext(n)[1].lower())
                    if not kind:
                        continue
                    path = os.path.relpath(os.path.join(root, n), SRC)
                    files.setdefault(f'{m.group(1)}|{r.group(1)}|{slot}', []).append([kind, os.path.splitext(n)[0], path])
    with open(OUT, 'w') as f:
        f.write('/* 自動產生，勿手改：python3 DVM-note/_scripts/build_fasava_files.py\n'
                '   key＝日期|廳|節（0＝放在廳資料夾、沒分節）；值＝[種類 pdf/audio/text, 顯示名稱, 相對於 2026 Fasava 的路徑] */\n')
        f.write('const FASAVA_FILES = ' + json.dumps(files, ensure_ascii=False, indent=1) + ';\n')
    count = {k: sum(x[0] == k for v in files.values() for x in v) for k in ('pdf', 'audio', 'text')}
    print(f'{len(files)} 節有檔案：PDF {count["pdf"]}、錄音 {count["audio"]}、逐字稿 {count["text"]} → {OUT}')

main()
