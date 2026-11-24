// Testlauf für Crashkurs IHK: tippt jede Seite und jeden Modus durch. Ergebnis in window.__TEST
(function(){
const log=[],fehler=[];const st0=window.setTimeout;const $=s=>document.querySelector(s);
window.addEventListener('error',e=>fehler.push('JS: '+e.message));
// Zeitgeber sofort ausführen, damit der Test nicht vom gedrosselten Hintergrund-Tab abhängt
window.setTimeout=(f,ms)=>{try{f()}catch(e){fehler.push('Timer: '+e.message)}return 0};
const tapEl=(el,name)=>{if(!el){fehler.push('FEHLT '+name);return false}el.scrollIntoView({block:'center'});const r=el.getBoundingClientRect();
  const t=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);if(!t||!(el===t||el.contains(t))){fehler.push('VERDECKT '+name+' von '+(t&&(t.className||t.tagName)));el.click();return true}
  t.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));return true};
const tap=(sel,name)=>tapEl(typeof sel==='string'?$(sel):sel,name||sel);
const ende=()=>{const e=$('.end h1');return e?e.textContent:null};
function loese(richtig){const q=R.q;
  if(!richtig&&(q.typ==='mc')){tapEl(document.querySelectorAll('.ans')[(q.richtig[0]+1)%q.optionen.length],'ans falsch')}
  else if(q.typ==='mc')tapEl(document.querySelectorAll('.ans')[q.richtig[0]],'ans');
  else if(q.typ==='multi')q.richtig.forEach(k=>tapEl(document.querySelectorAll('.ans')[k],'multi'));
  else if(q.typ==='zuordnen')q.aussagen.forEach((a,j)=>{tapEl(document.querySelectorAll('.chip')[richtig?a.k:(a.k+1)%q.kategorien.length],'chip');tapEl(document.querySelectorAll('.row')[j],'row')});
  else if(q.typ==='reihenfolge'){let n=0;while(richtig&&!R.ord.every((v,i)=>v===i)&&n++<60){const pos=R.ord.findIndex((v,i)=>v!==i);tapEl(document.querySelectorAll('[data-up]')[R.ord.indexOf(pos)],'up')}}
  else if(q.typ==='zahl')$('#numIn').value=richtig?String(q.loesung).replace('.',','):'999999';
  if(R.mode!=='blitz')tap('[data-act=check]','check');
  const w=$('#layer [data-act=weiter], #layer [data-act=ende]');if(w)tapEl(w,'weiter')}
function runde(name,start,richtig=true,max=40){start();if(!R){fehler.push(name+': keine Runde');return}let i=0;
  while(R&&R.q&&!ende()&&i++<max){if(R.mode==='blitz'&&Date.now()>=R.ende){timerTick();break}loese(typeof richtig==='function'?richtig(i):richtig)}
  if(R&&R.mode==='blitz'&&!ende()){R.ende=Date.now()-1;timerTick()}
  const e=ende();log.push(`${name}: ${e||'KEIN ENDE'} (${R?R.res.filter(Boolean).length+'/'+R.res.length:''})`);if(!e)fehler.push(name+' endet nicht');
  const k=$('#kiste .kbtn');if(k){tapEl(k,'kiste');log.push('  Kiste: '+$('#kiste').innerText.replace(/\n/g,' '))}
  tap('[data-act=home]','home')}
