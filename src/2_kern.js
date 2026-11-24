/* ===================== Crashkurs IHK · Kern ===================== */
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const SPICK={recht:LERN.recht,arbeit:LERN.zahl,markt:LERN.el,kon:LERN.kon,ezb:LERN.ezb,
 sozial:`<div class="card" style="--c:var(--w6)"><h3>Fünf Säulen der Sozialversicherung</h3><p><b>Kranken-, Pflege-, Renten-, Arbeitslosen- und Unfallversicherung.</b> Die ersten vier zahlen Arbeitnehmer und Arbeitgeber grob je zur Hälfte. Die <b>Unfallversicherung</b> (Berufsgenossenschaft) zahlt <b>nur der Arbeitgeber</b>.</p></div>
<div class="card" style="--c:var(--w6)"><h3>Zwei Grenzen nicht verwechseln</h3><p><b>Beitragsbemessungsgrenze:</b> bis zu diesem Gehalt wird Beitrag berechnet, darüber nicht mehr.</p><p><b>Versicherungspflichtgrenze:</b> wer mehr verdient, darf in die private Krankenversicherung.</p></div>
<div class="card" style="--c:var(--w6)"><h3>Steuern vom Lohn</h3><p>Der Arbeitgeber behält <b>Lohnsteuer</b>, eventuell <b>Solidaritätszuschlag</b> und <b>Kirchensteuer</b> ein und führt sie ans Finanzamt ab. Was übrig bleibt, ist dein <b>Netto</b>.</p></div>
<div class="card" style="--c:var(--w6)"><h3>Ökonomisches Prinzip</h3><p><b>Maximalprinzip:</b> mit festen Mitteln so viel wie möglich erreichen. <b>Minimalprinzip:</b> ein festes Ziel mit so wenig Mitteln wie möglich erreichen.</p></div>`};

/* ---------- Datum ---------- */
const pad=n=>String(n).padStart(2,'0');
const heute=(d=new Date())=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const tagPlus=(iso,n)=>{const d=new Date(iso+'T12:00:00');d.setDate(d.getDate()+n);return heute(d)};
const tageZwischen=(a,b)=>Math.round((new Date(b+'T12:00:00')-new Date(a+'T12:00:00'))/864e5);
const wocheStart=(d=new Date())=>{const x=new Date(d);const wd=(x.getDay()+6)%7;x.setDate(x.getDate()-wd);return heute(x)};
const WT=['Mo','Di','Mi','Do','Fr','Sa','So'];
function seedRand(seed){let s=0;for(const c of String(seed))s=(s*31+c.charCodeAt(0))>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function seedShuffle(arr,seed){const r=seedRand(seed),a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

/* ---------- Speicher ---------- */
const KEY='crashkurs-v1';
const S0=()=>({xp:0,best:0,serie:0,done:{},boss:{},exam:{},seen:{},sound:true,
  v:VERSION,name:'',onboard:false,musik:false,haptik:true,fx:true,finger:true,thema:'auto',ziel:50,datum:'2026-11-25',schrift:1,
  knete:0,inv:{freeze:0,boost:0,herz:0,joker:0},boostBis:0,owned:['farbe-gold'],outfit:{hut:null,acc:null,farbe:'farbe-gold'},
  tage:{},streak:{n:0,last:null,max:0},stat:{},hist:[],fav:{},achv:{},daily:{},rek:{blitz:0,surv:0},
  zahl:{n:0,ok:0,fix:0,finger:0,karten:0,schnell:0,sek:0},flags:{},liga:{woche:null,stufe:0,start:0},neu:[]});
let S=S0();
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s){const d=S0();S=Object.assign(d,s);
  ['inv','outfit','streak','rek','zahl','flags','liga'].forEach(k=>S[k]=Object.assign(d[k]||{},s[k]||{}));if(!S.owned.includes('farbe-gold'))S.owned.push('farbe-gold')}}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const level=()=>lvl(S.xp);
const lvlProz=()=>{const l=level(),a=lvlXp(l),b=lvlXp(l+1);return Math.round((S.xp-a)/(b-a)*100)};
const sterneGesamt=()=>Object.values(S.done).reduce((a,b)=>a+b,0);
const tag=()=>{const t=heute();return S.tage[t]||(S.tage[t]={xp:0,n:0,ok:0,sek:0})};
const boostAktiv=()=>Date.now()<S.boostBis;
const fing=e=>(!S.finger&&SAY_JF[e])?SAY_JF[e]:e;

