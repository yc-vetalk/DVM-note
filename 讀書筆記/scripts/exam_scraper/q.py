import re,urllib.request,urllib.parse,http.cookiejar,html,json,sys
URL='https://wwwq.moex.gov.tw/exam/wFrmExamQandASearch.aspx'
def fields(s):
    d={}
    for m in re.finditer(r'<input[^>]*name="([^"]+)"[^>]*>',s):
        t=m.group(0)
        if re.search(r'type="(submit|image|button)"',t): continue
        v=re.search(r'value="([^"]*)"',t); d[m.group(1)]=html.unescape(v.group(1)) if v else ''
    return d
def query(y):
    cj=http.cookiejar.CookieJar(); op=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj)); op.addheaders=[('User-Agent','Mozilla/5.0')]
    s=op.open(URL).read().decode()
    d=fields(s); d['ctl00$holderContent$btnFull']='x'
    s=op.open(URL,urllib.parse.urlencode(d).encode()).read().decode()
    d=fields(s)
    d['ctl00$holderContent$wUctlExamYearStart$ddlExamYear']=str(y)
    d['ctl00$holderContent$wUctlExamYearEnd$ddlExamYear']=str(y)
    d['ctl00$holderContent$txtCategoryName']='獸醫師'
    d['ctl00$holderContent$btnQuery']='查詢'
    s=op.open(URL,urllib.parse.urlencode(d).encode()).read().decode()
    rows=[];exam=cat=None
    for m in re.finditer(r'<td style="vertical-align:text-top;">([^<]+)</td>|<span>([^<]+)</span>|class="exam-title">([^<]+)</label>(.*?)</tr>',s,re.S):
        if m.group(1): exam=m.group(1)
        elif m.group(2): cat=m.group(2)
        else:
            links=[html.unescape(l) for l in re.findall(r'href="(wHandExamQandA_File\.ashx\?[^"]+)"',m.group(4))]
            rows.append([exam,cat,m.group(3),links])
    return rows
allr=[]
for y in range(2008,2027):
    r=query(y); print(y,len(r),flush=True); allr+=r
json.dump(allr,open('rows_all.json','w'),ensure_ascii=False)