try{
  try{localStorage.removeItem(KEY)}catch(e){}S=S0();S.onboard=true;S.v=VERSION;S.sound=false;S.haptik=false;save();$('#splash')&&$('#splash').remove();layer('');zeigeTab('pfad',true);
  // Tabs
  ['ueben','stats','profil','pfad'].forEach(t=>{tap(`[data-tab=${t}]`,'tab '+t);if(!$('#app').innerText.trim())fehler.push('leer: '+t)});log.push('Tabs ok');
  // Lektion, verlorene Lektion, Boss, Prüfung
  runde('Lektion',()=>{tap('[data-lesson]');tap('#layer [data-play]')});
  runde('Lektion verloren',()=>{tap(document.querySelectorAll('[data-lesson]')[1]);tap('#layer [data-play]')},false);
  runde('Boss',()=>{tap('[data-unitboss]');tap('#layer [data-bossplay]')});
  runde('Echte Prüfung W2425',()=>{tap('[data-tab=ueben]');tap('[data-modus=examliste]');tap('[data-exam="Winter 2024/25"]')},i=>i%4!==0);
  // Üben-Modi
  const m=(x,name,r=true)=>runde(name||x,()=>{tap('[data-tab=ueben]');tap(`[data-modus="${x}"]`)},r);
  m('daily','Tages-Challenge');m('fehler','Fehlertraining');m('zufall','Zufallsmix',i=>i%3!==0);m('schwach','Schwächen');
  m('sim','Simulation',i=>i%2===0);m('blitz','Blitzrunde');m('surv','Survival',i=>i<6);
  m('typ-zahl','Nur Rechnen');m('typ-zuordnen','Nur Zuordnen');m('typ-reihenfolge','Nur Reihenfolge');
  // Favoriten: eine Aufgabe merken
  tap('[data-tab=ueben]');tap('[data-modus=zufall]');tap('[data-act=fav]','fav');tap('[data-act=quit]');if($('#layer [data-act=quitja]'))tap('#layer [data-act=quitja]');m('fav','Favoriten');
  // Wiederholen: Aufgaben fällig machen
  Object.values(S.stat).forEach(s=>s.last=tagPlus(heute(),-20));save();m('wdh','Wiederholen');
  // Themen, Spickzettel-Welt, Einzel
  runde('Thema',()=>{tap('[data-tab=ueben]');tap('[data-modus=themen]');tap('#layer [data-thema]')});
  runde('Welt aus Spickzettel',()=>{tap('[data-tab=ueben]');tap('.welten [data-lern=ezb]');tap('#layer [data-modus=welt]')});
  // Lernkarten
  tap('[data-tab=ueben]');tap('[data-modus=karten]');tap('#layer [data-karten=recht]');let kk=0;while(R&&R.karten&&$('#flip')&&kk++<15){tap('#flip','flip');tap(`[data-karte="${kk%2}"]`,'karte')}log.push('Lernkarten: '+(ende()||'KEIN ENDE'));tap('[data-act=home]');
  // Joker und Tipp
  S.inv.joker=2;S.knete=50;save();tap('[data-tab=ueben]');tap('[data-modus=zufall]');let jt=0;while(R&&R.q.typ!=='mc'&&jt++<12){loese(true)}
  if(R&&R.q&&R.q.typ==='mc'){tap('[data-act=joker]','joker');log.push('Joker: '+document.querySelectorAll('.ans.weg').length+' gestrichen');tap('[data-act=tipp]','tipp');log.push('Tipp: '+(!!$('.tippbox')))}
  tap('[data-act=quit]');if($('#layer [data-act=quitja]'))tap('#layer [data-act=quitja]','quitja');
  // Suche, Glossar, Formeln, Tipps
  tap('[data-tab=ueben]');tap('[data-modus=suche]');const sf=$('#sf');sf.value='Mutterschutz';sf.dispatchEvent(new Event('input'));log.push('Suche: '+$('#sz').textContent);
  runde('Einzel aus Suche',()=>tap('[data-einzel]'));
  tap('[data-tab=ueben]');tap('[data-modus=glossar]');const gf=$('#glf');gf.value='Kartell';gf.dispatchEvent(new Event('input'));log.push('Glossar: '+document.querySelectorAll('.gl').length+' Treffer');tap('[data-act=zurueck]');
  tap('[data-tab=ueben]');tap('[data-modus=formeln]');log.push('Formeln: '+document.querySelectorAll('.fk').length);tap('[data-act=zurueck]');
  tap('[data-tab=ueben]');tap('[data-modus=tipps]');log.push('Tipps: '+document.querySelectorAll('.tip').length);tap('[data-act=zurueck]');
  // Statistik
  tap('[data-tab=stats]');log.push('Statistik: Prognose '+($('.pnote')||{}).textContent+', Kalender '+document.querySelectorAll('.kal i').length);
  // Profil, Shop, Erfolge, Liga, Einstellungen, Funktionen
  tap('[data-tab=profil]');S.knete=1000;save();tap('[data-sub=shop]');tap('[data-shop="hut-krone"]','krone kaufen');tap('[data-kauf=freeze]','freeze kaufen');tap('[data-shop="farbe-pink"]','pink');log.push('Shop: Krone '+S.owned.includes('hut-krone')+', Freeze '+S.inv.freeze+', Farbe '+S.outfit.farbe);
  tap('[data-act=zurueck]');tap('[data-tab=profil]');tap('[data-sub=erfolge]');log.push('Erfolge: '+document.querySelectorAll('.ek.an').length+' von '+document.querySelectorAll('.ek').length);
  tap('[data-tab=profil]');tap('[data-sub=liga]');log.push('Liga: '+document.querySelectorAll('.lz').length+' Plätze');
  tap('[data-tab=profil]');tap('[data-sub=einstellungen]');tap('[data-seg=thema][data-v=hell]');log.push('Thema hell: '+document.documentElement.dataset.theme);tap('[data-seg=thema][data-v=dunkel]');log.push('Thema dunkel: '+document.documentElement.dataset.theme);tap('[data-seg=thema][data-v=auto]');
  tap('[data-seg=ziel][data-v="100"]');log.push('Ziel: '+S.ziel);
  tap('[data-tab=profil]');tap('[data-sub=features]');const nf=FEATURES.reduce((a,g)=>a+g[1].length,0);log.push('Funktionen: '+nf+' (Liste zeigt '+document.querySelectorAll('.gl li').length+')');if(nf<200)fehler.push('unter 200 Funktionen');
  tap('[data-tab=profil]');tap('[data-act=name]');$('#nin').value='Testi';tap('[data-act=nameok]');log.push('Name: '+S.name);
  tap('[data-tab=pfad]');tap('[data-act=weiterlernen]');log.push('Weiterlernen öffnet: '+(!!$('#layer .sheet')));layer('');
}catch(e){fehler.push('ABBRUCH: '+e.message+' '+(e.stack||'').split('\n')[1])}
window.setTimeout=st0;document.querySelectorAll('.emo,.xpfly').forEach(e=>e.remove());parts=[];
window.__TEST={log,fehler};
})();
