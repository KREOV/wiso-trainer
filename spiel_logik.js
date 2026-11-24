/* ---------- Welten ---------- */
const W={
 ezb:{ic:'€',c:'var(--w1)',cd:'var(--w1d)',name:'EZB-Insel',sub:'Leitzins, Tender, Mindestreserve'},
 el:{ic:'%',c:'var(--w2)',cd:'var(--w2d)',name:'Markt-Hafen',sub:'Elastizität, Angebot, Nachfrage'},
 kon:{ic:'↗',c:'var(--w3)',cd:'var(--w3d)',name:'Konjunktur-Berg',sub:'Phasen, Staat, Arbeitslosenquote'},
 recht:{ic:'§',c:'var(--w4)',cd:'var(--w4d)',name:'Recht-Burg',sub:'Alter, Besitz, Verträge'},
 zahl:{ic:'⏱',c:'var(--w5)',cd:'var(--w5d)',name:'Zahlen-Dorf',sub:'Jugendschutz, Mutterschutz, Wahlen'}
};
const ORDER=Object.keys(W);
const RUNDE=8, HERZEN=3;
const LOB=['Stark!','Genau so!','Treffer!','Sauber!','Läuft bei dir!','Perfekt!','Prüfungsreif!'];
const TROST=['Knapp daneben','Nicht ganz','Fast','Merk dir das'];

/* ---------- Speicher (nur Komfort) ---------- */
const KEY='wiso-quest-v1';
let S={xp:0,best:0,serie:0,stars:{},boss:null,sound:true};
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
function topbar(){const x=S.xp%100;return `<div class="top"><div class="lvl"><div class="ring" aria-label="Level">${level()}</div><div class="xpbar" aria-label="XP bis zum nächsten Level"><i style="width:${x}%"></i></div></div>
 <span class="badge" title="Serie">🔥 ${S.serie}</span><span class="badge" title="Sterne">⭐ ${Object.values(S.stars).reduce((a,b)=>a+b,0)}/15</span><span class="badge" title="XP">${S.xp} XP</span>
 <button class="snd" data-act="snd" aria-label="Ton an oder aus">${S.sound?'🔊':'🔇'}</button></div>`}
const sterne=n=>`<div class="stars">${[0,1,2].map(i=>i<n?'<b>★</b>':'★').join('')}</div>`;

/* ---------- Karte ---------- */
function karte(){
  layer('');const offen=ORDER.find(k=>!(S.stars[k]>=1));
  app(`${topbar()}<div class="hero"><h1>WiSo Quest</h1><p>Fünf Inseln, ein Boss. Jede Runde neue Prüfungsfragen.</p></div>
  <div class="map">${ORDER.map(k=>{const w=W[k];return `<div class="node" style="--c:${w.c};--cd:${w.cd}"><button class="orb ${k===offen?'pulse':''}" data-welt="${k}" aria-label="${w.name}"><span class="ic">${w.ic}</span></button><div class="info"><div class="name">${w.name}</div><div class="sub">${w.sub}</div>${sterne(S.stars[k]||0)}</div></div>`}).join('')}
   <div class="node boss" style="--c:#5B3BD6;--cd:#1A1540"><button class="orb" data-act="boss" aria-label="Prüfungs-Boss"><span class="ic">👑</span></button><div class="info"><div class="name">Prüfungs-Boss</div><div class="sub">10 Fragen aus allen Inseln, am Ende deine Note</div>${S.boss?`<div class="sub">Beste Note: <b>${S.boss}</b></div>`:''}</div></div>
  </div>`);
}
function weltMenu(k){const w=W[k];
  layer(`<div class="dim" data-act="close"><div class="sheet" style="--c:${w.c};--cd:${w.cd}" onclick="event.stopPropagation()"><span class="tag">${w.ic} ${w.name}</span><h2>${TH[k].name}</h2><p style="color:var(--muted);margin:0">${RUNDE} Fragen · ${HERZEN} Herzen · kam in ${TH[k].freq} Prüfungen</p>${sterne(S.stars[k]||0)}
  <div class="btns"><button class="btn" data-play="${k}">▶ Spielen</button><button class="btn light" data-lern="${k}">📖 Spickzettel lesen</button><button class="btn light" data-act="close">Zurück zur Karte</button></div></div></div>`)}
