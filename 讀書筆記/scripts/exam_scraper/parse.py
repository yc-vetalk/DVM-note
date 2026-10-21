import json,re,pymupdf
def parse(path):
    d=pymupdf.open(path); t='\n'.join(p.get_text() for p in d)
    t=re.sub(r'共 ?\d+ ?頁，第 ?\d+ ?頁','',t)
    lines=[l.rstrip() for l in t.split('\n')]
    # start from first "1." question line
    qs=[];cur=None;opt=None
    start=None
    for i,l in enumerate(lines):
        if re.match(r'^\s*1\s*[\.．]\s*\S',l): start=i;break
    if start is None: return []
    exp=1
    for l in lines[start:]:
        s=l.strip()
        if not s: continue
        m=re.match(r'^(\d{1,2})\s*[\.．]\s*(.*)$',s)
        if m and int(m.group(1))==exp and (cur is None or cur['opts'].get('D') is not None or exp==1 or len(cur['opts'])>=4):
            cur={'n':exp,'q':m.group(2),'opts':{}};qs.append(cur);opt=None;exp+=1;continue
        if cur is None: continue
        m=re.match(r'^([A-D])\s*[\.．、]\s*(<正確答案>)?\s*(.*)$',s)
        if m and (m.group(1) not in cur['opts']):
            opt=m.group(1);cur['opts'][opt]=m.group(3)
            if m.group(2): cur['ans']=opt
            continue
        if opt: cur['opts'][opt]+=' '+s
        else: cur['q']+=s
    return qs
if __name__=='__main__':
    m=json.load(open('meta.json'))
    out={}
    for x in m:
        if not x['file'].endswith('_inf.pdf'): continue
        q=parse(x['file'])
        if q is None: print(x['code'],'scrambled'); continue
        bad=[a['n'] for a in q if len(a['opts'])!=4]
        print(x['code'],len(q),'bad',bad[:8])
        out[x['code']]=q
    json.dump(out,open('parsed.json','w'),ensure_ascii=False)
