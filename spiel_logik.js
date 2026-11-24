/* ===================== Crashkurs IHK ===================== */
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
const LEKTION=6, HERZEN=3, BOSS_N=8;
const AUFG=AUF.filter(a=>W[a.welt]);
const PRUEF=[...new Set(AUFG.map(a=>a.pruefung))];
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const SPICK={recht:LERN.recht,arbeit:LERN.zahl,markt:LERN.el,kon:LERN.kon,ezb:LERN.ezb,
 sozial:`<div class="card" style="--c:var(--w6)"><h3>Fünf Säulen der Sozialversicherung</h3><p><b>Kranken-, Pflege-, Renten-, Arbeitslosen- und Unfallversicherung.</b> Die ersten vier zahlen Arbeitnehmer und Arbeitgeber grob je zur Hälfte. Die <b>Unfallversicherung</b> (Berufsgenossenschaft) zahlt <b>nur der Arbeitgeber</b>.</p></div>
<div class="card" style="--c:var(--w6)"><h3>Zwei Grenzen nicht verwechseln</h3><p><b>Beitragsbemessungsgrenze:</b> bis zu diesem Gehalt wird Beitrag berechnet, darüber nicht mehr.</p><p><b>Versicherungspflichtgrenze:</b> wer mehr verdient, darf in die private Krankenversicherung.</p></div>
<div class="card" style="--c:var(--w6)"><h3>Steuern vom Lohn</h3><p>Der Arbeitgeber behält <b>Lohnsteuer</b>, eventuell <b>Solidaritätszuschlag</b> und <b>Kirchensteuer</b> ein und führt sie ans Finanzamt ab. Was übrig bleibt, ist dein <b>Netto</b>.</p></div>
<div class="card" style="--c:var(--w6)"><h3>Ökonomisches Prinzip</h3><p><b>Maximalprinzip:</b> mit festen Mitteln so viel wie möglich erreichen. <b>Minimalprinzip:</b> ein festes Ziel mit so wenig Mitteln wie möglich erreichen.</p></div>`};
const TYPNAME={mc:'Eine Antwort',multi:'Mehrere Antworten',zuordnen:'Zuordnen',reihenfolge:'Reihenfolge',zahl:'Rechnen'};
const SAY={
 ok:['Ehrenmann! Die IHK hasst diesen Trick.','Sauber. Der Prüfer weint leise.','Bankkaufmann-Energie!','Zu einfach für dich, ehrlich.','Sitzt wie ein Tilgungsplan.','Boom. Nächste!','Die EZB ist stolz auf dich.','Läuft bei dir, Digga.'],
 bad:['Bruder. Ernsthaft?','Nope. Lies nochmal, Digga.','Die IHK lacht dich gerade aus.','Autsch. Merk dir das jetzt!','Falsch, aber schön geklickt.','Mittelfinger. Aus Liebe.','Hätte, hätte, Lieferkette.'],
 combo:['Du brennst!','Nicht aufhören!','Wer stoppt dich noch?'],
 start:['Los gehts, Kollege!','Bock? Ich hab Bock.','Heute machen wir die IHK platt.','Eine Runde geht immer.'],
 tot:['Game over, Kollege. Nochmal!','Herzen leer. Mittelfinger von mir, dann nochmal.'],
 win:['Fehlerfrei! Ich bin sprachlos.','Krank. Einfach krank.','So schreibt man Prüfungen!'],
 mid:['Geht klar. Da geht noch mehr.','Solide. Nächste Lektion!','Passt. Weiter im Text.']
};

/* ---------- Lektionen: je Welt nach Thema sortiert, je 6 Aufgaben ---------- */
const LEK={},UNITS={};
ORDER.forEach(k=>{
  const p=AUFG.filter(a=>a.welt===k).sort((a,b)=>String(a.thema).localeCompare(String(b.thema),'de')||a.id.localeCompare(b.id));
  const ch=[];for(let i=0;i<p.length;i+=LEKTION)ch.push(p.slice(i,i+LEKTION));
  if(ch.length>1&&ch[ch.length-1].length<3)ch[ch.length-2].push(...ch.pop());
  UNITS[k]=ch.map((list,i)=>{const c={};list.forEach(a=>c[a.thema]=(c[a.thema]||0)+1);
    const l={id:k+'-'+(i+1),k,nr:i+1,list,titel:Object.entries(c).sort((a,b)=>b[1]-a[1])[0][0]};LEK[l.id]=l;return l});
});
const ANZ_LEK=Object.keys(LEK).length;

/* ---------- Speicher (nur Komfort) ---------- */
const KEY='crashkurs-v1';
let S={xp:0,best:0,serie:0,done:{},boss:{},exam:{},seen:{},sound:true};
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s)S=Object.assign(S,s)}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const level=()=>Math.floor(S.xp/100)+1;
const sterneGesamt=()=>Object.values(S.done).reduce((a,b)=>a+b,0);

/* ---------- Sound: alles live erzeugt ---------- */
let AC=null,MG=null,NB=null;
function ac(){if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();MG=AC.createGain();MG.gain.value=.55;const c=AC.createDynamicsCompressor();MG.connect(c).connect(AC.destination)}if(AC.state==='suspended')AC.resume();return AC}
function osc(type,f0,f1,t0,dur,vol,filt){const a=ac(),o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f0,t0);if(f1)o.frequency.exponentialRampToValueAtTime(f1,t0+dur);
  g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(vol||.3,t0+.012);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);let n=o;
  if(filt){const f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=filt;o.connect(f);n=f}n.connect(g).connect(MG);o.start(t0);o.stop(t0+dur+.05);return o}
