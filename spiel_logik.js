/* ---------- Welten (Reihenfolge wie in der echten Prüfung) ---------- */
const W={
 recht:{ic:'§',c:'var(--w4)',cd:'var(--w4d)',name:'Recht-Burg',sub:'Verträge, Besitz, Geschäftsfähigkeit'},
 arbeit:{ic:'⏱',c:'var(--w5)',cd:'var(--w5d)',name:'Arbeits-Dorf',sub:'Ausbildung, Schutzgesetze, Betriebsrat'},
 sozial:{ic:'✚',c:'var(--w6)',cd:'var(--w6d)',name:'Sozial-Bucht',sub:'Sozialversicherung, Steuern'},
 markt:{ic:'%',c:'var(--w2)',cd:'var(--w2d)',name:'Markt-Hafen',sub:'Preise, Elastizität, Wettbewerb'},
 kon:{ic:'↗',c:'var(--w3)',cd:'var(--w3d)',name:'Konjunktur-Berg',sub:'Phasen, BIP, Inflation, Staat'},
 ezb:{ic:'€',c:'var(--w1)',cd:'var(--w1d)',name:'EZB-Insel',sub:'Geldpolitik, Außenwirtschaft'}
};
const ORDER=Object.keys(W);
const RUNDE=8, HERZEN=3;
const LOB=['Stark!','Genau so!','Treffer!','Sauber!','Läuft bei dir!','Perfekt!','Prüfungsreif!'];
const TROST=['Knapp daneben','Nicht ganz','Fast','Merk dir das'];
const AUFG=AUF.filter(a=>W[a.welt]);
const PRUEF=[...new Set(AUFG.map(a=>a.pruefung))];
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const SPICK={recht:LERN.recht,arbeit:LERN.zahl,markt:LERN.el,kon:LERN.kon,ezb:LERN.ezb,
 sozial:`<div class="card" style="--c:var(--w6)"><h3>Fünf Säulen der Sozialversicherung</h3><p><b>Kranken-, Pflege-, Renten-, Arbeitslosen- und Unfallversicherung.</b> Die ersten vier zahlen Arbeitnehmer und Arbeitgeber grob je zur Hälfte. Die <b>Unfallversicherung</b> (Berufsgenossenschaft) zahlt <b>nur der Arbeitgeber</b>.</p></div>
<div class="card" style="--c:var(--w6)"><h3>Zwei Grenzen nicht verwechseln</h3><p><b>Beitragsbemessungsgrenze:</b> bis zu diesem Gehalt wird Beitrag berechnet, darüber nicht mehr.</p><p><b>Versicherungspflichtgrenze:</b> wer mehr verdient, darf in die private Krankenversicherung.</p></div>
<div class="card" style="--c:var(--w6)"><h3>Steuern vom Lohn</h3><p>Der Arbeitgeber behält <b>Lohnsteuer</b>, eventuell <b>Solidaritätszuschlag</b> und <b>Kirchensteuer</b> ein und führt sie ans Finanzamt ab. Was übrig bleibt, ist dein <b>Netto</b>.</p></div>
<div class="card" style="--c:var(--w6)"><h3>Ökonomisches Prinzip</h3><p><b>Maximalprinzip:</b> mit festen Mitteln so viel wie möglich erreichen. <b>Minimalprinzip:</b> ein festes Ziel mit so wenig Mitteln wie möglich erreichen.</p></div>`};
const TYPNAME={mc:'Eine Antwort',multi:'Mehrere Antworten',zuordnen:'Zuordnen',reihenfolge:'Reihenfolge',zahl:'Rechnen'};

/* ---------- Speicher (nur Komfort) ---------- */
const KEY='wiso-quest-v2';
let S={xp:0,best:0,serie:0,stars:{},exam:{},seen:{},sound:true};
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s)S=Object.assign(S,s)}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const level=()=>Math.floor(S.xp/100)+1;

/* ---------- Ton ---------- */
let AC=null;
function ton(seq){if(!S.sound)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();let t=AC.currentTime;
  seq.forEach(([f,d,typ])=>{const o=AC.createOscillator(),g=AC.createGain();o.type=typ||'triangle';o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.18,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+d+.02);t+=d*.8})}catch(e){}}
