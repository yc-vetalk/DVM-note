import re,sys
t=open('讀書筆記/國考題庫/'+__import__('os').environ.get('SUBJECT','豬病學')+'_國考題彙整.md',encoding='utf-8').read()
secs=re.split(r'\n## ',t)[1:]
i=int(sys.argv[1]); s=secs[i]; print('##',s.split('\n')[0])
ch={'一':'1','二':'2'}
for b in s.split('\n---\n')[1:] if False else s.split('\n---\n'):
    m=re.search(r'\*（(\d+)年第(.)次・第(\d+)題）\*\n\n(.*?)\n\n((?:- [A-D]\. [^\n]*\n?)+)(.*)',b,re.S)
    if not m: continue
    o=re.findall(r'- ([A-D])\. (.*)',m.group(5)); a=re.search(r'官方答案：([^*]*)\*\*',m.group(6))
    print(f"[{m.group(1)}-{ch[m.group(2)]}#{m.group(3)}] {m.group(4).strip()} "+' '.join(f"({k}){v}" for k,v in o)+f" ⇒{a.group(1) if a else '?'}")