function noise(t0,dur,vol,type,f0,f1,q){const a=ac();if(!NB){NB=a.createBuffer(1,a.sampleRate*2,a.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
  const s=a.createBufferSource();s.buffer=NB;const f=a.createBiquadFilter();f.type=type||'lowpass';f.Q.value=q||1;f.frequency.setValueAtTime(f0,t0);if(f1)f.frequency.exponentialRampToValueAtTime(f1,t0+dur);
  const g=a.createGain();g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);s.connect(f).connect(g).connect(MG);s.start(t0);s.stop(t0+dur+.05)}
const SFX={
 tap(){const t=ac().currentTime;osc('sine',700,280,t,.08,.25)},
 pick(){const t=ac().currentTime;osc('triangle',500,900,t,.1,.2)},
 drop(){const t=ac().currentTime;osc('sine',320,120,t,.13,.3);noise(t,.06,.15,'lowpass',2000)},
 ok(){const t=ac().currentTime;osc('square',988,0,t,.09,.12,4000);osc('square',1319,0,t+.08,.38,.12,5000);osc('sine',2637,0,t+.1,.3,.05)},
 bad(){const t=ac().currentTime;[392,370,349].forEach((f,i)=>osc('sawtooth',f,f*.98,t+i*.28,.26,.18,1400));const o=osc('sawtooth',330,300,t+.84,.9,.2,1200);
   const l=AC.createOscillator(),lg=AC.createGain();l.frequency.value=7;lg.gain.value=9;l.connect(lg).connect(o.frequency);l.start(t+.84);l.stop(t+1.8)},
 combo(){const t=ac().currentTime;for(let i=0;i<3;i++)[466,470,233].forEach(f=>osc('sawtooth',f,0,t+i*.16,i<2?.12:.5,.12,3000))},
 win(){const t=ac().currentTime;[523,659,784,1047,784,1047].forEach((f,i)=>{osc('square',f,0,t+i*.12,i>3?.45:.14,.12,3500);osc('triangle',f/2,0,t+i*.12,.2,.12)})},
 crash(){const t=ac().currentTime;noise(t,.9,.9,'lowpass',6000,200);osc('sine',90,35,t,.6,.8);noise(t+.05,.4,.4,'highpass',3000,8000)},
 whoosh(){const t=ac().currentTime;noise(t,.4,.35,'bandpass',300,3000,2)},
 finger(){const t=ac().currentTime;noise(t,.12,.6,'bandpass',800,3000,6);noise(t+.13,.18,.6,'bandpass',3000,500,6);osc('square',180,90,t+.3,.15,.15,900)},
 lvl(){const t=ac().currentTime;[392,523,659,784,1047,1319].forEach((f,i)=>osc('triangle',f,0,t+i*.07,.25,.15))},
 boing(){const t=ac().currentTime;osc('sine',180,520,t,.25,.3);osc('sine',520,200,t+.22,.25,.25)},
 heart(){const t=ac().currentTime;osc('square',220,110,t,.25,.15,800)}
};
function sfx(n,d){if(!S.sound)return;const go=()=>{try{SFX[n]()}catch(e){}};d?setTimeout(go,d):go()}

/* ---------- Effekte ---------- */
const cv=document.getElementById('fx'),cx=cv.getContext('2d');let parts=[],raf=null;
const RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function konfetti(n=90,x,y){if(RM)return;cv.width=innerWidth*devicePixelRatio;cv.height=innerHeight*devicePixelRatio;
  const cols=['#FF5A5F','#3B82F6','#10B981','#A855F7','#FF9F1C','#FFC531','#22D3EE'];x=x??innerWidth/2;y=y??innerHeight*.55;
  for(let i=0;i<n;i++)parts.push({x:x+(Math.random()-.5)*160,y,vx:(Math.random()-.5)*16,vy:-Math.random()*18-6,r:Math.random()*6+4,c:cols[i%cols.length],a:Math.random()*6,va:(Math.random()-.5)*.4,life:100});
  if(!raf)loop()}
function loop(){cx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);cx.clearRect(0,0,innerWidth,innerHeight);
  parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.55;p.vx*=.98;p.a+=p.va;p.life--;cx.save();cx.translate(p.x,p.y);cx.rotate(p.a);cx.fillStyle=p.c;cx.globalAlpha=Math.max(0,Math.min(1,p.life/30));cx.fillRect(-p.r,-p.r/2,p.r*2,p.r);cx.restore()});
  parts=parts.filter(p=>p.life>0&&p.y<innerHeight+40);raf=parts.length?requestAnimationFrame(loop):(cx.clearRect(0,0,innerWidth,innerHeight),null)}
function flash(c){const f=$('#flash');f.className='';void f.offsetWidth;f.className=c}
function quake(){if(RM)return;const a=$('#app');a.classList.remove('quake');void a.offsetWidth;a.classList.add('quake')}
function emojis(list,n,x,y,spread){if(RM)return;spread=spread||260;for(let i=0;i<n;i++){const e=document.createElement('span');e.className='emo';e.textContent=list[i%list.length];
  const ang=Math.random()*Math.PI*2,d=spread*(.4+Math.random()*.8);
  e.style.cssText=`--x0:${x}px;--y0:${y}px;--dx:${Math.cos(ang)*d}px;--dy:${Math.sin(ang)*d-120}px;--r:${(Math.random()-.5)*720}deg;--s:${26+Math.random()*26}px;--t:${1+Math.random()*.7}s`;
  document.body.appendChild(e);setTimeout(()=>e.remove(),1900)}}
