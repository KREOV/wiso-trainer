"""Baut WiSo Quest: Artifact-Fassung (Vault) und index.html (GitHub Pages)."""
import os
H=os.path.dirname(os.path.abspath(__file__))
VAULT=os.path.expanduser('~/Documents/Brain Obsidian/2 🎓 SCHULE/Lernzettel/WiSo Trainer.html')
alt=open(os.path.join(H,'fragen_quelle.html'),encoding='utf-8').read()
a=alt.index('/* ---------- Hilfen ---------- */'); b=alt.index('/* ---------- Speicher (nur Komfort) ---------- */')
gen=alt[a:b].replace('var(--t','var(--w')
extra='''
let last={};
function gen(k){const L=G[k];let f;do{f=pick(L)}while(L.length>1&&f===last[k]);last[k]=f;const q=f();q.topic=k;return q}
function parseNum(s){s=String(s).trim().replace(/\\s|%|€/g,'');if(s.includes(','))s=s.replace(/\\./g,'').replace(',','.');return parseFloat(s)}
'''
kopf=open(os.path.join(H,'spiel_kopf.html'),encoding='utf-8').read()
logik=open(os.path.join(H,'spiel_logik.js'),encoding='utf-8').read()
seite=kopf+'\n<script>\n'+gen+extra+logik+'\n</script>\n'
open(VAULT,'w',encoding='utf-8').write(seite)
i=seite.index('</style>')+len('</style>')
head='<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-title" content="WiSo Quest">\n<meta name="robots" content="noindex">\n<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="theme-color" content="#5b6cff">\n<link rel="manifest" href="manifest.webmanifest">\n<link rel="apple-touch-icon" href="apple-touch-icon.png">\n<link rel="icon" href="icon-192.png">\n'
sw='<script>if("serviceWorker" in navigator){navigator.serviceWorker.register("sw.js").catch(function(){})}</script>\n'
out=head+seite[:i]+'\n</head>\n<body>\n'+seite[i:]+'\n'+sw+'</body>\n</html>\n'
open(os.path.join(H,'index.html'),'w',encoding='utf-8').write(out)
print('gebaut',len(out))
