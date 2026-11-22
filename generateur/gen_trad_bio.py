import json, re, sys
sys.path.insert(0,'.')
from fr_bio_1_5 import B1,B2,B3,B4,B5
from fr_bio_6_9 import B6,B7,B8,B9
from en_bio import EN
from ar_bio import AR
NIV=[B1,B2,B3,B4,B5,B6,B7,B8,B9]
from melange import melanger_trad
melanger_trad(EN,NIV); melanger_trad(AR,NIV)
err=0
for lang,D in (("en",EN),("ar",AR)):
    for n in NIV:
        t=D.get(n['id'])
        if not t: print(lang,"niveau manquant",n['id']); err+=1; continue
        if len(t['quiz'])!=len(n['quiz']): print(lang,n['id'],"quiz count"); err+=1
        for tq,fq in zip(t['quiz'],n['quiz']):
            if len(tq['choix'])!=len(fq['choix']): print(lang,n['id'],"choix",tq['question']); err+=1
        for l in n['lecons']:
            tl=D.get(l['id'])
            if not tl: print(lang,"leçon manquante",l['id']); err+=1; continue
            nb=len(re.findall(r'<pre>',l['contenu']))
            used=sorted(int(x) for x in re.findall(r'<!--code:(\d+)-->',tl['contenu']))
            if used!=list(range(nb)): print(lang,l['id'],"codes",used,"attendu",nb); err+=1
            if len(tl['objectifs'])!=len(l['objectifs']): print(lang,l['id'],"objectifs"); err+=1
    head=f"/* Traduction {lang} du parcours Biodiversité (générée par generateur/gen_trad_bio.py). Le code R reste celui de la version française (<!--code:N-->). */\n"
    body=head+"window.TRAD = window.TRAD || {};\nwindow.TRAD.%s = Object.assign(window.TRAD.%s || {}, %s);\n" % (lang,lang,json.dumps(D,ensure_ascii=False,indent=1))
    open(f"/tmp/claude-0/r/site/donnees/traductions/{lang}_bio.js","w",encoding="utf-8").write(body)
print("erreurs:",err)