let slamT=null;function slam(txt){const s=$('#slam');s.innerHTML=`<b>${txt}</b>`;clearTimeout(slamT);slamT=setTimeout(()=>s.innerHTML='',1150)}
function mitte(el){if(!el)return[innerWidth/2,innerHeight/2];const r=el.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]}
function xpFly(n,el){if(RM)return;const[x,y]=mitte(el),t=$('.xpb');const[tx,ty]=t?mitte(t):[innerWidth-60,30];const f=document.createElement('div');f.className='xpfly';f.textContent='+'+n;
  f.style.cssText=`left:${x-30}px;top:${y-20}px;--dx:${tx-x}px;--dy:${ty-y}px`;document.body.appendChild(f);setTimeout(()=>f.remove(),1200)}
function hochzaehlen(el,bis){if(!el)return;const t0=performance.now();const st=()=>{const p=Math.min(1,(performance.now()-t0)/900);el.textContent='+'+Math.round(bis*p);if(p<1)requestAnimationFrame(st)};st()}

/* ---------- Figuren ---------- */
function crashi(m){
  const brow={happy:'M33 44 Q45 36 55 43 M65 43 Q75 36 87 44',angry:'M33 40 L55 50 M65 50 L87 40',shock:'M34 34 Q45 26 55 33 M65 33 Q75 26 86 34',smug:'M33 46 L55 44 M65 40 Q76 34 87 41'}[m];
  const mouth={happy:'<path d="M42 82 Q60 104 78 82 Z" fill="#1E1B4B"/><path d="M50 92 Q60 99 70 92 Q60 88 50 92Z" fill="#FF5A7A"/>',
    angry:'<path d="M44 92 Q60 80 76 92" stroke="#1E1B4B" stroke-width="5" fill="none" stroke-linecap="round"/>',
    shock:'<ellipse cx="60" cy="91" rx="9" ry="11" fill="#1E1B4B"/>',
    smug:'<path d="M46 88 Q62 94 76 82" stroke="#1E1B4B" stroke-width="5" fill="none" stroke-linecap="round"/>',
    cool:'<path d="M44 84 Q60 98 76 84" stroke="#1E1B4B" stroke-width="5" fill="none" stroke-linecap="round"/>'}[m];
  const px=m==='smug'?3:0,sh=m==='shock';
  const eyes=m==='cool'?'<path d="M26 54 H94 V60 Q94 76 79 76 H73 Q64 76 62 63 H58 Q56 76 47 76 H41 Q26 76 26 60Z" fill="#1E1B4B"/><path d="M33 59 L45 59" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".75"/>'
    :`<ellipse cx="45" cy="62" rx="11" ry="${sh?15:13}" fill="#fff" stroke="#1E1B4B" stroke-width="3"/><ellipse cx="75" cy="62" rx="11" ry="${sh?15:13}" fill="#fff" stroke="#1E1B4B" stroke-width="3"/><g class="pup"><circle cx="${46+px}" cy="${sh?60:64}" r="${sh?4:6}" fill="#1E1B4B"/><circle cx="${76+px}" cy="${sh?60:64}" r="${sh?4:6}" fill="#1E1B4B"/></g>`;
  const mark=x=>`<circle cx="${x}" cy="40" r="10" fill="#fff" stroke="#1E1B4B" stroke-width="2.5"/><path d="M${x} 40 V30 A10 10 0 0 1 ${x+10} 40Z M${x} 40 V50 A10 10 0 0 1 ${x-10} 40Z" fill="#1E1B4B"/>`;
  return `<svg viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="114" rx="34" ry="5" fill="rgba(30,27,75,.18)"/>
  <circle cx="60" cy="62" r="46" fill="#FFD23F" stroke="#1E1B4B" stroke-width="4"/><path d="M60 16 V28" stroke="#1E1B4B" stroke-width="3"/>${mark(30)}${mark(90)}
  ${m==='happy'?'<circle cx="32" cy="80" r="6" fill="#FF8FA3" opacity=".75"/><circle cx="88" cy="80" r="6" fill="#FF8FA3" opacity=".75"/>':''}
  ${eyes}${brow?`<path d="${brow}" stroke="#1E1B4B" stroke-width="5" fill="none" stroke-linecap="round"/>`:''}${mouth}
  <path d="M28 46 Q34 26 52 19" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".55"/></svg>`}
function maskot(m,hand,delay){return `<div class="mask">${crashi(m||'happy')}${hand?`<span class="hand ${hand==='🖕'?'wig':''}" ${delay?`style="animation-delay:${delay}s,${delay+.9}s"`:''}>${hand}</span>`:''}</div>`}
function pruefer(m){
  const brow=m==='laugh'?'M37 44 Q46 38 55 44 M65 44 Q74 38 83 44':'M37 42 L55 48 M65 48 L83 42';
  const eye=m==='ko'?'<path d="M43 53 L51 61 M51 53 L43 61 M69 53 L77 61 M77 53 L69 61" stroke="#1E1B4B" stroke-width="3" stroke-linecap="round"/>':m==='laugh'?'<path d="M42 58 Q47 53 52 58 M68 58 Q73 53 78 58" stroke="#1E1B4B" stroke-width="3" fill="none" stroke-linecap="round"/>':'<circle cx="47" cy="57" r="3.5" fill="#1E1B4B"/><circle cx="73" cy="57" r="3.5" fill="#1E1B4B"/>';
  const mund=m==='laugh'?'<path d="M49 80 Q60 96 71 80Z" fill="#1E1B4B"/>':m==='ko'?'<path d="M50 86 Q55 82 60 86 Q65 90 70 86" stroke="#1E1B4B" stroke-width="3" fill="none"/>':'<path d="M51 86 Q60 81 69 86" stroke="#1E1B4B" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
  return `<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M26 120 Q28 92 60 90 Q92 92 94 120Z" fill="#334155"/><path d="M53 92 L60 116 L67 92Z" fill="#E11D48"/>
  <circle cx="60" cy="56" r="34" fill="#F4C9A0" stroke="#1E1B4B" stroke-width="4"/>
  <path d="M27 52 Q28 18 60 20 Q92 18 93 52 Q86 34 60 34 Q34 34 27 52Z" fill="#94A3B8" stroke="#1E1B4B" stroke-width="3"/>
  <path d="${brow}" stroke="#475569" stroke-width="5" fill="none" stroke-linecap="round"/>${eye}
  <circle cx="47" cy="57" r="10" fill="rgba(255,255,255,.35)" stroke="#1E1B4B" stroke-width="3.5"/><circle cx="73" cy="57" r="10" fill="rgba(255,255,255,.35)" stroke="#1E1B4B" stroke-width="3.5"/><path d="M57 57 H63" stroke="#1E1B4B" stroke-width="3.5"/>
  <path d="M41 75 Q50 67 60 73 Q70 67 79 75 Q70 81 60 77 Q50 81 41 75Z" fill="#64748B" stroke="#1E1B4B" stroke-width="2.5"/>${mund}
  ${m==='ko'?'<text x="88" y="28" font-size="18">💫</text>':''}</svg>`}