function spick(k){const w=W[k];
  layer(`<div class="dim" data-act="close"><div class="sheet lern" style="--c:${w.c};--cd:${w.cd}" onclick="event.stopPropagation()"><span class="tag">${w.ic} Spickzettel</span><h2>${TH[k].name}</h2>${LERN[k]}
  <div class="btns"><button class="btn" data-play="${k}">▶ Jetzt spielen</button><button class="btn light" data-act="close">Schließen</button></div></div></div>`)}

/* ---------- Runde ---------- */
let R=null;
function spielen(k,boss){
  layer('');R={k,boss:!!boss,i:0,n:boss?10:RUNDE,herz:boss?Infinity:HERZEN,richtig:0,combo:0,xp:0,res:[]};
  if(boss)R.order=shuffle([...ORDER,...ORDER]);
  frage();
}
function frage(){
  const k=R.boss?R.order[R.i]:R.k;R.q=gen(k);R.sel=null;R.picked=[];R.pool=null;R.done=false;zeichne();
}
function zeichne(){
  const q=R.q,w=W[q.topic],p=Math.round(R.i/R.n*100);
  const herz=R.boss?`<span class="badge">👑 ${R.i+1}/10</span>`:`<span class="hearts" aria-label="${R.herz} Herzen">${[0,1,2].map(i=>i<R.herz?'♥':'<span class="off">♥</span>').join('')}</span>`;
  let body='';
  if(q.typ==='mc')body=`<div class="answers">${q.opts.map((o,i)=>`<button class="ans" data-o="${i}"><span class="n">${i+1}</span><span>${o.t}</span></button>`).join('')}</div>`;
  if(q.typ==='num')body=`<div class="numrow"><input id="numIn" inputmode="decimal" autocomplete="off" placeholder="?" aria-label="Ergebnis"><span class="u">${q.unit||''}</span></div>`;
  if(q.typ==='order'){if(!R.pool)R.pool=shuffle(q.items);
    body=`<div class="lbl">Deine Reihenfolge</div><div class="answers picked">${R.picked.map((s,i)=>`<div class="ans"><span class="n">${i+1}</span><span>${s}</span></div>`).join('')||'<div class="lbl">noch leer, tipp unten an</div>'}</div>
    <div class="lbl">Schritte</div><div class="answers">${R.pool.filter(s=>!R.picked.includes(s)).map(s=>`<button class="ans" data-p="${encodeURIComponent(s)}"><span class="n">+</span><span>${s}</span></button>`).join('')}</div>`;}
  app(`<div style="--c:${w.c};--cd:${w.cd}"><div class="bar"><button class="x" data-act="quit" aria-label="Runde beenden">✕</button><div class="prog"><i style="width:${p}%"></i></div>${R.combo>=3?`<span class="combo">x${R.combo>=5?3:2}</span>`:''}${herz}</div>
  <div class="qcard" id="qc"><span class="tag">${w.ic} ${w.name}</span><div class="qtext">${q.text}</div>${q.ask?`<div class="ask">${q.ask}</div>`:''}${body}</div>
  <div class="check"><button class="btn" id="chk" data-act="check">Prüfen</button></div><div class="space" id="sp" hidden></div></div>`);
  if(q.typ==='num'){const i=$('#numIn');i.addEventListener('keydown',e=>{if(e.key==='Enter')pruefen()})}
}
function pruefen(){
  const q=R.q;if(R.done)return;let ok=false,info='';
  if(q.typ==='mc'){if(R.sel===null){wackel();return}ok=R.sel===q.ok;
    document.querySelectorAll('.ans').forEach((b,i)=>{b.disabled=true;if(i===q.ok)b.classList.add('right');else if(i===R.sel)b.classList.add('wrong')});
    if(!ok){info=`<div class="why"><b>Richtig ist ${q.ok+1}:</b> ${q.opts[q.ok].t}</div>`;const ch=q.opts[R.sel];if(ch.why)info+=`<div class="why"><b>Zu deiner Antwort:</b> ${ch.why}</div>`}}
  if(q.typ==='num'){const v=parseNum($('#numIn').value);if(isNaN(v)){wackel();return}ok=Math.abs(Math.abs(v)-Math.abs(q.answer))<=q.tol;$('#numIn').disabled=true;
    if(!ok)info=`<div class="why"><b>Lösung:</b> ${fmt(q.answer,q.unit==='Mio. €'?0:q.unit==='Mrd. €'?1:2)} ${q.unit||''}</div>`}
  if(q.typ==='order'){if(R.picked.length<q.items.length){wackel();return}ok=R.picked.every((s,i)=>s===q.items[i]);
    if(!ok)info=`<div class="why"><b>Richtig:</b><br>${q.items.map((s,i)=>`${i+1}. ${s}`).join('<br>')}</div>`}
  R.done=true;R.res.push(ok);
  let plus=0;
  if(ok){R.richtig++;R.combo++;S.serie++;S.best=Math.max(S.best,S.serie);const m=R.combo>=5?3:R.combo>=3?2:1;plus=10*m;R.xp+=plus;S.xp+=plus;tonOk();konfetti(R.combo>=3?140:70)}
  else{R.combo=0;S.serie=0;if(!R.boss){R.herz--;const h=document.querySelector('.hearts');if(h)h.innerHTML=[0,1,2].map(i=>i<R.herz?'♥':'<span class="off">♥</span>').join('')}tonBad();const qc=$('#qc');qc.classList.remove('shake');void qc.offsetWidth;qc.classList.add('shake')}
  save();
  const ende=R.i+1>=R.n||R.herz<=0;
  $('#chk').hidden=true;$('#sp').hidden=false;
  layer(`<div class="fb ${ok?'ok':'bad'}" role="status"><div class="in"><h3>${ok?pick(LOB):pick(TROST)} ${ok?`<span class="xp">+${plus} XP${R.combo>=3?' · Combo':''}</span>`:(R.boss?'':`<span class="xp" style="background:#fff;box-shadow:none">−1 ♥</span>`)}</h3>${info}<div class="why">${q.why}</div>
  <div class="btns"><button class="btn" style="--c:${ok?'var(--ok)':'var(--bad)'};--cd:${ok?'var(--ok-d)':'var(--bad-d)'}" data-act="${ende?'ende':'weiter'}">${ende?'Ergebnis':'Weiter'}</button></div></div></div>`);
}
function wackel(){const b=$('#chk');b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake')}
function ende(){
  layer('');const n=R.res.length,r=R.richtig;
  if(R.boss){const p=r*10,note=p>=92?1:p>=81?2:p>=67?3:p>=50?4:p>=30?5:6;if(!S.boss||note<S.boss)S.boss=note;save();if(note<=4){tonWin();konfetti(200)}
    return app(`${topbar()}<div class="end"><div class="lbl">Prüfungs-Boss</div><div class="note">${note}</div><h1>${p} von 100 Punkten</h1><p style="color:var(--muted)">${r} von 10 richtig. ${note<=2?'Der Boss liegt am Boden.':note<=4?'Bestanden! Hol dir noch die Inseln mit wenigen Sternen.':'Der Boss war stärker. Spiel die Inseln und komm wieder.'}</p>
    <div class="statrow"><div class="stat"><b>+${R.xp}</b><span>XP</span></div><div class="stat"><b>${S.best}</b><span>beste Serie</span></div></div>
    <div class="btns" style="max-width:420px;margin:0 auto"><button class="btn" data-act="boss">Nochmal gegen den Boss</button><button class="btn light" data-act="karte">Zur Karte</button></div></div>`)}
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
  const b=e.target.closest('button,[data-act="close"]');if(!b)return;
  if(b.dataset.welt)return weltMenu(b.dataset.welt);
  if(b.dataset.play)return spielen(b.dataset.play);
  if(b.dataset.lern)return spick(b.dataset.lern);
  if(b.dataset.o!==undefined&&R&&!R.done){R.sel=+b.dataset.o;document.querySelectorAll('.ans').forEach((x,i)=>x.classList.toggle('sel',i===R.sel));ton([[520,.06]]);return}
  if(b.dataset.p&&R&&!R.done){R.picked.push(decodeURIComponent(b.dataset.p));ton([[520,.06]]);return zeichne()}
  const a=b.dataset.act;
  if(a==='close'&&e.target===b)return layer('');
  if(a==='close'&&b.tagName==='BUTTON')return layer('');
  if(a==='snd'){S.sound=!S.sound;save();return karte()}
  if(a==='boss')return spielen(null,true);
  if(a==='check')return pruefen();
  if(a==='weiter'){layer('');R.i++;return frage()}
  if(a==='ende')return ende();
  if(a==='karte'||a==='quit'){R=null;return karte()}
});
karte();
