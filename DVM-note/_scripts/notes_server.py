#!/usr/bin/env python3
"""筆記網站本機伺服器：只開放 DVM-note/ 與 textbook/，其他資料夾（病歷等）一律拒絕。
本機（127.0.0.1）免金鑰；其他裝置（手機）第一次需帶 ?key=金鑰，之後以 cookie 記住。
金鑰存在 repo 根目錄的 .notes_server_key（已列入 .gitignore）。"""
import http.server, os, sys, urllib.parse
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
KEY = open(os.path.join(ROOT, '.notes_server_key')).read().strip()
ALLOWED = ('/DVM-note/', '/textbook/')

class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def log_message(self, *a): pass
    def _authorized(self):
        if self.client_address[0] in ('127.0.0.1', '::1'): return True, False
        q = urllib.parse.parse_qs(urllib.parse.urlsplit(self.path).query)
        if q.get('key', [''])[0] == KEY: return True, True
        return ('notes_key=' + KEY) in (self.headers.get('Cookie') or ''), False
    def _check(self):
        path = urllib.parse.unquote(urllib.parse.urlsplit(self.path).path)
        if '..' in path or not path.startswith(ALLOWED):
            self.send_error(403, 'Forbidden'); return False
        ok, set_cookie = self._authorized()
        if not ok:
            self.send_error(403, 'Key required'); return False
        self._set_cookie = set_cookie
        return True
    def end_headers(self):
        if getattr(self, '_set_cookie', False):
            self.send_header('Set-Cookie', f'notes_key={KEY}; Path=/; Max-Age=31536000; SameSite=Lax')
        super().end_headers()
    def do_GET(self):
        if self._check(): super().do_GET()
    def do_HEAD(self):
        if self._check(): super().do_HEAD()

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
http.server.ThreadingHTTPServer(('0.0.0.0', port), H).serve_forever()
