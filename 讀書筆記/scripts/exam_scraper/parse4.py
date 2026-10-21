import json,re,pymupdf
def parse(path,thr):
    d=pymupdf.open(path); qs=[];n=0
    for pi,p in enumerate(d):
        lines=[];marks=[]
        for b in p.get_text('dict')['blocks']:
            for l in b.get('lines',[]):
                s=''.join(sp['text'] for sp in l['spans']).strip()
                if not s: continue
                x0,y0,x1,y1=l['bbox']
                if re.fullmatch(r'[A-D]\.(<正確答案>)?',s):
                    if '正確' in s: marks.append((y0,s[0]))
                    continue
                if re.fullmatch(r'\d{1,2}\.',s): continue
                if re.search(r'共 ?\d+ ?頁，第',s) or s.startswith(('類科名稱','科目名稱','※注意')) or (pi==0 and y0<95): continue
                lines.append((y0,x0,s))
        lines.sort()
        cur=None;pq=[];prev=None
        for y,x,s in lines:
            isq = x<thr(pi)
            if cur is not None and prev is not None and y-prev<17 and not (isq and cur['opts'] and len(cur['opts'])>=4):
                if cur['opts']: cur['opts']['ABCD'[len(cur['opts'])-1]]+=s
                else: cur['q']+=s
                prev=y;continue
            prev=y
            if isq and not (cur is not None and not cur['opts']):
                n+=1;cur={'n':n,'q':s,'opts':{},'ans':None,'y':y};pq.append(cur);continue
            if cur is None and qs: cur=qs[-1]
            if cur is None: continue
            if len(cur['opts'])<4: cur['opts']['ABCD'[len(cur['opts'])]]=s
        for y,a in marks:
            c=[q for q in pq if q['y']<=y+1]
            (c[-1] if c else qs[-1])['ans']=a
        qs+=pq
    for q in qs: q.pop('y',None)
    return qs
def minx_thr(path):
    d=pymupdf.open(path);res={}
    for pi,p in enumerate(d):
        xs=[l['bbox'][0] for b in p.get_text('dict')['blocks'] for l in b.get('lines',[]) if ''.join(sp['text'] for sp in l['spans']).strip() and not re.fullmatch(r'(\d{1,2}|[A-D])\.(<正確答案>)?',''.join(sp['text'] for sp in l['spans']).strip()) and l['bbox'][1]>95 and l['bbox'][1]<820]
        res[pi]=(min(xs)+6) if xs else 38
    return res
if __name__=='__main__':
    m=json.load(open('meta.json')); out={}
    for x in m:
        if not x['file'].endswith('_inf.pdf') or x['code']>'099999' or x['code']=='099110': continue
        T=minx_thr(x['file'])
        q=parse(x['file'],lambda pi:T[pi]); bad=[a['n'] for a in q if len(a['opts'])!=4 or not a['ans']]
        print(x['code'],len(q),'bad',bad[:10]); out[x['code']]=q
    json.dump(out,open('parsed_old.json','w'),ensure_ascii=False)
