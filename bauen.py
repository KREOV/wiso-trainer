"""Baut Crashkurs IHK aus src/.
Aufruf: python3 bauen.py          -> Testfassung in beta/index.html
        python3 bauen.py --live   -> zusätzlich index.html (die echte App) und die Vault-Fassung
"""
import os, sys, json
H = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(H, 'src')
VAULT = os.path.expanduser('~/Documents/Brain Obsidian/2 🎓 SCHULE/Lernzettel/WiSo Trainer.html')

alt = open(os.path.join(H, 'fragen_quelle.html'), encoding='utf-8').read()
a = alt.index('/* ---------- Hilfen ---------- */'); b = alt.index('/* ---------- Speicher (nur Komfort) ---------- */')
hilfen = alt[a:b].replace('var(--t', 'var(--w')
hilfen += '''
function parseNum(s){s=String(s).trim().replace(/\\s|%|€/g,'');if(s.includes(','))s=s.replace(/\\./g,'').replace(',','.');return parseFloat(s)}
'''
AUF = json.load(open(os.path.join(H, 'aufgaben.json'), encoding='utf-8'))
auf = 'const AUF=' + json.dumps(AUF, ensure_ascii=False, separators=(',', ':')) + ';\n'
js = ''.join(open(os.path.join(SRC, f), encoding='utf-8').read() + '\n' for f in sorted(os.listdir(SRC)) if f.endswith('.js'))
css = open(os.path.join(SRC, 'stil.css'), encoding='utf-8').read()

KOPF = '''<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Crashkurs IHK</title>
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Crashkurs IHK">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="theme-color" content="#DDF0FF">
<meta name="format-detection" content="telephone=no">
<meta name="robots" content="noindex">
<link rel="manifest" href="{p}manifest.webmanifest">
<link rel="apple-touch-icon" href="{p}apple-touch-icon.png">
<link rel="icon" href="{p}icon-192.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@600;700;800;900&display=swap">
<style>
'''
KOERPER = '''</style>
</head>
<body>
<div class="blobs" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
<canvas id="fx"></canvas>
<div id="flash"></div><div id="slam"></div>
<div class="wrap" id="app"></div>
<div id="layer"></div>
<nav id="tabbar" aria-label="Hauptmenü"></nav>
<div id="toast" role="status" aria-live="polite"></div>
<script>
'''
ENDE = '''</script>
<script>if("serviceWorker" in navigator){navigator.serviceWorker.register("{p}sw.js").catch(function(){})}</script>
</body>
</html>
'''
def seite(p):
    return KOPF.replace('{p}', p) + css + KOERPER + hilfen + auf + js + ENDE.replace('{p}', p)

os.makedirs(os.path.join(H, 'beta'), exist_ok=True)
open(os.path.join(H, 'beta', 'index.html'), 'w', encoding='utf-8').write(seite('../'))
print('beta gebaut', len(seite('../')))
if '--live' in sys.argv:
    open(os.path.join(H, 'index.html'), 'w', encoding='utf-8').write(seite(''))
    try:
        open(VAULT, 'w', encoding='utf-8').write(seite('https://kreov.github.io/wiso-trainer/'))
    except Exception as e:
        print('Vault-Fassung nicht geschrieben:', e)
    print('live gebaut')
