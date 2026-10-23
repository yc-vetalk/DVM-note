"""國考資料的所有路徑集中在這裡（路徑皆相對於 repo 根目錄「上群/」，腳本請在 repo 根目錄執行）。

LAYOUT：
  'legacy' ＝ 目前位置：讀書筆記/國考題庫/（平鋪；禽病學用「_禽病學」後綴）
  'new'    ＝ 搬遷後：國考專區/考科/<考科>/{試卷,原始試卷}、國考專區/課程/<課程>/{國考題彙整.md,詳解,自我測驗}
搬遷完成後，只要把下面 LAYOUT 的預設值改成 'new'。也可用環境變數 EXAM_LAYOUT 臨時切換。
"""
import os
LAYOUT = os.environ.get('EXAM_LAYOUT', 'new')   # 2026-10-23 已搬到 國考專區/，預設改為 new

# repo 根目錄的絕對路徑（paths.py 位於 讀書筆記/scripts/exam_scraper/），讓腳本在任何資料夾執行都找得到
REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..'))
def _legacy_root(): return os.path.join(REPO, '讀書筆記/國考題庫/')
def _new_root(): return os.path.join(REPO, '國考專區/')

def root():
    return _new_root() if LAYOUT == 'new' else _legacy_root()

def course_md(course):
    """課程的國考題彙整 md（例：豬病學、禽病學）"""
    if LAYOUT == 'new': return f'{_new_root()}課程/{course}/國考題彙整.md'
    return f'{_legacy_root()}{course}_國考題彙整.md'

def course_expl(course):
    """課程的詳解 txt 資料夾"""
    if LAYOUT == 'new': return f'{_new_root()}課程/{course}/詳解'
    return _legacy_root() + ('詳解' if course == '豬病學' else f'詳解_{course}')

def course_spec(course):
    """課程的自我測驗 spec(.py) 資料夾"""
    if LAYOUT == 'new': return f'{_new_root()}課程/{course}/自我測驗'
    return _legacy_root() + ('自我測驗' if course == '豬病學' else f'自我測驗_{course}')

def subject_papers(subject='獸醫傳染病學'):
    """考科的每份試卷 md 資料夾（YYY-N.md）"""
    if LAYOUT == 'new': return f'{_new_root()}考科/{subject}/試卷'
    return f'{_legacy_root()}{subject}'

def subject_raw(subject='獸醫傳染病學'):
    """考科的原始試卷 PDF 資料夾"""
    if LAYOUT == 'new': return f'{_new_root()}考科/{subject}/原始試卷'
    return f'{_legacy_root()}原始試卷/專技高考_{subject}'

def raw_pdf_hint(code, subject='獸醫傳染病學'):
    """寫在 md 裡、提示含圖題要看哪個原始 PDF 的文字"""
    if LAYOUT == 'new': return f'國考專區/考科/{subject}/原始試卷/{code}.pdf'
    return f'原始試卷/專技高考_{subject}/{code}.pdf'