const tonOk=()=>ton([[660,.12],[880,.12],[1175,.2]]);
const tonBad=()=>ton([[300,.18,'sawtooth'],[220,.25,'sawtooth']]);
const tonWin=()=>ton([[523,.14],[659,.14],[784,.14],[1047,.35]]);
const tonTap=()=>ton([[520,.06]]);

/* ---------- Konfetti ---------- */
const cv=document.getElementById('fx'),cx=cv.getContext('2d');let parts=[],raf=null;
const RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function konfetti(n=90){if(RM)return;cv.width=innerWidth*devicePixelRatio;cv.height=innerHeight*devicePixelRatio;
  const cols=['#FF5A5F','#3B82F6','#10B981','#A855F7','#FF9F1C','#FFC531'];
  for(let i=0;i<n;i++)parts.push({x:innerWidth/2+(Math.random()-.5)*160,y:innerHeight*.55,vx:(Math.random()-.5)*14,vy:-Math.random()*16-6,r:Math.random()*6+4,c:cols[i%cols.length],a:Math.random()*6,va:(Math.random()-.5)*.4,life:90});
  if(!raf)loop()}
function loop(){cx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);cx.clearRect(0,0,innerWidth,innerHeight);
  parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.55;p.vx*=.98;p.a+=p.va;p.life--;cx.save();cx.translate(p.x,p.y);cx.rotate(p.a);cx.fillStyle=p.c;cx.globalAlpha=Math.max(0,Math.min(1,p.life/30));cx.fillRect(-p.r,-p.r/2,p.r*2,p.r);cx.restore()});
  parts=parts.filter(p=>p.life>0&&p.y<innerHeight+40);raf=parts.length?requestAnimationFrame(loop):(cx.clearRect(0,0,innerWidth,innerHeight),null)}

/* ---------- Bausteine ---------- */
const app=h=>{$('#app').innerHTML=h;window.scrollTo({top:0})};
const layer=h=>{$('#layer').innerHTML=h};
const MAXST=ORDER.length*3;
function topbar(){const x=S.xp%100;return `<div class="top"><div class="lvl"><div class="ring" aria-label="Level">${level()}</div><div class="xpbar" aria-label="XP bis zum nächsten Level"><i style="width:${x}%"></i></div></div>
 <span class="badge" title="Serie">🔥 ${S.serie}</span><span class="badge" title="Sterne">⭐ ${Object.values(S.stars).reduce((a,b)=>a+b,0)}/${MAXST}</span><span class="badge" title="XP">${S.xp} XP</span>
 <button class="snd" data-act="snd" aria-label="Ton an oder aus">${S.sound?'🔊':'🔇'}</button></div>`}
const sterne=n=>`<div class="stars">${[0,1,2].map(i=>i<n?'<b>★</b>':'★').join('')}</div>`;
const pool=k=>AUFG.filter(a=>a.welt===k);
const gesehen=k=>pool(k).filter(a=>S.seen[a.id]).length;
const noteVon=p=>p>=92?1:p>=81?2:p>=67?3:p>=50?4:p>=30?5:6;

/* ---------- Karte ---------- */
function karte(){
  layer('');const offen=ORDER.find(k=>!(S.stars[k]>=1));
  app(`${topbar()}<div class="hero"><h1>WiSo Quest</h1><p>${AUFG.length} echte Prüfungsaufgaben aus ${PRUEF.length} IHK-Prüfungen</p></div>
  <div class="map">${ORDER.map(k=>{const w=W[k],n=pool(k).length;return `<div class="node" style="--c:${w.c};--cd:${w.cd}"><button class="orb ${k===offen?'pulse':''}" data-welt="${k}" aria-label="${w.name}"><span class="ic">${w.ic}</span></button><div class="info"><div class="name">${w.name}</div><div class="sub">${w.sub}</div><div class="sub">${gesehen(k)} von ${n} Aufgaben gesehen</div>${sterne(S.stars[k]||0)}</div></div>`}).join('')}
   <div class="node boss" style="--c:#5B3BD6;--cd:#1A1540"><button class="orb" data-act="boss" aria-label="Echte Prüfung schreiben"><span class="ic">👑</span></button><div class="info"><div class="name">Echte Prüfung</div><div class="sub">Eine ganze IHK-Prüfung am Stück, am Ende deine Note</div></div></div>
  </div>`);
}
function weltMenu(k){const w=W[k],n=pool(k).length;
  layer(`<div class="dim" data-act="close"><div class="sheet" style="--c:${w.c};--cd:${w.cd}"><span class="tag">${w.ic} ${w.name}</span><h2>${w.sub}</h2><p style="color:var(--muted);margin:0">${n} echte Aufgaben · ${RUNDE} je Runde · ${HERZEN} Herzen</p>${sterne(S.stars[k]||0)}
  <div class="btns"><button class="btn" data-play="${k}">▶ Spielen</button><button class="btn light" data-lern="${k}">📖 Spickzettel lesen</button><button class="btn light" data-act="close">Zurück zur Karte</button></div></div></div>`)}