/* ---------- Sound ---------- */
let AC=null,MG=null,NB=null;
function ac(){if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();MG=AC.createGain();MG.gain.value=.55;const c=AC.createDynamicsCompressor();MG.connect(c).connect(AC.destination)}if(AC.state==='suspended')AC.resume();return AC}
function osc(type,f0,f1,t0,dur,vol,filt,dest){const a=ac(),o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f0,t0);if(f1)o.frequency.exponentialRampToValueAtTime(f1,t0+dur);
  g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(vol||.3,t0+.012);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);let n=o;
  if(filt){const f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=filt;o.connect(f);n=f}n.connect(g).connect(dest||MG);o.start(t0);o.stop(t0+dur+.05);return o}
function noise(t0,dur,vol,type,f0,f1,q,dest){const a=ac();if(!NB){NB=a.createBuffer(1,a.sampleRate*2,a.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
  const s=a.createBufferSource();s.buffer=NB;const f=a.createBiquadFilter();f.type=type||'lowpass';f.Q.value=q||1;f.frequency.setValueAtTime(f0,t0);if(f1)f.frequency.exponentialRampToValueAtTime(f1,t0+dur);
  const g=a.createGain();g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);s.connect(f).connect(g).connect(dest||MG);s.start(t0);s.stop(t0+dur+.05)}
const SFX={
 tap(){const t=ac().currentTime;osc('sine',700,280,t,.08,.25)},
 tab(){const t=ac().currentTime;osc('sine',520,760,t,.09,.18)},
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
 heart(){const t=ac().currentTime;osc('square',220,110,t,.25,.15,800)},
 kasse(){const t=ac().currentTime;osc('square',1568,0,t,.06,.1,6000);osc('square',2093,0,t+.07,.3,.1,6000);noise(t+.02,.12,.25,'highpass',4000)},
 tick(){const t=ac().currentTime;osc('square',1800,0,t,.03,.06,6000)},
 kiste(){const t=ac().currentTime;noise(t,.3,.3,'bandpass',400,2500,3);[784,988,1175,1568].forEach((f,i)=>osc('triangle',f,0,t+.25+i*.06,.35,.14))},
 schnell(){const t=ac().currentTime;osc('sawtooth',300,1800,t,.25,.12,4000)},
 erfolg(){const t=ac().currentTime;[659,880,1109,1319].forEach((f,i)=>{osc('triangle',f,0,t+i*.09,.5,.13);osc('sine',f*2,0,t+i*.09,.3,.04)})}
};
function sfx(n,d){if(!S.sound)return;const go=()=>{try{SFX[n]()}catch(e){}};d?setTimeout(go,d):go()}

/* ---------- Musik: Lo-Fi-Schleife, live erzeugt ---------- */
let MUS=null;
function musikStart(){if(MUS||!S.musik)return;try{const a=ac(),g=a.createGain();g.gain.value=.16;g.connect(MG);
  const akk=[[220,261.6,329.6],[174.6,220,261.6],[196,246.9,293.7],[164.8,207.7,246.9]];let schritt=0,next=a.currentTime+.1;const bpm=84,b=60/bpm;
  const tick=()=>{while(next<a.currentTime+.4){const bar=Math.floor(schritt/8),s8=schritt%8,ch=akk[bar%4];
      if(s8===0)ch.forEach(f=>osc('triangle',f,0,next,b*4,.09,1200,g));
      if(s8%4===0)osc('sine',110,40,next,.25,.5,0,g);
      if(s8%4===2)noise(next,.12,.18,'bandpass',1800,0,.8,g);
      noise(next,.04,.06,'highpass',7000,0,1,g);
      if(s8===3||s8===6)osc('sine',ch[s8%3]*2,0,next,b*.9,.05,0,g);
      schritt++;next+=b/2}};
  MUS={g,iv:setInterval(tick,120)};tick()}catch(e){}}
function musikStop(){if(!MUS)return;clearInterval(MUS.iv);try{MUS.g.gain.setTargetAtTime(0,AC.currentTime,.2)}catch(e){}MUS=null}

/* ---------- Haptik (iPhone: Schalter-Trick, sonst Vibration) ---------- */
let HAP=null;
function haptic(n=1){if(!S.haptik)return;try{if(navigator.vibrate){navigator.vibrate(n>1?[18,40,18]:12);return}
  if(!HAP){const l=document.createElement('label');l.setAttribute('aria-hidden','true');l.style.cssText='position:fixed;left:-99px;top:-99px;opacity:0;pointer-events:none';l.innerHTML='<input type="checkbox" switch>';document.body.appendChild(l);HAP=l}
  for(let i=0;i<n;i++)setTimeout(()=>HAP.click(),i*90)}catch(e){}}

/* ---------- Vorlesen ---------- */
function vorlesen(txt){try{const s=window.speechSynthesis;if(!s)return toast('Vorlesen geht auf diesem Gerät nicht');if(s.speaking){s.cancel();return}
  const u=new SpeechSynthesisUtterance(txt);u.lang='de-DE';u.rate=1.02;const v=s.getVoices().find(v=>v.lang&&v.lang.startsWith('de'));if(v)u.voice=v;s.speak(u)}catch(e){}}

/* ---------- Effekte ---------- */
const cv=document.getElementById('fx'),cx=cv.getContext('2d');let parts=[],raf=null;
const RM=()=>!S.fx||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
function konfetti(n=90,x,y){if(RM())return;cv.width=innerWidth*devicePixelRatio;cv.height=innerHeight*devicePixelRatio;
  const cols=['#FF5A5F','#3B82F6','#10B981','#A855F7','#FF9F1C','#FFC531','#22D3EE'];x=x??innerWidth/2;y=y??innerHeight*.55;
  for(let i=0;i<n;i++)parts.push({x:x+(Math.random()-.5)*160,y,vx:(Math.random()-.5)*16,vy:-Math.random()*18-6,r:Math.random()*6+4,c:cols[i%cols.length],a:Math.random()*6,va:(Math.random()-.5)*.4,life:100});
  if(!raf)loop()}
function loop(){cx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);cx.clearRect(0,0,innerWidth,innerHeight);
  parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.55;p.vx*=.98;p.a+=p.va;p.life--;cx.save();cx.translate(p.x,p.y);cx.rotate(p.a);cx.fillStyle=p.c;cx.globalAlpha=Math.max(0,Math.min(1,p.life/30));cx.fillRect(-p.r,-p.r/2,p.r*2,p.r);cx.restore()});
  parts=parts.filter(p=>p.life>0&&p.y<innerHeight+40);raf=parts.length?requestAnimationFrame(loop):(cx.clearRect(0,0,innerWidth,innerHeight),null)}
