"""由 meta.json / parsed*.json / answers.json 產生國考題庫 .md（題目＋官方答案，無詳解）"""
import json,re,os,sys
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import parse as P, parse4 as P4
import paths   # 國考資料路徑集中在 paths.py
OUT=sys.argv[1] if len(sys.argv)>1 else None   # 給 OUT＝舊行為（全部輸出到 OUT 底下）；不給＝依 paths.py 放到正式位置
meta=[m for m in json.load(open('meta.json')) if m['file'].endswith('_inf.pdf')]
ansdb=json.load(open('answers.json'))
old=json.load(open('parsed_old.json')); new={}
import unicodedata
def norm(t):
    o=[]
    for ch in t:
        c=ord(ch)
        if 0x2e80<=c<=0x2fdf or 0xf900<=c<=0xfaff: ch=unicodedata.normalize('NFKC',ch)
        elif ch=='﹖': ch='？'
        elif 0x0700<=c<0x1000: ch='□'
        o.append(ch)
    return ''.join(o)
papers=[]
OVERRIDE={
 '98-2#18':{'ans':'C','opts':{'C':'小腸'}},
 '99-2#11':{'ans':'C或D','q':'下列何者在自然情況下只發生在豬？'},
}
for m in sorted(meta,key=lambda x:x['code']):
    code=m['code']
    if code in old: qs=old[code]
    else: qs=P.parse(m['file'])
    A=ansdb.get(code)
    note=''
    _b=re.search(r'第([一二三四])次',m['exam']); batch_=_b.group(1) if _b else ''; yr_=int(code[:3])
    for q in qs:
        if A: 
            q['ans']=A['ans'].get(str(q['n']),q.get('ans'))
        q['q']=norm(q['q']); q['opts']={k:norm(v) for k,v in q['opts'].items()}
        q['flags']=[]
        if re.search(r'如圖|下圖|圖中|圖片|照片|附圖',q['q']): q['flags'].append('含圖')
        if any(not v.strip() for v in q['opts'].values()) or len(q['opts'])<4: q['flags'].append('選項可能為圖片/缺漏')
    for q in qs:
        k=f"{yr_}-{ {'一':'1','二':'2'}.get(batch_,'') }#{q['n']}"
        ov=OVERRIDE.get(k)
        if ov:
            q['ans']=ov['ans']
            if 'q' in ov: q['q']=ov['q']
            if 'opts' in ov: q['opts'].update(ov['opts'])
    if A: note=A['note'].replace('備註:','').strip()
    papers.append(dict(code=code,year=yr_,batch=batch_,exam=m['exam'],qs=qs,note=note,hasans=bool(A) or code<'100'))
json.dump(papers,open('papers.json','w'),ensure_ascii=False)
print(len(papers),sum(len(p['qs']) for p in papers))

# ===== 輸出 =====
import pymupdf, species
if OUT: os.makedirs(OUT,exist_ok=True)
def pdf_page(m,q):
    try:
        d=pymupdf.open(m['file']); key=re.sub(r'\s','',q['q'])[:14]
        for i,pg in enumerate(d):
            if key in re.sub(r'\s','',pg.get_text()): return i+1
    except Exception: pass
    return None
mm={m['code']:m for m in meta}
for pp in papers:
    for q in pp['qs']:
        if q['flags']: q['page']=pdf_page(mm[pp['code']],q)
def qline(pp,q,withsrc=False):
    a=q.get('ans') or ''
    s=''
    if withsrc: s+=f"*（{pp['year']}年第{pp['batch']}次・第{q['n']}題）*\n\n"
    s+=f"{q['q']}\n\n"
    for k in 'ABCD': s+=f"- {k}. {q['opts'].get(k,'')}\n"
    if pp['hasans']:
        if a=='#': s+="\n**官方答案：一律給分**\n"
        else:
            nt=''
            m=re.search(r'第%d題([^，]*)'%q['n'],pp['note'])
            if m: nt=f"（更正：{m.group(0)}）"
            s+=f"\n**官方答案：{a}**{nt}\n"
    else: s+="\n**官方答案：尚未取得**\n"
    if q['flags']: s+=f"\n> ⚠ 本題含圖，請對照原卷第 {q.get('page') or '?'} 頁（`{paths.raw_pdf_hint(pp['code'])}`）\n"
    return s+'\n'