function spick(k){const w=W[k];
  layer(`<div class="dim" data-act="close"><div class="sheet lern" style="--c:${w.c};--cd:${w.cd}"><span class="tag">${w.ic} Spickzettel</span><h2>${w.sub}</h2>${SPICK[k]}
  <div class="btns"><button class="btn" data-play="${k}">▶ Jetzt spielen</button><button class="btn light" data-act="close">Schließen</button></div></div></div>`)}
function examMenu(){
  layer(`<div class="dim" data-act="close"><div class="sheet" style="--c:#5B3BD6;--cd:#1A1540"><span class="tag">👑 Echte Prüfung</span><h2>Welche Prüfung?</h2><p style="color:var(--muted);margin:0">Alle Aufgaben in Originalreihenfolge, ohne Herzen. Am Ende die Note nach IHK-Schlüssel.</p>
  <div class="btns">${PRUEF.map(p=>{const n=AUFG.filter(a=>a.pruefung===p).length;return `<button class="btn light exam" data-exam="${esc(p)}"><span>${esc(p)}</span><small>${n} Aufgaben${S.exam[p]?` · beste Note ${S.exam[p]}`:''}</small></button>`}).join('')}
  <button class="btn" data-exam="*">🎲 Gemischte Prüfung (28 zufällige)</button><button class="btn light" data-act="close">Zurück</button></div></div></div>`)}

/* ---------- Runde ---------- */
let R=null;
function auswahl(k){const p=shuffle(pool(k));p.sort((a,b)=>(S.seen[a.id]?1:0)-(S.seen[b.id]?1:0));return p.slice(0,RUNDE)}
function spielen(k){layer('');const list=auswahl(k);R={k,exam:null,list,i:0,n:list.length,herz:HERZEN,richtig:0,combo:0,xp:0,res:[]};frage()}
function pruefung(p){layer('');let list=[];
  if(p==='*'){const per={recht:6,arbeit:7,sozial:2,markt:4,kon:5,ezb:4};ORDER.forEach(k=>list.push(...shuffle(pool(k)).slice(0,per[k])))}
  else list=AUFG.filter(a=>a.pruefung===p).sort((a,b)=>a.nr-b.nr);
  R={k:null,exam:p,list,i:0,n:list.length,herz:Infinity,richtig:0,combo:0,xp:0,res:[]};frage()}