function flash(c){if(!S.fx)return;const f=$('#flash');f.className='';void f.offsetWidth;f.className=c}
function quake(){if(RM())return;const a=$('#app');a.classList.remove('quake');void a.offsetWidth;a.classList.add('quake')}
function emojis(list,n,x,y,spread){if(RM())return;spread=spread||260;for(let i=0;i<n;i++){const e=document.createElement('span');e.className='emo';e.textContent=fing(list[i%list.length]);
  const ang=Math.random()*Math.PI*2,d=spread*(.4+Math.random()*.8);
  e.style.cssText=`--x0:${x}px;--y0:${y}px;--dx:${Math.cos(ang)*d}px;--dy:${Math.sin(ang)*d-120}px;--r:${(Math.random()-.5)*720}deg;--s:${26+Math.random()*26}px;--t:${1+Math.random()*.7}s`;
  document.body.appendChild(e);setTimeout(()=>e.remove(),1900)}}
let slamT=null;function slam(txt){if(!S.fx)return;const s=$('#slam');s.innerHTML=`<b>${txt}</b>`;clearTimeout(slamT);slamT=setTimeout(()=>s.innerHTML='',1150)}
function mitte(el){if(!el)return[innerWidth/2,innerHeight/2];const r=el.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]}
function xpFly(n,el){if(RM())return;const[x,y]=mitte(el),t=$('.xpb');const[tx,ty]=t?mitte(t):[innerWidth-60,30];const f=document.createElement('div');f.className='xpfly';f.textContent='+'+n;
  f.style.cssText=`left:${x-30}px;top:${y-20}px;--dx:${tx-x}px;--dy:${ty-y}px`;document.body.appendChild(f);setTimeout(()=>f.remove(),1200)}
function hochzaehlen(el,bis,pre='+'){if(!el)return;const t0=performance.now();const st=()=>{const p=Math.min(1,(performance.now()-t0)/900);el.textContent=pre+Math.round(bis*p);if(p<1)requestAnimationFrame(st)};st()}
let toastT=null;function toast(t,ic){const d=$('#toast');d.innerHTML=`${ic?`<span>${ic}</span>`:''}${t}`;d.className='show';clearTimeout(toastT);toastT=setTimeout(()=>d.className='',2600)}