ddir=os.path.join(OUT,'獸醫傳染病學') if OUT else paths.subject_papers('獸醫傳染病學'); os.makedirs(ddir,exist_ok=True)
for pp in papers:
    t=f"# 民國 {pp['year']} 年第{pp['batch']}次專技高考・獸醫師・獸醫傳染病學\n\n"
    t+=f"- 考試：{pp['exam']}\n- 題數：{len(pp['qs'])}（單選）\n- 官方答案：{'有' if pp['hasans'] else '尚未取得（考選部答案清冊未列）'}\n"
    if pp['note'] and '無更正' not in pp['note']: t+=f"- 答案更正備註：{pp['note']}\n"
    t+="\n---\n\n"
    for q in pp['qs']: t+=f"### {q['n']}.\n\n"+qline(pp,q)
    open(os.path.join(ddir,f"{pp['year']}-{pp['batch']}.md".replace('一','1').replace('二','2')),'w',encoding='utf-8').write(t)
# 動物別索引
for name,cfg in species.SPECIES.items():
    sr=re.compile(cfg['strong'],re.I); wr=re.compile(cfg['weak'],re.I)
    groups={d[0]:[] for d in cfg['diseases']}; groups['其他（題幹提及但未歸入上列疾病）']=[]; weak=[]
    pats=[(d[0],re.compile(d[1],re.I)) for d in cfg['diseases']]
    for pp in papers:
        for q in pp['qs']:
            _k=f"{pp['year']}-{ {'一':'1','二':'2'}.get(pp['batch'],pp['batch']) }"
            _in = (cfg['ranges'].get(_k,(0,-1))[0] <= q['n'] <= cfg['ranges'].get(_k,(0,-1))[1] and f"{_k}#{q['n']}" not in cfg.get('exclude',())) if 'ranges' in cfg else sr.search(q['q'])
            if _in:
                g=None
                _ov=cfg.get('override',{}).get(f"{_k}#{q['n']}")
                if _ov: g=next((d[0] for d in cfg['diseases'] if d[0].startswith(_ov)), None) or (g if _ov!='其他' else None)
                for nm,r in ([] if (g or _ov=='其他') else pats):
                    if r.search(q['q']): g=nm;break
                if g is None and cfg.get('answer_group') and _ov!='其他':
                    at=' '.join(q['opts'].get(x,'') for x in re.findall(r'[A-D]',q.get('ans') or ''))
                    for nm,r in pats:
                        if at and r.search(at): g=nm;break
                groups[g or '其他（題幹提及但未歸入上列疾病）'].append((pp,q))
            elif 'ranges' not in cfg and wr.search(' '.join(q['opts'].values())) :
                weak.append((pp,q))
    tot=sum(len(v) for v in groups.values())
    t=f"# {name}・歷屆國考題彙整（獸醫師・獸醫傳染病學）\n\n- 來源：考選部「考畢試題查詢平台」專技高考獸醫師「獸醫傳染病學」，民國 97–115 年共 {len(papers)} 份、{sum(len(p['qs']) for p in papers)} 題\n- 本檔挑出題幹與{cfg.get("short",name[0])}相關者共 **{tot}** 題（依疾病分組、組內依年份排序），另列「選項提及{cfg.get("short",name[0])}」{len(weak)} 題\n{'- 水產題在各卷固定集中在最後一段連續題號，本檔依題號區間挑題（含只寫「如圖」而無病名的題），夾雜的非水產題已人工剔除；疾病分組為依題幹與正解選項的關鍵字自動判斷，少數題人工調整，**分組可能有誤**；完整試卷見 `獸醫傳染病學/` 資料夾\n' if 'ranges' in cfg else '- 篩選為關鍵字自動判斷，**可能漏題或誤收**；完整試卷見 `獸醫傳染病學/` 資料夾\n'}- 只有題目與官方答案，未附詳解\n\n"
    for nm,lst in groups.items():
        if not lst: continue
        t+=f"## {nm}（{len(lst)} 題）\n\n"
        for pp,q in sorted(lst,key=lambda x:(x[0]['code'],x[1]['n'])): t+=qline(pp,q,True)+'---\n\n'
    t+=f"## 選項提及{cfg.get("short",name[0])}（較不確定，{len(weak)} 題）\n\n"
    for pp,q in sorted(weak,key=lambda x:(x[0]['code'],x[1]['n'])): t+=qline(pp,q,True)+'---\n\n'
    cm=os.path.join(OUT,f'{name}_國考題彙整.md') if OUT else paths.course_md(name)
    os.makedirs(os.path.dirname(cm),exist_ok=True)
    open(cm,'w',encoding='utf-8').write(t)
    print(name,{k:len(v) for k,v in groups.items()},'weak',len(weak))