/* ---------- Bausteine ---------- */
const app=h=>{$('#app').innerHTML=h;window.scrollTo({top:0})};
const layer=h=>{$('#layer').innerHTML=h};
function topbar(){const x=S.xp%100;return `<div class="top"><div class="lvl"><div class="ring" aria-label="Level">${level()}</div><div class="xpbar" aria-label="XP bis zum nächsten Level"><i style="width:${x}%"></i></div></div>
 <span class="badge" title="Serie">🔥 ${S.serie}</span><span class="badge" title="Sterne">⭐ ${sterneGesamt()}/${ANZ_LEK*3}</span><span class="badge xpb" title="XP">⚡ ${S.xp}</span>
 <button class="snd" data-act="snd" aria-label="Ton an oder aus">${S.sound?'🔊':'🔇'}</button></div>`}
const sterne=n=>`<div class="stars">${[0,1,2].map(i=>i<n?'<b>★</b>':'★').join('')}</div>`;
const pool=k=>AUFG.filter(a=>a.welt===k);
const noteVon=p=>p>=92?1:p>=81?2:p>=67?3:p>=50?4:p>=30?5:6;

/* ---------- Startbildschirm ---------- */
function splash(){const d=document.createElement('div');d.id='splash';
  d.innerHTML=`${maskot('cool','🖕',1.1)}<h1>${'Crashkurs'.split('').map((c,i)=>`<span style="animation-delay:${.85+i*.05}s">${c}</span>`).join('')}<br><em>IHK Prüfung</em></h1><p>${AUFG.length} echte Aufgaben. Null Gnade.</p><button class="btn" data-act="los">Bock drauf ▶</button>`;
  document.body.appendChild(d)}
function los(){const d=$('#splash');ac();sfx('crash');sfx('finger',450);flash('white');emojis(['💥','🖕','🔥','💸','⭐'],26,innerWidth/2,innerHeight/2,340);
  if(d){d.style.transition='opacity .35s,transform .35s';d.style.opacity='0';d.style.transform='scale(1.15)';setTimeout(()=>d.remove(),360)}karte();setTimeout(quake,60)}

/* ---------- Pfad ---------- */
const OFFS=[0,52,84,52,0,-52,-84,-52];
function aktuell(){for(const k of ORDER){for(const l of UNITS[k])if(!S.done[l.id])return l.id;if(!S.boss[k])return 'boss-'+k}return 'final'}
function karte(){
  layer('');R=null;const cur=aktuell();let n=0;
  let h=`${topbar()}<div class="hero"><h1>Crashkurs IHK</h1><div class="claim">${AUFG.length} echte Aufgaben · null Gnade</div></div>`;
  ORDER.forEach((k,u)=>{const w=W[k],ls=UNITS[k],fertig=ls.filter(l=>S.done[l.id]).length;
    h+=`<div class="unit" style="--c:${w.c};--cd:${w.cd}"><div class="uic">${w.ic}</div><div class="ut"><div class="uk">Abschnitt ${u+1}</div><div class="un">${w.name}</div><div class="us">${w.sub}</div><div class="ubar"><i style="width:${Math.round(fertig/ls.length*100)}%"></i></div></div><button class="btn light ub" data-lern="${k}" aria-label="Spickzettel ${w.name}">📖</button></div><div class="path" style="--c:${w.c};--cd:${w.cd}">`;
    [...ls,null].forEach((l,j)=>{const x=OFFS[j%8],d=((n++)%12)*.05,side=x>0?'l':'r';
      if(l){const st=S.done[l.id]||0,isCur=l.id===cur;
        h+=`<div class="pnode" style="--x:${x}px;--d:${d}s"${isCur?' id="cur"':''}>${isCur?'<div class="ring2"></div><div class="startb">START</div>':''}<button class="pbtn ${st?'done':isCur?'cur':'open'}" data-lesson="${l.id}" aria-label="Lektion ${l.nr}: ${esc(l.titel)}">${st?'✓':'★'}</button><div class="plbl">${esc(l.titel)}</div>${st?`<div class="pst">${[0,1,2].map(i=>i<st?'<b>★</b>':'★').join('')}</div>`:''}${isCur?`<div class="buddy ${side}">${maskot('happy')}</div>`:''}</div>`}
      else{const isCur=cur==='boss-'+k,weg=S.boss[k];
        h+=`<div class="pnode boss" style="--x:${x}px;--d:${d}s"${isCur?' id="cur"':''}>${isCur?'<div class="startb">BOSS</div>':''}<button class="pbtn" data-unitboss="${k}" aria-label="Prüfer-Boss ${w.name}">${pruefer(weg?'ko':'grumpy')}</button><div class="plbl">Prüfer-Boss${weg?' ✓':''}</div>${isCur?`<div class="buddy ${side}">${maskot('angry','🖕',.6)}</div>`:''}</div>`}});
    h+='</div>'});
  h+=`<div class="path"><div class="pnode final" style="--x:0px;--d:.2s"${cur==='final'?' id="cur"':''}><button class="pbtn" data-act="boss" aria-label="Echte IHK-Prüfung">👑</button><div class="plbl">Echte IHK-Prüfung<br>28 Aufgaben, Note am Ende</div></div></div>`;
  app(h);const c=$('#cur');if(c)setTimeout(()=>c.scrollIntoView({block:'center',behavior:RM?'auto':'smooth'}),400);
}
function lektionMenu(id){const l=LEK[id],w=W[l.k];sfx('pick');
  layer(`<div class="dim" data-act="close"><div class="sheet" style="--c:${w.c};--cd:${w.cd}"><span class="tag">${w.ic} ${w.name} · Lektion ${l.nr}</span><h2>${esc(l.titel)}</h2>
  <div class="say">${maskot('smug')}<div class="bubble">${pick(SAY.start)}</div></div>
  <p style="color:var(--muted);margin:0">${l.list.length} echte Aufgaben · ${HERZEN} Herzen${S.done[id]?' · bisher '+'★'.repeat(S.done[id]):''}</p>
  <div class="btns"><button class="btn" data-play="${id}">▶ Los gehts</button><button class="btn light" data-lern="${l.k}">📖 Spickzettel</button><button class="btn light" data-act="close">Zurück</button></div></div></div>`)}