function frage(){
  const q=R.list[R.i];R.q=q;R.done=false;R.sel=null;
  if(q.typ==='multi')R.sel=[];
  if(q.typ==='zuordnen'){R.zu=q.aussagen.map(()=>null);R.chip=null}
  if(q.typ==='reihenfolge'){const n=q.schritte.length;let o;do{o=shuffle([...Array(n).keys()])}while(n>1&&o.every((v,i)=>v===i));R.ord=o}
  zeichne();
}
function sortHTML(q){return R.ord.map((ix,pos)=>`<div class="sitem" data-ix="${ix}"><span class="grip" aria-hidden="true">☰</span><span class="n">${pos+1}</span><span class="t">${esc(q.schritte[ix])}</span><span class="mv"><button data-up="${pos}" aria-label="nach oben">▲</button><button data-down="${pos}" aria-label="nach unten">▼</button></span></div>`).join('')}
function zeichne(){
  const q=R.q,w=W[q.welt],p=Math.round(R.i/R.n*100);
  const kopf=R.exam?`<span class="badge">👑 ${R.i+1}/${R.n}</span>`:`<span class="hearts" aria-label="${R.herz} Herzen">${[0,1,2].map(i=>i<R.herz?'♥':'<span class="off">♥</span>').join('')}</span>`;
  let body='',hint='';
  if(q.typ==='mc'||q.typ==='multi'){
    if(q.typ==='multi')hint=`Wähle ${q.richtig.length} Antworten.`;
    body=`<div class="answers">${q.optionen.map((o,i)=>`<button class="ans" data-o="${i}"><span class="n">${i+1}</span><span>${esc(o)}</span></button>`).join('')}</div>`}
  if(q.typ==='zuordnen'){hint='Zieh eine Nummer auf den passenden Fall. Oder tipp erst die Nummer, dann den Fall.';
    body=`<div class="chips">${q.kategorien.map((c,i)=>`<button class="chip" data-k="${i}"><span class="n">${i+1}</span><span>${esc(c)}</span></button>`).join('')}</div>
    <div class="rows">${q.aussagen.map((a,j)=>`<button class="row" data-row="${j}"><span class="slot">?</span><span class="t">${esc(a.t)}</span></button>`).join('')}</div>`}
  if(q.typ==='reihenfolge'){hint='Zieh die Karten in die richtige Reihenfolge. Oben steht der erste Schritt.';
    body=`<div class="sortlist" id="sl">${sortHTML(q)}</div>`}
  if(q.typ==='zahl')body=`<div class="numrow"><input id="numIn" inputmode="decimal" autocomplete="off" placeholder="?" aria-label="Ergebnis"><span class="u">${esc(q.einheit||'')}</span></div>`;
  app(`<div style="--c:${w.c};--cd:${w.cd}"><div class="bar"><button class="x" data-act="quit" aria-label="Runde beenden">✕</button><div class="prog"><i style="width:${p}%"></i></div>${R.combo>=3?`<span class="combo">x${R.combo>=5?3:2}</span>`:''}${kopf}</div>
  <div class="qcard" id="qc"><div class="tags"><span class="tag">${w.ic} ${esc(q.thema||w.name)}</span><span class="tag src">${esc(q.pruefung)} · Aufgabe ${q.nr}</span><span class="tag typ">${TYPNAME[q.typ]}</span></div>
  ${q.situation?`<div class="sit">${esc(q.situation)}</div>`:''}<div class="qtext">${esc(q.frage)}</div>${hint?`<div class="lbl">${hint}</div>`:''}${body}</div>
  <div class="check"><button class="btn" id="chk" data-act="check">Prüfen</button></div><div class="space" id="sp" hidden></div></div>`);
  if(q.typ==='zahl'){const i=$('#numIn');i.addEventListener('keydown',e=>{if(e.key==='Enter')pruefen()})}
}
function zuMalen(){document.querySelectorAll('.row').forEach((r,j)=>{const v=R.zu[j];r.querySelector('.slot').textContent=v===null?'?':v+1;r.classList.toggle('filled',v!==null)});
  document.querySelectorAll('.chip').forEach((c,i)=>c.classList.toggle('sel',R.chip===i))}
function setzeZu(j,k){if(R.done)return;R.zu[j]=k;R.chip=null;tonTap();zuMalen();const r=document.querySelectorAll('.row')[j];r.classList.remove('pop');void r.offsetWidth;r.classList.add('pop')}
function sortNeu(){const sl=$('#sl');if(sl)sl.innerHTML=sortHTML(R.q)}

