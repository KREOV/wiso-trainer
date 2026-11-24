"""Führt die aufbereiteten Prüfungsaufgaben zusammen und prüft jede. Aufruf: python3 aufgaben_pruefen.py <ordner mit *.json>"""
import json,glob,os,sys
H=os.path.dirname(os.path.abspath(__file__))
src=sys.argv[1] if len(sys.argv)>1 else None
WELT={'recht','arbeit','sozial','markt','kon','ezb'}
REIHE=['W2122','S22','W2324','S24','W2425','S25']
def pruefe(alle):
  bef=[];ids=set()
  for a in alle:
    i=a.get('id','?')
    if i in ids:bef.append(f'{i}: doppelte id')
    ids.add(i)
    for f in ('pruefung','nr','welt','thema','typ','frage','erklaerung'):
      if not a.get(f) and a.get(f)!=0:bef.append(f'{i}: {f} fehlt')
    if a.get('welt') not in WELT:bef.append(f'{i}: welt {a.get("welt")}')
    t=a.get('typ')
    if t in('mc','multi'):
      o=a.get('optionen') or [];r=a.get('richtig') or []
      if len(o)<2:bef.append(f'{i}: zu wenige optionen')
      if not r or any(not isinstance(x,int) or x<0 or x>=len(o) for x in r):bef.append(f'{i}: richtig außerhalb')
      if t=='mc' and len(r)!=1:bef.append(f'{i}: mc braucht genau eine richtige')
      if t=='multi' and len(r)<2:bef.append(f'{i}: multi braucht mindestens zwei')
      if len(set(o))!=len(o):bef.append(f'{i}: doppelte optionen')
    elif t=='zuordnen':
      k=a.get('kategorien') or [];au=a.get('aussagen') or []
      if len(k)<2 or not au:bef.append(f'{i}: zuordnen leer')
      for x in au:
        if not x.get('t') or not isinstance(x.get('k'),int) or not 0<=x['k']<len(k):bef.append(f'{i}: aussage falsch {x}')
    elif t=='reihenfolge':
      if len(a.get('schritte') or [])<2:bef.append(f'{i}: zu wenige schritte')
      if len(set(a['schritte']))!=len(a['schritte']):bef.append(f'{i}: doppelte schritte')
    elif t=='zahl':
      if not isinstance(a.get('loesung'),(int,float)):bef.append(f'{i}: loesung keine zahl')
    else:bef.append(f'{i}: typ {t}')
    txt=json.dumps(a,ensure_ascii=False)
    if '–' in txt or '—' in txt:bef.append(f'{i}: Gedankenstrich')
  return bef
if src:
  alle=[]
  for code in REIHE:
    p=os.path.join(src,code+'.json')
    if os.path.exists(p):alle+=sorted(json.load(open(p,encoding='utf-8')),key=lambda a:a['nr'])
  json.dump(alle,open(os.path.join(H,'aufgaben.json'),'w',encoding='utf-8'),ensure_ascii=False,indent=1)
alle=json.load(open(os.path.join(H,'aufgaben.json'),encoding='utf-8'))
bef=pruefe(alle)
from collections import Counter
print(len(alle),'Aufgaben',dict(Counter(a['pruefung'] for a in alle)))
print('typ',dict(Counter(a['typ'] for a in alle)),'welt',dict(Counter(a['welt'] for a in alle)))
print(len(bef),'Befunde');[print(' ',b) for b in bef]
sys.exit(1 if bef else 0)
