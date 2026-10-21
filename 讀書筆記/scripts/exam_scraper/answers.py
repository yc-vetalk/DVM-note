import pymupdf,re,json,glob,os
SUBJ=os.environ.get('SUBJ','獸醫傳染病學')   # 要擷取答案的科目名稱，例如 SUBJ=獸醫普通疾病學
def get(f):
    d=pymupdf.open(f)
    for pg in d:
        ls=[]
        for b in pg.get_text('dict')['blocks']:
            for l in b.get('lines',[]):
                s=''.join(sp['text'] for sp in l['spans']).strip()
                if s: ls.append((l['bbox'][1],l['bbox'][0],s))
        ls.sort()
        for k,(y,x,s) in enumerate(ls):
            if s.startswith('科目名稱') and SUBJ in s:
                hdr=[(x2,s2) for y2,x2,s2 in ls if y<y2<y+60 and re.fullmatch(r'\d+ - \d+',s2)]
                yh=[y2 for y2,x2,s2 in ls if y<y2<y+60 and re.fullmatch(r'\d+ - \d+',s2)][0]
                row=[(x2,s2) for y2,x2,s2 in ls if yh<y2<yh+35 and re.fullmatch(r'[A-D#]{10}',s2)]
                ans={}
                for x2,s2 in row:
                    h=min(hdr,key=lambda t:abs(t[0]-x2)); st=int(h[1].split(' - ')[0])
                    for i,c in enumerate(s2): ans[st+i]=c
                note=[];started=False
                for y2,x2,s2 in ls:
                    if y2>yh+35 and not s2.startswith('等級名稱'):
                        if s2.startswith('備註') or started:
                            if y2>yh+110 : break
                            started=True;note.append(s2)
                    elif started: break
                return ans,' '.join(note)
    return None,None
if __name__=='__main__':
    res={}
    for f in sorted(glob.glob('ans/*.pdf')):
        code=os.path.basename(f)[:6]
        try: a,n=get(f)
        except Exception as e: print(code,'ERR',e);continue
        print(code, None if a is None else (len(a),sum(1 for v in a.values() if v=='#')), (n or '')[:60])
        if a: res[code]={'ans':{str(k):v for k,v in a.items()},'note':n}
    json.dump(res,open('answers.json','w'),ensure_ascii=False)