/* ---------- Ziehen (Finger und Maus) ---------- */
let D=null,justDragged=false;
document.addEventListener('pointerdown',e=>{
  if(!R||R.done)return;
  const chip=e.target.closest('.chip'),it=e.target.closest('.sitem');
  if(it&&e.target.closest('.mv'))return;
  if(chip)D={typ:'chip',el:chip,k:+chip.dataset.k,x0:e.clientX,y0:e.clientY,on:false,id:e.pointerId};
  else if(it)D={typ:'sort',el:it,x0:e.clientX,y0:e.clientY,on:false,id:e.pointerId};
});
document.addEventListener('pointermove',e=>{
  if(!D||e.pointerId!==D.id)return;
  if(!D.on){if(Math.hypot(e.clientX-D.x0,e.clientY-D.y0)<8)return;D.on=true;
    if(D.typ==='chip'){const g=D.el.cloneNode(true);g.classList.add('ghost');document.body.appendChild(g);D.g=g;const r=D.el.getBoundingClientRect();D.dx=e.clientX-r.left;D.dy=e.clientY-r.top;g.style.width=r.width+'px'}
    else D.el.classList.add('drag')}
  e.preventDefault();
  if(D.typ==='chip'){D.g.style.left=(e.clientX-D.dx)+'px';D.g.style.top=(e.clientY-D.dy)+'px';
    document.querySelectorAll('.row').forEach(r=>{const b=r.getBoundingClientRect();r.classList.toggle('hover',e.clientX>=b.left&&e.clientX<=b.right&&e.clientY>=b.top&&e.clientY<=b.bottom)})}
  else{const el=D.el;let dy=e.clientY-D.y0;
    const prev=el.previousElementSibling,next=el.nextElementSibling;
    if(next&&dy>next.offsetHeight/2+6){el.parentNode.insertBefore(next,el);D.y0+=next.offsetHeight+12;dy=e.clientY-D.y0;tonTap()}
    else if(prev&&dy<-(prev.offsetHeight/2+6)){el.parentNode.insertBefore(el,prev);D.y0-=prev.offsetHeight+12;dy=e.clientY-D.y0;tonTap()}
    el.style.transform=`translateY(${dy}px)`}
},{passive:false});
function dragEnde(e){
  if(!D||e.pointerId!==D.id)return;const d=D;D=null;if(!d.on)return;justDragged=true;setTimeout(()=>justDragged=false,60);
  if(d.typ==='chip'){d.g.remove();let ziel=null;document.querySelectorAll('.row').forEach((r,j)=>{r.classList.remove('hover');const b=r.getBoundingClientRect();if(e.clientX>=b.left&&e.clientX<=b.right&&e.clientY>=b.top&&e.clientY<=b.bottom)ziel=j});
    if(ziel!==null)setzeZu(ziel,d.k)}
  else{d.el.classList.remove('drag');d.el.style.transform='';R.ord=[...document.querySelectorAll('#sl .sitem')].map(x=>+x.dataset.ix);sortNeu()}
}
document.addEventListener('pointerup',dragEnde);document.addEventListener('pointercancel',dragEnde);