/* ---------- Figuren ---------- */
function crashi(m,farbe){
  const fc=farbe||((SHOP.find(x=>x.id===S.outfit.farbe)||{}).ov)||'#FFD23F';
  const brow={happy:'M33 44 Q45 36 55 43 M65 43 Q75 36 87 44',angry:'M33 40 L55 50 M65 50 L87 40',shock:'M34 34 Q45 26 55 33 M65 33 Q75 26 86 34',smug:'M33 46 L55 44 M65 40 Q76 34 87 41',sleep:'M35 48 Q45 46 55 48 M65 48 Q75 46 85 48'}[m];
  const mouth={happy:'<path d="M42 82 Q60 104 78 82 Z" fill="#1E1B4B"/><path d="M50 92 Q60 99 70 92 Q60 88 50 92Z" fill="#FF5A7A"/>',
    angry:'<path d="M44 92 Q60 80 76 92" stroke="#1E1B4B" stroke-width="5" fill="none" stroke-linecap="round"/>',
    shock:'<ellipse cx="60" cy="91" rx="9" ry="11" fill="#1E1B4B"/>',
    smug:'<path d="M46 88 Q62 94 76 82" stroke="#1E1B4B" stroke-width="5" fill="none" stroke-linecap="round"/>',
    cool:'<path d="M44 84 Q60 98 76 84" stroke="#1E1B4B" stroke-width="5" fill="none" stroke-linecap="round"/>',
    sleep:'<ellipse cx="60" cy="90" rx="6" ry="4" fill="#1E1B4B"/>'}[m];
  const px=m==='smug'?3:0,sh=m==='shock';
  const eyes=m==='cool'?'<path d="M26 54 H94 V60 Q94 76 79 76 H73 Q64 76 62 63 H58 Q56 76 47 76 H41 Q26 76 26 60Z" fill="#1E1B4B"/><path d="M33 59 L45 59" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".75"/>'
    :m==='sleep'?'<path d="M36 64 Q45 70 54 64 M66 64 Q75 70 84 64" stroke="#1E1B4B" stroke-width="4" fill="none" stroke-linecap="round"/><text x="88" y="26" font-size="16" font-weight="900" fill="#1E1B4B">z</text><text x="98" y="16" font-size="12" font-weight="900" fill="#1E1B4B">z</text>'
    :`<ellipse cx="45" cy="62" rx="11" ry="${sh?15:13}" fill="#fff" stroke="#1E1B4B" stroke-width="3"/><ellipse cx="75" cy="62" rx="11" ry="${sh?15:13}" fill="#fff" stroke="#1E1B4B" stroke-width="3"/><g class="pup"><circle cx="${46+px}" cy="${sh?60:64}" r="${sh?4:6}" fill="#1E1B4B"/><circle cx="${76+px}" cy="${sh?60:64}" r="${sh?4:6}" fill="#1E1B4B"/></g>`;
  const mark=x=>`<circle cx="${x}" cy="40" r="10" fill="#fff" stroke="#1E1B4B" stroke-width="2.5"/><path d="M${x} 40 V30 A10 10 0 0 1 ${x+10} 40Z M${x} 40 V50 A10 10 0 0 1 ${x-10} 40Z" fill="#1E1B4B"/>`;
  return `<svg viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="114" rx="34" ry="5" fill="rgba(30,27,75,.18)"/>
  <circle cx="60" cy="62" r="46" fill="${fc}" stroke="#1E1B4B" stroke-width="4"/><path d="M60 16 V28" stroke="#1E1B4B" stroke-width="3"/>${mark(30)}${mark(90)}
  ${m==='happy'?'<circle cx="32" cy="80" r="6" fill="#FF8FA3" opacity=".75"/><circle cx="88" cy="80" r="6" fill="#FF8FA3" opacity=".75"/>':''}
  ${eyes}${brow?`<path d="${brow}" stroke="#1E1B4B" stroke-width="5" fill="none" stroke-linecap="round"/>`:''}${mouth}
  <path d="M28 46 Q34 26 52 19" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".55"/></svg>`}
function outfitHTML(o){o=o||S.outfit;const h=SHOP.find(x=>x.id===o.hut),a=SHOP.find(x=>x.id===o.acc);
  return `${h?`<span class="o-hut">${h.ov}</span>`:''}${a?`<span class="o-acc">${a.ov}</span>`:''}`}
function maskot(m,hand,delay,o){return `<div class="mask" data-act="crashi">${crashi(m||'happy',o&&o.farbe?((SHOP.find(x=>x.id===o.farbe)||{}).ov):null)}${outfitHTML(o)}${hand?`<span class="hand ${hand==='🖕'?'wig':''}" ${delay?`style="animation-delay:${delay}s,${delay+.9}s"`:''}>${fing(hand)}</span>`:''}</div>`}
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
function tageszeitSpruch(){const h=new Date().getHours();return pick(h<5||h>=23?SAY.nacht:h<11?SAY.morgen:h<18?SAY.tag:SAY.abend)}
function moodJetzt(){const h=new Date().getHours();return h<5?'sleep':'happy'}