function bossMenu(k){const w=W[k];sfx('boing');
  layer(`<div class="dim" data-act="close"><div class="sheet" style="--c:#3B2F86;--cd:#1A1540"><span class="tag">👔 Prüfer-Boss · ${w.name}</span><h2>Der Prüfer wartet.</h2>
  <div class="say"><div class="mask pfr" style="width:92px">${pruefer('grumpy')}</div><div class="bubble">${BOSS_N} Fragen aus ${w.name}. ${HERZEN} Fehler und du fliegst.</div></div>
  <div class="btns"><button class="btn" data-bossplay="${k}">⚔️ Kampf starten</button><button class="btn light" data-act="close">Lieber noch üben</button></div></div></div>`)}
function spick(k){const w=W[k];sfx('pick');
  layer(`<div class="dim" data-act="close"><div class="sheet lern" style="--c:${w.c};--cd:${w.cd}"><span class="tag">${w.ic} Spickzettel</span><h2>${w.sub}</h2>${SPICK[k]}
  <div class="btns"><button class="btn light" data-act="close">Schließen</button></div></div></div>`)}
function examMenu(){sfx('boing');
  layer(`<div class="dim" data-act="close"><div class="sheet" style="--c:#5B3BD6;--cd:#1A1540"><span class="tag">👑 Echte IHK-Prüfung</span><h2>Welche Prüfung?</h2>
  <div class="say"><div class="mask pfr" style="width:92px">${pruefer('grumpy')}</div><div class="bubble">Alle Aufgaben am Stück, ohne Herzen. Am Ende gibts die Note.</div></div>
  <div class="btns">${PRUEF.map(p=>{const n=AUFG.filter(a=>a.pruefung===p).length;return `<button class="btn light exam" data-exam="${esc(p)}"><span>${esc(p)}</span><small>${n} Aufgaben${S.exam[p]?` · beste Note ${S.exam[p]}`:''}</small></button>`}).join('')}
  <button class="btn" data-exam="*">🎲 Gemischte Prüfung (28 zufällige)</button><button class="btn light" data-act="close">Zurück</button></div></div></div>`)}

/* ---------- Runde ---------- */
let R=null;
function neueZuerst(list){const p=shuffle(list.slice());p.sort((a,b)=>(S.seen[a.id]?1:0)-(S.seen[b.id]?1:0));return p}
function starte(o){layer('');R=Object.assign({i:0,richtig:0,combo:0,xp:0,res:[],herz:HERZEN},o);R.n=R.list.length;R.lv0=level();sfx('whoosh');frage()}
function pruefung(p){let list=[];
  if(p==='*'){const per={recht:6,arbeit:7,sozial:2,markt:4,kon:5,ezb:4};ORDER.forEach(k=>list.push(...shuffle(pool(k)).slice(0,per[k])))}
  else list=AUFG.filter(a=>a.pruefung===p).sort((a,b)=>a.nr-b.nr);
  starte({exam:p,k:null,list,herz:Infinity})}
