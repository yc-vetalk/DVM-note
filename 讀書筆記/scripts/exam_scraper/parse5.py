import json,re,pymupdf
def parse(path):
    d=pymupdf.open(path); qs=[]; last=None
    for pi,p in enumerate(d):
        labels=[];texts=[]
        for b in p.get_text('dict')['blocks']:
            for l in b.get('lines',[]):
                s=''.join(sp['text'] for sp in l['spans']).strip()
                if not s: continue
                x0,y0=l['bbox'][0],l['bbox'][1]
                if re.fullmatch(r'\d{1,2}\.',s): labels.append((y0,'Q',int(s[:-1]),None));continue
                m=re.fullmatch(r'([A-D])\.(<正確答案>)?',s)
                if m: labels.append((y0,m.group(1),None,bool(m.group(2))));continue
                if re.search(r'共 ?\d+ ?頁，第',s) or s.startswith(('類科名稱','科目名稱','※注意')) or (pi==0 and y0<95): continue
                texts.append((y0,x0,s))
        labels.sort(); texts.sort()
        # build question objects in label order
        objs=[]
        cur=None
        for y,k,n,a in labels:
            if k=='Q': cur={'n':n,'q':'','opts':{},'ans':None}; qs.append(cur); objs.append((y,cur,'q'))
            else:
                if cur is None: cur=last
                if a: cur['ans']=k
                objs.append((y,cur,k))
        for y,x,s in texts:
            tgt=None
            for oy,oc,ok in objs:
                if oy<=y+4: tgt=(oc,ok)
            if tgt is None: tgt=(last,last and last.get('_lastk','q')) 
            oc,ok=tgt
            if oc is None: continue
            if ok=='q': oc['q']+=s
            else: oc['opts'][ok]=oc['opts'].get(ok,'')+s
        if objs: 
            last=objs[-1][1]
        # remember last key for continuation
        if objs: last['_lastk']=objs[-1][2]
    for q in qs: q.pop('_lastk',None)
    return qs
if __name__=='__main__':
    m=json.load(open('meta.json')); old=json.load(open('parsed_old.json')); out={}
    for x in m:
        if not x['file'].endswith('_inf.pdf') or x['code']>'099999' or x['code']=='099110': continue
        q=parse(x['file']); bad=[a['n'] for a in q if len(a['opts'])!=4 or not a['ans'] or not a['q']]
        diff=[a['n'] for a,b in zip(q,old[x['code']]) if a['q']!=b['q'] or a['opts']!=b['opts'] or a['ans']!=b['ans']]
        print(x['code'],len(q),'bad',bad[:10],'diff',len(diff),diff[:12]); out[x['code']]=q
    json.dump(out,open('parsed_old5.json','w'),ensure_ascii=False)