/* ---------- Thema (hell, dunkel, automatisch) ---------- */
function themaSetzen(){const d=S.thema==='dunkel'||(S.thema==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme=d?'dark':'light';document.documentElement.style.setProperty('--zoom',S.schrift||1);
  const m=document.querySelector('meta[name=theme-color]');if(m)m.content=d?'#14112B':'#DDF0FF'}
try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',themaSetzen)}catch(e){}

/* ---------- Statistik-Helfer ---------- */
const st=id=>S.stat[id]||(S.stat[id]={n:0,ok:0,box:0,last:null,lastOk:null});
const INTERVALL=[0,1,2,4,7,14,30];
const faellig=id=>{const s=S.stat[id];if(!s||!s.n)return false;return tageZwischen(s.last,heute())>=INTERVALL[Math.min(s.box,6)]};
function quote(list){const n=list.length;return n?Math.round(list.filter(Boolean).length/n*100):0}
const noteVon=p=>p>=92?1:p>=81?2:p>=67?3:p>=50?4:p>=30?5:6;
const NOTEN=['','sehr gut','gut','befriedigend','ausreichend','mangelhaft','ungenügend'];
function prognose(){const h=S.hist.slice(-60);if(h.length<10)return null;const p=quote(h.map(x=>x[1]));return{p,note:noteVon(p),n:h.length}}
function weltQuote(k){let n=0,ok=0;AUFG.forEach(a=>{if(a.welt===k&&S.stat[a.id]){n+=S.stat[a.id].n;ok+=S.stat[a.id].ok}});return n?Math.round(ok/n*100):null}
function typQuote(t){let n=0,ok=0;AUFG.forEach(a=>{if(a.typ===t&&S.stat[a.id]){n+=S.stat[a.id].n;ok+=S.stat[a.id].ok}});return n?Math.round(ok/n*100):null}
function themaQuoten(){const m={};AUFG.forEach(a=>{const s=S.stat[a.id];if(!s||!s.n)return;const x=m[a.thema]||(m[a.thema]={n:0,ok:0,welt:a.welt});x.n+=s.n;x.ok+=s.ok});
  return Object.entries(m).map(([t,x])=>({t,q:Math.round(x.ok/x.n*100),n:x.n,welt:x.welt}))}

/* ---------- Serie (Tage) ---------- */
function streakPflegen(){const t=heute(),s=S.streak;if(!s.last)return;const lucke=tageZwischen(s.last,t);
  if(lucke>1){const fehlt=lucke-1;if(S.inv.freeze>=fehlt){S.inv.freeze-=fehlt;s.last=tagPlus(t,-1);toast(`Serien-Schutz eingesetzt (${fehlt}×). Deine Serie lebt!`,'🧊')}else{if(s.n>1)toast(`Deine ${s.n}-Tage-Serie ist gerissen. Neu starten!`,'💔');s.n=0}save()}}
function streakZaehlen(){const t=heute(),s=S.streak;if(s.last===t)return false;s.n=(s.last===tagPlus(t,-1))?s.n+1:1;s.last=t;s.max=Math.max(s.max||0,s.n);return true}

/* ---------- Liga ---------- */
function ligaWoche(){const w=wocheStart();const L=S.liga;if(L.woche!==w){if(L.woche){const r=ligaTabelle(L.woche).findIndex(x=>x.du);if(r>-1&&r<3&&L.stufe<LIGEN.length-1){L.stufe++;L.auf=LIGEN[L.stufe]}else if(r>=12&&L.stufe>0){L.stufe--;L.ab=LIGEN[L.stufe]}if(r===0)S.flags.liga1=true}L.woche=w;save()}return w}
function wochenXp(w){let s=0;for(let i=0;i<7;i++){const d=S.tage[tagPlus(w,i)];if(d)s+=d.xp}return s}
function ligaTabelle(w){w=w||S.liga.woche||wocheStart();const r=seedRand(w+'|'+S.liga.stufe),jetzt=new Date(),wStart=new Date(w+'T00:00:00'),
  fort=Math.min(1,Math.max(0,(jetzt-wStart)/(7*864e5)));const stark=1+S.liga.stufe*.6;
  const bots=BOTS.slice().sort(()=>r()-.5).slice(0,14).map((n,i)=>{const ziel=Math.round((60+r()*520)*stark);return{n,xp:Math.round(ziel*Math.pow(fort,.8+r()*.5)),bot:true}});
  bots.push({n:S.name||'Du',xp:wochenXp(w),du:true});return bots.sort((a,b)=>b.xp-a.xp)}