function frage(){
  const q=R.list[R.i];R.q=q;R.done=false;R.sel=null;
  if(q.typ==='multi')R.sel=[];
  if(q.typ==='zuordnen'){R.zu=q.aussagen.map(()=>null);R.chip=null}
  if(q.typ==='reihenfolge'){const n=q.schritte.length;let o;do{o=shuffle([...Array(n).keys()])}while(n>1&&o.every((v,i)=>v===i));R.ord=o}
  zeichne();
}
function herzHTML(){return [0,1,2].map(i=>i<R.herz?'♥':'<span class="off">♥</span>').join('')}
function sortHTML(q){return R.ord.map((ix,pos)=>`<div class="sitem" data-ix="${ix}"><span class="grip" aria-hidden="true">☰</span><span class="n">${pos+1}</span><span class="t">${esc(q.schritte[ix])}</span><span class="mv"><button data-up="${pos}" aria-label="nach oben">▲</button><button data-down="${pos}" aria-label="nach unten">▼</button></span></div>`).join('')}
function zeichne(){
  const q=R.q,w=W[q.welt],p=Math.round(R.i/R.n*100);
  const kopf=R.exam?`<span class="badge">👑 ${R.i+1}/${R.n}</span>`:`<span class="hearts" aria-label="${R.herz} Herzen">${herzHTML()}</span>`;
  let body='',hint='';
  if(q.typ==='mc'||q.typ==='multi'){if(q.typ==='multi')hint=`Wähle ${q.richtig.length} Antworten.`;
    body=`<div class="answers">${q.optionen.map((o,i)=>`<button class="ans" data-o="${i}"><span class="n">${i+1}</span><span>${esc(o)}</span></button>`).join('')}</div>`}
  if(q.typ==='zuordnen'){hint='Zieh eine Nummer auf den passenden Fall. Oder tipp erst die Nummer, dann den Fall.';
    body=`<div class="chips">${q.kategorien.map((c,i)=>`<button class="chip" data-k="${i}"><span class="n">${i+1}</span><span>${esc(c)}</span></button>`).join('')}</div>
    <div class="rows">${q.aussagen.map((a,j)=>`<button class="row" data-row="${j}"><span class="slot">?</span><span class="t">${esc(a.t)}</span></button>`).join('')}</div>`}
  if(q.typ==='reihenfolge'){hint='Zieh die Karten in die richtige Reihenfolge. Oben steht der erste Schritt.';body=`<div class="sortlist" id="sl">${sortHTML(q)}</div>`}
  if(q.typ==='zahl')body=`<div class="numrow"><input id="numIn" inputmode="decimal" autocomplete="off" placeholder="?" aria-label="Ergebnis"><span class="u">${esc(q.einheit||'')}</span></div>`;
  app(`<div style="--c:${w.c};--cd:${w.cd}"><div class="bar"><button class="x" data-act="quit" aria-label="Runde beenden">✕</button><div class="prog"><i style="width:${p}%"></i></div>${R.combo>=3?`<span class="combo">🔥 x${R.combo>=5?3:2}</span>`:''}${kopf}</div>
  <div class="qcard" id="qc"><div class="tags"><span class="tag">${w.ic} ${esc(q.thema||w.name)}</span><span class="tag src">${esc(q.pruefung)} · Aufgabe ${q.nr}</span><span class="tag typ">${TYPNAME[q.typ]}</span>${R.unitboss?'<span class="tag" style="background:#1A1540">👔 Prüfer-Boss</span>':''}</div>
  ${q.situation?`<div class="sit">${esc(q.situation)}</div>`:''}<div class="qtext">${esc(q.frage)}</div>${hint?`<div class="lbl">${hint}</div>`:''}${body}</div>
  <div class="check"><button class="btn" id="chk" data-act="check">Prüfen</button></div><div class="space" id="sp" hidden></div></div>`);
  if(q.typ==='zahl'){const i=$('#numIn');i.addEventListener('keydown',e=>{if(e.key==='Enter')pruefen()})}
}
function zuMalen(){document.querySelectorAll('.row').forEach((r,j)=>{const v=R.zu[j];r.querySelector('.slot').textContent=v===null?'?':v+1;r.classList.toggle('filled',v!==null)});
  document.querySelectorAll('.chip').forEach((c,i)=>c.classList.toggle('sel',R.chip===i))}
function setzeZu(j,k){if(R.done)return;R.zu[j]=k;R.chip=null;sfx('drop');zuMalen();const r=document.querySelectorAll('.row')[j];r.classList.remove('pop');void r.offsetWidth;r.classList.add('pop')}
function sortNeu(){const sl=$('#sl');if(sl)sl.innerHTML=sortHTML(R.q)}

