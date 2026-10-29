"""由 spec（paths.course_spec(課程)/<章節>.py；目前在 讀書筆記/國考題庫/自我測驗/）產生 DVM-note/大四上/豬病學/自我測驗/data/<章節>.js
spec 內容：TITLE, GROUPS=[(組名, 註, [題...])]；題 = ('mc',題,[選項],正解index,解析,頁碼) | ('tf',題,True/False,解析,頁碼) | ('x','98-1#3')（引用國考題庫）"""
import re,sys,json,os,glob,importlib.util
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import paths                                           # 國考資料路徑集中在 paths.py
ROOT=paths.root()
SUBJECT=os.environ.get('SUBJECT','豬病學')          # 禽病學：SUBJECT=禽病學
EXPDIR=os.environ.get('EXPDIR',paths.course_expl(SUBJECT))     # 詳解 txt 資料夾
SPECDIR=os.environ.get('SPECDIR',paths.course_spec(SUBJECT))   # 題庫 spec(.py) 資料夾
QZOUT=os.environ.get('QZOUT','DVM-note/大四上/豬病學/自我測驗/data')  # 輸出資料夾
sys.argv=['x',paths.course_md(SUBJECT),'/tmp/o.html','t','s',EXPDIR]
src=open('讀書筆記/scripts/exam_scraper/md_to_html.py',encoding='utf-8').read()
exec(src[:src.index("tpl=open(")])
BANK={}
for _,qs in secs:
    for lab,q,opts,a,note,pg in qs: BANK[key_of(lab)]=(lab,q,opts,a,note,pg)
def xq(key,idx):
    lab,q,opts,a,note,pg=BANK[key]; ex=resolve(key).split('|')
    ans=a if a and a[0] in 'ABCD' and len(a)==1 else None
    guess=''
    if not ans:
        m=re.search(r'判斷為 ([A-D])',ex[0])
        if m: ans=m.group(1); guess='（官方答案缺，依知識判斷）'
    if not ans: return None
    yr=re.match(r'(\d+)年第(.)次',lab); tag=f"【{yr.group(1)} 年國考】"
    ai='ABCD'.index(ans)
    e=ex[0].split('（本份')[0]+guess
    return dict(id=f"x{idx}_{key}",t='mc',q=tag+q,o=[v for _,v in opts],a=ai,e=e,p=f"{lab.split('・')[0]}")
def build(spec_path):
    spec=importlib.util.spec_from_file_location('s',spec_path); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    groups=[];n=0;seen=set()
    for gi,(name,note,qs) in enumerate(m.GROUPS):
        out=[]
        for qi,q in enumerate(qs):
            idx=f"{gi+1}_{qi+1}"
            if q[0]=='mc':
                import random
                ex=q[6] if len(q)>6 else {}   # 第 7 欄（選用）：{'keep':True 不打亂選項, 's':出處 dict}
                rnd=random.Random(os.path.basename(spec_path)+idx); order=list(range(len(q[2])))
                if not ex.get('keep'): rnd.shuffle(order)
                d=dict(id='q'+idx,t='mc',q=q[1],o=[q[2][i] for i in order],a=order.index(q[3]),e=q[4],p=q[5])
                if ex.get('s'): d['s']=ex['s']
            elif q[0]=='tf': d=dict(id='q'+idx,t='tf',q=q[1],a=q[2],e=q[3],p=q[4])
            elif q[0]=='sa':   # 簡答題：('sa', 題, 老師建議答案, 解析, 頁碼, {'s':出處})；作答後自評對錯
                d=dict(id='q'+idx,t='sa',q=q[1],ans=q[2],e=q[3],p=q[4])
                if len(q)>5 and q[5].get('s'): d['s']=q[5]['s']
            else:
                if q[1] in seen: print('dup',q[1]); continue
                seen.add(q[1]); d=xq(q[1],idx)
                if not d: print('skip (no answer)',q[1]); continue
            assert d['t'] in ('tf','sa') or 0<=d['a']<len(d['o']),(spec_path,idx)
            out.append(d)
        n+=len(out); groups.append(dict(name=name,note=note,qs=out))
    cid=os.path.basename(spec_path)[:-3]
    open(f'{QZOUT}/{cid}.js','w',encoding='utf-8').write(f'SWINE_QUIZ[{json.dumps(cid,ensure_ascii=False)}] = '+json.dumps(dict(title=m.TITLE,groups=groups),ensure_ascii=False,indent=1)+';\n')
    return cid,m.TITLE,n,getattr(m,'ORDER',99)
if __name__=='__main__':
    res=[build(p) for p in sorted(glob.glob(SPECDIR+'/*.py'))]
    res.sort(key=lambda r:r[3])
    open(f'{QZOUT}/chapters.js','w',encoding='utf-8').write('window.SWINE_QUIZ_LIST = '+json.dumps([dict(id=c,title=t,n=n) for c,t,n,_ in res],ensure_ascii=False,indent=1)+';\n')
    for r in res: print(r)