/* ---------- Prüfen ---------- */
function pruefen(){
  const q=R.q;if(R.done)return;let ok=false,info='';
  if(q.typ==='mc'){if(R.sel===null)return wackel();const r=q.richtig[0];ok=R.sel===r;
    document.querySelectorAll('.ans').forEach((b,i)=>{b.disabled=true;if(i===r)b.classList.add('right');else if(i===R.sel)b.classList.add('wrong')});
    if(!ok)info=`<div class="why"><b>Richtig ist ${r+1}:</b> ${esc(q.optionen[r])}</div>`}
  if(q.typ==='multi'){if(!R.sel.length)return wackel();const rs=new Set(q.richtig);ok=R.sel.length===rs.size&&R.sel.every(i=>rs.has(i));
    document.querySelectorAll('.ans').forEach((b,i)=>{b.disabled=true;b.classList.remove('sel');if(rs.has(i))b.classList.add('right');else if(R.sel.includes(i))b.classList.add('wrong')});
    if(!ok)info=`<div class="why"><b>Richtig sind:</b><br>${q.richtig.map(i=>`${i+1}. ${esc(q.optionen[i])}`).join('<br>')}</div>`}
  if(q.typ==='zuordnen'){if(R.zu.some(v=>v===null))return wackel();ok=q.aussagen.every((a,j)=>R.zu[j]===a.k);
    document.querySelectorAll('.row').forEach((r,j)=>{r.disabled=true;const good=R.zu[j]===q.aussagen[j].k;r.classList.add(good?'right':'wrong');if(!good)r.querySelector('.slot').innerHTML=`<s>${R.zu[j]+1}</s>${q.aussagen[j].k+1}`});
    if(!ok)info=`<div class="why"><b>Richtig:</b><br>${q.aussagen.map(a=>`<b>${a.k+1}</b> ${esc(q.kategorien[a.k])} ← ${esc(a.t)}`).join('<br>')}</div>`}
  if(q.typ==='reihenfolge'){ok=R.ord.every((v,i)=>v===i);
    document.querySelectorAll('#sl .sitem').forEach((x,pos)=>x.classList.add(+x.dataset.ix===pos?'right':'wrong'));
    if(!ok)info=`<div class="why"><b>Richtige Reihenfolge:</b><br>${q.schritte.map((s,i)=>`${i+1}. ${esc(s)}`).join('<br>')}</div>`}
  if(q.typ==='zahl'){const v=parseNum($('#numIn').value);if(isNaN(v))return wackel();ok=Math.abs(v-q.loesung)<=Math.max(+q.toleranz||0,0.005);$('#numIn').disabled=true;
    if(!ok)info=`<div class="why"><b>Lösung:</b> ${esc(String(q.loesung).replace('.',','))} ${esc(q.einheit||'')}</div>`;
    if(q.rechenweg)info+=`<div class="why"><b>Rechenweg:</b> ${esc(q.rechenweg)}</div>`}
  R.done=true;R.res.push(ok);S.seen[q.id]=1;
  let plus=0;
  if(ok){R.richtig++;R.combo++;S.serie++;S.best=Math.max(S.best,S.serie);const m=R.combo>=5?3:R.combo>=3?2:1;plus=10*m;R.xp+=plus;S.xp+=plus;tonOk();konfetti(R.combo>=3?140:70)}
  else{R.combo=0;S.serie=0;if(!R.exam){R.herz--;const h=document.querySelector('.hearts');if(h)h.innerHTML=[0,1,2].map(i=>i<R.herz?'♥':'<span class="off">♥</span>').join('')}tonBad();const qc=$('#qc');qc.classList.remove('shake');void qc.offsetWidth;qc.classList.add('shake')}
  save();
  const ende=R.i+1>=R.n||R.herz<=0;
  $('#chk').hidden=true;$('#sp').hidden=false;
  layer(`<div class="fb ${ok?'ok':'bad'}" role="status"><div class="in"><h3>${ok?pick(LOB):pick(TROST)} ${ok?`<span class="xp">+${plus} XP${R.combo>=3?' · Combo':''}</span>`:(R.exam?'':`<span class="xp" style="background:#fff;box-shadow:none">−1 ♥</span>`)}</h3>${info}<div class="why">💡 ${esc(q.erklaerung)}</div>
  <div class="btns"><button class="btn" style="--c:${ok?'var(--ok)':'var(--bad)'};--cd:${ok?'var(--ok-d)':'var(--bad-d)'}" data-act="${ende?'ende':'weiter'}">${ende?'Ergebnis':'Weiter'}</button></div></div></div>`);
}
function wackel(){const b=$('#chk');b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake')}
function ende(){
  layer('');const n=R.res.length,r=R.richtig;
  if(R.exam){const p=Math.round(r/R.n*100),note=noteVon(p);if(R.exam!=='*'&&(!S.exam[R.exam]||note<S.exam[R.exam]))S.exam[R.exam]=note;save();if(note<=4){tonWin();konfetti(200)}
    const falsch=R.list.filter((q,i)=>!R.res[i]);
    return app(`${topbar()}<div class="end"><div class="lbl">${R.exam==='*'?'Gemischte Prüfung':esc(R.exam)}</div><div class="note">${note}</div><h1>${p} von 100 Punkten</h1><p style="color:var(--muted)">${r} von ${R.n} richtig. ${note<=2?'Stark, das sitzt.':note<=4?'Bestanden! Schau dir die Fehler unten an.':'Noch nicht. Spiel die Inseln mit den Fehlern.'}</p>
    <div class="statrow"><div class="stat"><b>+${R.xp}</b><span>XP</span></div><div class="stat"><b>${S.best}</b><span>beste Serie</span></div></div>
    ${falsch.length?`<div class="fehler"><h3>Daneben (${falsch.length})</h3>${falsch.map(q=>`<div class="fz" style="--c:${W[q.welt].c}"><b>Aufgabe ${q.nr} · ${esc(q.thema)}</b><span>${esc(q.erklaerung)}</span></div>`).join('')}</div>`:''}
    <div class="btns" style="max-width:420px;margin:0 auto"><button class="btn" data-act="boss">Andere Prüfung</button><button class="btn light" data-act="karte">Zur Karte</button></div></div>`)}
  const tot=R.herz<=0&&n<R.n;const f=n-r;const st=tot?0:f===0?3:f<=1?2:1;
  if(st>(S.stars[R.k]||0))S.stars[R.k]=st;save();if(st>=2){tonWin();konfetti(180)}
  const w=W[R.k];
  app(`${topbar()}<div class="end" style="--c:${w.c};--cd:${w.cd}"><div class="big3">${[0,1,2].map(i=>i<st?'<b>★</b>':'★').join('')}</div><h1>${tot?'Keine Herzen mehr':st===3?'Fehlerfrei!':st===2?'Starke Runde!':'Runde geschafft'}</h1>
  <p style="color:var(--muted)">${w.name}: ${r} von ${n} richtig${tot?'. Lies kurz den Spickzettel und versuch es nochmal.':''}</p>
  <div class="statrow"><div class="stat"><b>+${R.xp}</b><span>XP</span></div><div class="stat"><b>${level()}</b><span>Level</span></div><div class="stat"><b>${S.best}</b><span>beste Serie</span></div></div>
  <div class="btns" style="max-width:420px;margin:0 auto"><button class="btn" data-play="${R.k}">Nochmal spielen</button>${tot?`<button class="btn light" data-lern="${R.k}">📖 Spickzettel</button>`:''}<button class="btn light" data-act="karte">Zur Karte</button></div></div>`);
}

/* ---------- Klicks ---------- */
document.addEventListener('click',e=>{
  if(justDragged)return;
  const b=e.target.closest('button,[data-act="close"]');if(!b)return;
  if(b.dataset.welt)return weltMenu(b.dataset.welt);
  if(b.dataset.play)return spielen(b.dataset.play);
  if(b.dataset.lern)return spick(b.dataset.lern);
  if(b.dataset.exam)return pruefung(b.dataset.exam);
  if(R&&!R.done){
    if(b.dataset.o!==undefined){const i=+b.dataset.o;tonTap();
      if(R.q.typ==='multi')R.sel=R.sel.includes(i)?R.sel.filter(x=>x!==i):[...R.sel,i];else R.sel=i;
      document.querySelectorAll('.ans').forEach((x,j)=>x.classList.toggle('sel',R.q.typ==='multi'?R.sel.includes(j):j===R.sel));return}
    if(b.dataset.k!==undefined){const k=+b.dataset.k;R.chip=R.chip===k?null:k;tonTap();return zuMalen()}
    if(b.dataset.row!==undefined){const j=+b.dataset.row;if(R.chip!==null)return setzeZu(j,R.chip);if(R.zu[j]!==null){R.zu[j]=null;return zuMalen()}b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');return}
    if(b.dataset.up!==undefined||b.dataset.down!==undefined){const p=+(b.dataset.up??b.dataset.down),t=b.dataset.up!==undefined?p-1:p+1;if(t<0||t>=R.ord.length)return;[R.ord[p],R.ord[t]]=[R.ord[t],R.ord[p]];tonTap();return sortNeu()}
  }
  const a=b.dataset.act;
  if(a==='close'&&e.target===b)return layer('');
  if(a==='close'&&b.tagName==='BUTTON')return layer('');
  if(a==='snd'){S.sound=!S.sound;save();return karte()}
  if(a==='boss')return examMenu();
  if(a==='check')return pruefen();
  if(a==='weiter'){layer('');R.i++;return frage()}
  if(a==='ende')return ende();
  if(a==='karte'||a==='quit'){R=null;return karte()}
});
karte();