/* ---------- Ziehen (Finger und Maus) ---------- */
let D=null,justDragged=false;
document.addEventListener('pointerdown',e=>{
  if(!R||R.done)return;const chip=e.target.closest('.chip'),it=e.target.closest('.sitem');
  if(it&&e.target.closest('.mv'))return;
  if(chip)D={typ:'chip',el:chip,k:+chip.dataset.k,x0:e.clientX,y0:e.clientY,on:false,id:e.pointerId};
  else if(it)D={typ:'sort',el:it,x0:e.clientX,y0:e.clientY,on:false,id:e.pointerId};
});
document.addEventListener('pointermove',e=>{
  if(!D||e.pointerId!==D.id)return;
  if(!D.on){if(Math.hypot(e.clientX-D.x0,e.clientY-D.y0)<8)return;D.on=true;sfx('pick');
    if(D.typ==='chip'){const g=D.el.cloneNode(true);g.classList.add('ghost');document.body.appendChild(g);D.g=g;const r=D.el.getBoundingClientRect();D.dx=e.clientX-r.left;D.dy=e.clientY-r.top;g.style.width=r.width+'px'}
    else D.el.classList.add('drag')}
  e.preventDefault();
  if(D.typ==='chip'){D.g.style.left=(e.clientX-D.dx)+'px';D.g.style.top=(e.clientY-D.dy)+'px';
    document.querySelectorAll('.row').forEach(r=>{const b=r.getBoundingClientRect();r.classList.toggle('hover',e.clientX>=b.left&&e.clientX<=b.right&&e.clientY>=b.top&&e.clientY<=b.bottom)})}
  else{const el=D.el;let dy=e.clientY-D.y0;const prev=el.previousElementSibling,next=el.nextElementSibling;
    if(next&&dy>next.offsetHeight/2+6){el.parentNode.insertBefore(next,el);D.y0+=next.offsetHeight+12;dy=e.clientY-D.y0;sfx('tap')}
    else if(prev&&dy<-(prev.offsetHeight/2+6)){el.parentNode.insertBefore(el,prev);D.y0-=prev.offsetHeight+12;dy=e.clientY-D.y0;sfx('tap')}
    el.style.transform=`translateY(${dy}px) scale(1.03)`}
},{passive:false});
function dragEnde(e){
  if(!D||e.pointerId!==D.id)return;const d=D;D=null;if(!d.on)return;justDragged=true;setTimeout(()=>justDragged=false,60);
  if(d.typ==='chip'){d.g.remove();let ziel=null;document.querySelectorAll('.row').forEach((r,j)=>{r.classList.remove('hover');const b=r.getBoundingClientRect();if(e.clientX>=b.left&&e.clientX<=b.right&&e.clientY>=b.top&&e.clientY<=b.bottom)ziel=j});
    if(ziel!==null)setzeZu(ziel,d.k)}
  else{d.el.classList.remove('drag');d.el.style.transform='';R.ord=[...document.querySelectorAll('#sl .sitem')].map(x=>+x.dataset.ix);sfx('drop');sortNeu()}
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
  const chk=$('#chk'),[cx0,cy0]=mitte(chk);let plus=0,line,mood,hand='';
  if(ok){R.richtig++;R.combo++;S.serie++;S.best=Math.max(S.best,S.serie);const m=R.combo>=5?3:R.combo>=3?2:1;plus=10*m;R.xp+=plus;S.xp+=plus;
    sfx('ok');flash('ok');konfetti(R.combo>=3?150:80,cx0,cy0);emojis(['✨','💸','⭐','🤑'],10,cx0,cy0-40,200);xpFly(plus,chk);
    if(R.combo===3||R.combo===5||(R.combo>5&&R.combo%5===0)){setTimeout(()=>{slam(`COMBO x${m}`);sfx('combo');emojis(['🔥'],22,innerWidth/2,innerHeight/2,360)},250);line=pick(SAY.combo);mood='cool';hand='🤘'}
    else{line=pick(SAY.ok);mood='happy';hand=pick(['👍','🤙','💪','👌'])}}
  else{R.combo=0;S.serie=0;sfx('bad');flash('bad');quake();line=pick(SAY.bad);mood=pick(['angry','shock','smug']);hand=Math.random()<.65?'🖕':'🤦';
    if(hand==='🖕')sfx('finger',650);
    if(!R.exam){R.herz--;const h=$('.hearts');if(h){h.innerHTML=herzHTML();h.classList.remove('lost');void h.offsetWidth;h.classList.add('lost')}sfx('heart',150);emojis(['💔'],5,...mitte($('.hearts')),90)}
    const qc=$('#qc');qc.classList.remove('shake');void qc.offsetWidth;qc.classList.add('shake')}
  save();
  const ende=R.i+1>=R.n||R.herz<=0;
  chk.hidden=true;$('#sp').hidden=false;
  layer(`<div class="fb ${ok?'ok':'bad'}" role="status"><div class="in"><div class="fbhead">${maskot(mood,hand,.15)}<h3>${esc(line)}</h3>${ok?`<span class="xp">+${plus} XP</span>`:(R.exam?'':`<span class="xp" style="background:#fff;box-shadow:none">−1 ♥</span>`)}</div>${info}<div class="why">💡 ${esc(q.erklaerung)}</div>
  <div class="btns"><button class="btn" style="--c:${ok?'var(--ok)':'var(--bad)'};--cd:${ok?'var(--ok-d)':'var(--bad-d)'}" data-act="${ende?'ende':'weiter'}">${ende?'Ergebnis':'Weiter'}</button></div></div></div>`);
}
function wackel(){sfx('boing');const b=$('#chk');b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake')}

/* ---------- Ende ---------- */
function stats(){return `<div class="statrow"><div class="stat"><b class="cnt">+0</b><span>XP</span></div><div class="stat"><b>${level()}</b><span>Level</span></div><div class="stat"><b>${S.best}</b><span>beste Serie</span></div></div>`}
function nachEnde(){hochzaehlen($('.cnt'),R.xp);if(level()>R.lv0)setTimeout(()=>{slam('LEVEL UP');sfx('lvl');emojis(['⬆️','⚡','🎉'],18,innerWidth/2,innerHeight/2,320)},900)}
function ende(){
  layer('');const n=R.res.length,r=R.richtig;
  if(R.exam){const p=Math.round(r/R.n*100),note=noteVon(p),gut=note<=4;if(R.exam!=='*'&&(!S.exam[R.exam]||note<S.exam[R.exam]))S.exam[R.exam]=note;save();
    if(gut){sfx('win');sfx('finger',1300);konfetti(220);emojis(['🎉','🖕','🏆','💸'],26,innerWidth/2,innerHeight/2,380)}else sfx('bad');
    const falsch=R.list.filter((q,i)=>!R.res[i]);
    app(`${topbar()}<div class="end"><div class="lbl">${R.exam==='*'?'Gemischte Prüfung':esc(R.exam)}</div>
    <div class="duo"><div>${gut?maskot('cool','🖕',1):maskot('shock','🤦')}</div><div class="mask pfr">${pruefer(gut?'ko':'laugh')}</div></div>
    <div class="note">${note}</div><h1>${p} von 100 Punkten</h1><div class="bubble">${gut?'Bestanden! Tschüss, Prüfer.':'Der Prüfer lacht. Noch. Spiel die Lektionen und komm wieder.'}</div><p style="color:var(--muted)">${r} von ${R.n} richtig</p>${stats()}
    ${falsch.length?`<div class="fehler"><h3>Daneben (${falsch.length})</h3>${falsch.map(q=>`<div class="fz" style="--c:${W[q.welt].c}"><b>Aufgabe ${q.nr} · ${esc(q.thema)}</b><span>${esc(q.erklaerung)}</span></div>`).join('')}</div>`:''}
    <div class="btns" style="max-width:420px;margin:0 auto"><button class="btn" data-act="boss">Andere Prüfung</button><button class="btn light" data-act="karte">Zum Pfad</button></div></div>`);return nachEnde()}
  const tot=R.herz<=0&&n<R.n;
  if(R.unitboss){const k=R.unitboss,w=W[k],sieg=!tot;if(sieg){S.boss[k]=1;save();setTimeout(()=>{slam('BOSS BESIEGT');sfx('win');sfx('finger',900)},300);konfetti(220);emojis(['💥','🖕','🏆'],24,innerWidth/2,innerHeight/2,380)}else sfx('bad');
    app(`${topbar()}<div class="end" style="--c:${w.c};--cd:${w.cd}"><div class="duo"><div>${sieg?maskot('cool','🖕',1):maskot('shock','😵')}</div><div class="mask pfr">${pruefer(sieg?'ko':'laugh')}</div></div>
    <h1>${sieg?'Prüfer zerlegt!':'Der Prüfer gewinnt.'}</h1><div class="bubble">${sieg?`${w.name} gehört dir. Ab zum nächsten Abschnitt!`:'Herzen weg. Üb die Lektionen und hol dir Revanche.'}</div><p style="color:var(--muted)">${r} von ${n} richtig</p>${stats()}
    <div class="btns" style="max-width:420px;margin:0 auto"><button class="btn" data-act="karte">${sieg?'Weiter':'Zum Pfad'}</button>${sieg?'':`<button class="btn light" data-bossplay="${k}">Revanche</button>`}</div></div>`);return nachEnde()}
  const f=n-r,st=tot?0:f===0?3:f<=1?2:1,l=LEK[R.lesson],w=W[l.k];
  if(st>(S.done[l.id]||0))S.done[l.id]=st;save();
  if(st>=2){sfx('win');konfetti(200);emojis(['⭐','🎉','🔥'],18,innerWidth/2,innerHeight*.3,300)}else if(st===0){sfx('bad');sfx('finger',700)}else sfx('lvl');
  const line=tot?pick(SAY.tot):st===3?pick(SAY.win):pick(SAY.mid);
  app(`${topbar()}<div class="end" style="--c:${w.c};--cd:${w.cd}"><div class="big3">${[0,1,2].map(i=>i<st?'<b>★</b>':'★').join('')}</div>
  ${maskot(tot?'angry':st===3?'cool':'happy',tot?'🖕':st===3?'🤘':'👍',.5)}<div class="bubble">${esc(line)}</div>
  <h1>${tot?'Keine Herzen mehr':st===3?'Fehlerfrei!':st===2?'Starke Runde!':'Geschafft'}</h1><p style="color:var(--muted)">${esc(l.titel)}: ${r} von ${n} richtig</p>${stats()}
  <div class="btns" style="max-width:420px;margin:0 auto"><button class="btn" data-act="karte">${tot?'Zum Pfad':'Weiter'}</button><button class="btn light" data-play="${l.id}">Nochmal</button>${tot?`<button class="btn light" data-lern="${l.k}">📖 Spickzettel</button>`:''}</div></div>`);
  nachEnde();
}

/* ---------- Klicks ---------- */
document.addEventListener('click',e=>{
  if(justDragged)return;
  const b=e.target.closest('button,[data-act="close"]');if(!b)return;
  if(b.dataset.lesson)return lektionMenu(b.dataset.lesson);
  if(b.dataset.unitboss)return bossMenu(b.dataset.unitboss);
  if(b.dataset.play){const l=LEK[b.dataset.play];return starte({lesson:l.id,k:l.k,list:shuffle(l.list.slice())})}
  if(b.dataset.bossplay){const k=b.dataset.bossplay;return starte({unitboss:k,k,list:neueZuerst(pool(k)).slice(0,BOSS_N)})}
  if(b.dataset.lern)return spick(b.dataset.lern);
  if(b.dataset.exam)return pruefung(b.dataset.exam);
  if(R&&!R.done){
    if(b.dataset.o!==undefined){const i=+b.dataset.o;sfx('tap');
      if(R.q.typ==='multi')R.sel=R.sel.includes(i)?R.sel.filter(x=>x!==i):[...R.sel,i];else R.sel=i;
      document.querySelectorAll('.ans').forEach((x,j)=>x.classList.toggle('sel',R.q.typ==='multi'?R.sel.includes(j):j===R.sel));return}
    if(b.dataset.k!==undefined){const k=+b.dataset.k;R.chip=R.chip===k?null:k;sfx('pick');return zuMalen()}
    if(b.dataset.row!==undefined){const j=+b.dataset.row;if(R.chip!==null)return setzeZu(j,R.chip);if(R.zu[j]!==null){R.zu[j]=null;sfx('tap');return zuMalen()}sfx('boing');b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');return}
    if(b.dataset.up!==undefined||b.dataset.down!==undefined){const p=+(b.dataset.up??b.dataset.down),t=b.dataset.up!==undefined?p-1:p+1;if(t<0||t>=R.ord.length)return;[R.ord[p],R.ord[t]]=[R.ord[t],R.ord[p]];sfx('tap');return sortNeu()}
  }
  const a=b.dataset.act;
  if(a==='los')return los();
  if(a==='close'&&(e.target===b||b.tagName==='BUTTON')){sfx('tap');return layer('')}
  if(a==='snd'){S.sound=!S.sound;save();if(S.sound)sfx('pick');return karte()}
  if(a==='boss')return examMenu();
  if(a==='check')return pruefen();
  if(a==='weiter'){layer('');R.i++;sfx('whoosh');return frage()}
  if(a==='ende')return ende();
  if(a==='karte'||a==='quit'){R=null;sfx('whoosh');return karte()}
});
karte();splash();
