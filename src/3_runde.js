/* ===================== Crashkurs IHK · Runden ===================== */
let R=null,TIMER=null;
const pool=k=>AUFG.filter(a=>a.welt===k);
const MODI={
 lesson:{name:'Lektion',herz:true},boss:{name:'Prüfer-Boss',herz:true},exam:{name:'Echte Prüfung'},sim:{name:'Prüfungssimulation',still:true,zeit:3600},
 blitz:{name:'Blitzrunde',zeit:60,blitz:true},surv:{name:'Survival',herz:true,endlos:true},daily:{name:'Tages-Challenge',herz:true},
 fehler:{name:'Fehlertraining',herz:true},wdh:{name:'Wiederholen'},thema:{name:'Themen-Training',herz:true},typ:{name:'Aufgabentyp-Training',herz:true},
 fav:{name:'Favoriten'},zufall:{name:'Zufallsmix',herz:true},einzel:{name:'Einzelaufgabe'},schwach:{name:'Schwächen-Training',herz:true}
};
function neueZuerst(list){const p=shuffle(list.slice());p.sort((a,b)=>(S.seen[a.id]?1:0)-(S.seen[b.id]?1:0));return p}
function examMix(){const per={recht:6,arbeit:7,sozial:2,markt:4,kon:5,ezb:4},l=[];ORDER.forEach(k=>l.push(...shuffle(pool(k)).slice(0,per[k])));return l}
function starte(o){
  layer('');stopTimer();const M=MODI[o.mode]||{};
  R=Object.assign({i:0,richtig:0,combo:0,xp:0,knete:0,res:[],herz:M.herz?HERZEN:Infinity,t0:Date.now(),neueErfolge:[]},o);
  if(M.herz&&S.inv.herz>0&&['lesson','boss','surv'].includes(o.mode)){S.inv.herz--;R.herz++;R.extraHerz=true;save()}
  if(!R.list||!R.list.length){toast('Hier gibt es gerade keine Aufgaben','🤷');return zeigeTab(TAB)}
  R.n=M.endlos?Infinity:R.list.length;R.lv0=level();R.zeit=M.zeit||0;R.ende=R.zeit?Date.now()+R.zeit*1000:0;
  tabbar(false);sfx('whoosh');haptic();frage();
  if(R.zeit)TIMER=setInterval(timerTick,250);
}
function stopTimer(){if(TIMER){clearInterval(TIMER);TIMER=null}}
function timerTick(){if(!R||!R.ende)return stopTimer();const rest=Math.max(0,Math.ceil((R.ende-Date.now())/1000));const el=$('#tm');
  if(el){el.textContent=`⏱ ${Math.floor(rest/60)}:${pad(rest%60)}`;el.classList.toggle('knapp',rest<=10)}
  if(R.mode==='blitz'&&rest<=5&&rest>0&&rest!==R.lastTick){R.lastTick=rest;sfx('tick')}
  if(rest<=0){stopTimer();layer('');ende()}}
function frage(){
  if(MODI[R.mode]&&MODI[R.mode].endlos&&R.i>=R.list.length)R.list.push(...shuffle(AUFG.slice()));
  const q=R.list[R.i];R.q=q;R.done=false;R.sel=null;R.qt0=Date.now();R.joker=false;
  if(q.typ==='multi')R.sel=[];
  if(q.typ==='zuordnen'){R.zu=q.aussagen.map(()=>null);R.chip=null}
  if(q.typ==='reihenfolge'){const n=q.schritte.length;let o;do{o=shuffle([...Array(n).keys()])}while(n>1&&o.every((v,i)=>v===i));R.ord=o}
  zeichne();
}
function herzHTML(){const n=R.herz;return n>3?`♥ ${n}`:[0,1,2].map(i=>i<n?'♥':'<span class="off">♥</span>').join('')}
function sortHTML(q){return R.ord.map((ix,pos)=>`<div class="sitem" data-ix="${ix}"><span class="grip" aria-hidden="true">☰</span><span class="n">${pos+1}</span><span class="t">${esc(q.schritte[ix])}</span><span class="mv"><button data-up="${pos}" aria-label="nach oben">▲</button><button data-down="${pos}" aria-label="nach unten">▼</button></span></div>`).join('')}
function loesungText(q){if(q.typ==='mc'||q.typ==='multi')return q.richtig.map(i=>q.optionen[i]).join(' · ');
  if(q.typ==='zuordnen')return q.aussagen.map(a=>`${a.t} → ${q.kategorien[a.k]}`).join(' · ');
  if(q.typ==='reihenfolge')return q.schritte.map((s,i)=>`${i+1}. ${s}`).join(' · ');return `${String(q.loesung).replace('.',',')} ${q.einheit||''}`}
function zeichne(){
  const q=R.q,w=W[q.welt],M=MODI[R.mode]||{};const p=M.endlos?Math.min(100,R.richtig*5):Math.round(R.i/R.n*100);
  let kopf='';
  if(R.zeit)kopf=`<span class="badge tm" id="tm">⏱ ${Math.floor(R.zeit/60)}:00</span>`;
  if(M.blitz)kopf+=`<span class="badge">⚡ ${R.richtig}</span>`;
  else if(R.herz!==Infinity)kopf+=`<span class="hearts" aria-label="${R.herz} Herzen">${herzHTML()}</span>`;
  else if(!M.endlos)kopf+=`<span class="badge">${R.i+1}/${R.n}</span>`;
  if(M.endlos)kopf=`<span class="badge">🧟 ${R.richtig}</span>`+kopf;
  let body='',hint='';
  if(q.typ==='mc'||q.typ==='multi'){if(q.typ==='multi')hint=`Wähle ${q.richtig.length} Antworten.`;
    body=`<div class="answers">${q.optionen.map((o,i)=>`<button class="ans" data-o="${i}"><span class="n">${i+1}</span><span>${esc(o)}</span></button>`).join('')}</div>`}
  if(q.typ==='zuordnen'){hint='Zieh eine Nummer auf den passenden Fall. Oder tipp erst die Nummer, dann den Fall.';
    body=`<div class="chips">${q.kategorien.map((c,i)=>`<button class="chip" data-k="${i}"><span class="n">${i+1}</span><span>${esc(c)}</span></button>`).join('')}</div>
    <div class="rows">${q.aussagen.map((a,j)=>`<button class="row" data-row="${j}"><span class="slot">?</span><span class="t">${esc(a.t)}</span></button>`).join('')}</div>`}
  if(q.typ==='reihenfolge'){hint='Zieh die Karten in die richtige Reihenfolge. Oben steht der erste Schritt.';body=`<div class="sortlist" id="sl">${sortHTML(q)}</div>`}
  if(q.typ==='zahl')body=`<div class="numrow"><input id="numIn" inputmode="decimal" enterkeyhint="done" autocomplete="off" placeholder="?" aria-label="Ergebnis"><span class="u">${esc(q.einheit||'')}</span></div>`;
  const tools=`<div class="qtools"><button class="qt" data-act="vorlesen" aria-label="Vorlesen">🔊</button><button class="qt ${S.fav[q.id]?'on':''}" data-act="fav" aria-label="Merken">${S.fav[q.id]?'★':'☆'}</button>${q.typ==='mc'&&q.optionen.length>=4&&!M.still?`<button class="qt" data-act="joker" aria-label="50:50-Joker">🃏<small>${S.inv.joker}</small></button>`:''}${!M.still&&!M.blitz?`<button class="qt" data-act="tipp" aria-label="Tipp für 5 Knete">💡<small>5</small></button>`:''}</div>`;
  app(`<div class="runde" style="--c:${w.c};--cd:${w.cd}"><div class="bar"><button class="x" data-act="quit" aria-label="Runde beenden">✕</button><div class="prog"><i style="width:${p}%"></i></div>${R.combo>=3?`<span class="combo">🔥 x${R.combo>=5?3:2}</span>`:''}${kopf}</div>
  <div class="qcard" id="qc"><div class="tags"><span class="tag">${w.ic} ${esc(q.thema||w.name)}</span><span class="tag src">${esc(q.pruefung)} · Aufgabe ${q.nr}</span><span class="tag typ">${TYPNAME[q.typ]}</span>${R.mode!=='lesson'?`<span class="tag modus">${MODI[R.mode].name}</span>`:''}${boostAktiv()?'<span class="tag boost">⚡ 2× XP</span>':''}</div>
  ${tools}${q.situation?`<div class="sit">${esc(q.situation)}</div>`:''}<div class="qtext">${esc(q.frage)}</div><div id="tipp"></div>${hint?`<div class="lbl">${hint}</div>`:''}${body}</div>
  <div class="check"><button class="btn" id="chk" data-act="check">Prüfen</button></div><div class="space" id="sp" hidden></div></div>`);
  if(q.typ==='zahl'){const i=$('#numIn');i.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();pruefen()}})}
  timerTick();
}
function zuMalen(){document.querySelectorAll('.row').forEach((r,j)=>{const v=R.zu[j];r.querySelector('.slot').textContent=v===null?'?':v+1;r.classList.toggle('filled',v!==null)});
  document.querySelectorAll('.chip').forEach((c,i)=>c.classList.toggle('sel',R.chip===i))}
function setzeZu(j,k){if(R.done)return;R.zu[j]=k;R.chip=null;sfx('drop');haptic();zuMalen();const r=document.querySelectorAll('.row')[j];r.classList.remove('pop');void r.offsetWidth;r.classList.add('pop')}
function sortNeu(){const sl=$('#sl');if(sl)sl.innerHTML=sortHTML(R.q)}
function joker(){const q=R.q;if(R.done||R.joker||q.typ!=='mc')return;if(S.inv.joker<1){sfx('boing');return toast('Kein Joker mehr. Hol dir welche im Shop!','🃏')}
  S.inv.joker--;R.joker=true;save();const r=q.richtig[0];const weg=shuffle(q.optionen.map((_,i)=>i).filter(i=>i!==r)).slice(0,2);
  document.querySelectorAll('.ans').forEach((b,i)=>{if(weg.includes(i)){b.disabled=true;b.classList.add('weg');if(R.sel===i)R.sel=null}});sfx('kasse');haptic();const t=$('[data-act=joker] small');if(t)t.textContent=S.inv.joker}
function tipp(){const q=R.q;if(R.done||$('#tipp').innerHTML)return;if(S.knete<5){sfx('boing');return toast('Du brauchst 5 Knete für einen Tipp','💸')}
  S.knete-=5;save();const e=String(q.erklaerung).split(/(?<=[.!?])\s/)[0];$('#tipp').innerHTML=`<div class="tippbox">💡 ${esc(e)}</div>`;sfx('kasse');haptic()}

/* ---------- Ziehen (Finger und Maus) ---------- */
let D=null,justDragged=false;
document.addEventListener('pointerdown',e=>{
  if(!R||R.done||R.karten)return;const chip=e.target.closest('.chip'),it=e.target.closest('.sitem');
  if(it&&e.target.closest('.mv'))return;
  if(chip)D={typ:'chip',el:chip,k:+chip.dataset.k,x0:e.clientX,y0:e.clientY,on:false,id:e.pointerId};
  else if(it)D={typ:'sort',el:it,x0:e.clientX,y0:e.clientY,on:false,id:e.pointerId};
});
document.addEventListener('pointermove',e=>{
  if(!D||e.pointerId!==D.id)return;
  if(!D.on){if(Math.hypot(e.clientX-D.x0,e.clientY-D.y0)<8)return;D.on=true;sfx('pick');haptic();
    if(D.typ==='chip'){const g=D.el.cloneNode(true);g.classList.add('ghost');document.body.appendChild(g);D.g=g;const r=D.el.getBoundingClientRect();D.dx=e.clientX-r.left;D.dy=e.clientY-r.top;g.style.width=r.width+'px'}
    else D.el.classList.add('drag')}
  e.preventDefault();
  if(D.typ==='chip'){D.g.style.left=(e.clientX-D.dx)+'px';D.g.style.top=(e.clientY-D.dy)+'px';
    document.querySelectorAll('.row').forEach(r=>{const b=r.getBoundingClientRect();r.classList.toggle('hover',e.clientX>=b.left&&e.clientX<=b.right&&e.clientY>=b.top&&e.clientY<=b.bottom)})}
  else{const el=D.el;let dy=e.clientY-D.y0;const prev=el.previousElementSibling,next=el.nextElementSibling;
    if(next&&dy>next.offsetHeight/2+6){el.parentNode.insertBefore(next,el);D.y0+=next.offsetHeight+12;dy=e.clientY-D.y0;sfx('tap');haptic()}
    else if(prev&&dy<-(prev.offsetHeight/2+6)){el.parentNode.insertBefore(el,prev);D.y0-=prev.offsetHeight+12;dy=e.clientY-D.y0;sfx('tap');haptic()}
    el.style.transform=`translateY(${dy}px) scale(1.03)`}
},{passive:false});
function dragEnde(e){
  if(!D||e.pointerId!==D.id)return;const d=D;D=null;if(!d.on)return;justDragged=true;setTimeout(()=>justDragged=false,60);
  if(d.typ==='chip'){d.g.remove();let ziel=null;document.querySelectorAll('.row').forEach((r,j)=>{r.classList.remove('hover');const b=r.getBoundingClientRect();if(e.clientX>=b.left&&e.clientX<=b.right&&e.clientY>=b.top&&e.clientY<=b.bottom)ziel=j});
    if(ziel!==null)setzeZu(ziel,d.k)}
  else{d.el.classList.remove('drag');d.el.style.transform='';R.ord=[...document.querySelectorAll('#sl .sitem')].map(x=>+x.dataset.ix);sfx('drop');sortNeu()}
}
document.addEventListener('pointerup',dragEnde);document.addEventListener('pointercancel',dragEnde);

/* ---------- Antwort verbuchen ---------- */
function verbuche(q,ok,sek){
  const s=st(q.id),warFalsch=s.lastOk===false;s.n++;if(ok)s.ok++;s.last=heute();s.lastOk=ok;s.box=ok?Math.min(6,(s.box||0)+1):1;
  S.seen[q.id]=1;S.hist.push([Date.now(),ok?1:0]);if(S.hist.length>400)S.hist=S.hist.slice(-400);
  const t=tag();t.n++;if(ok)t.ok++;t.sek+=Math.min(sek,300);S.zahl.n++;if(ok)S.zahl.ok++;S.zahl.sek+=Math.min(sek,300);
  if(ok&&warFalsch&&R.mode==='fehler')S.zahl.fix++;if(ok&&sek<10)S.zahl.schnell++;
  const h=new Date().getHours();if(h>=23||h<4)S.flags.eule=true;if(h>=4&&h<7)S.flags.frueh=true;
}
function xpGeben(n){if(boostAktiv())n*=2;S.xp+=n;R.xp+=n;const t=tag();const vor=t.xp;t.xp+=n;
  if(vor<S.ziel&&t.xp>=S.ziel&&!t.ziel){t.ziel=1;setTimeout(()=>{slam('TAGESZIEL!');sfx('erfolg');haptic(2);emojis(['🎯','⭐','🔥'],18,innerWidth/2,innerHeight/2,320)},1300)}return n}

/* ---------- Prüfen ---------- */
function pruefen(){
  const q=R.q;if(R.done)return;let ok=false,info='';const M=MODI[R.mode]||{};
  if(q.typ==='mc'){if(R.sel===null)return wackel();const r=q.richtig[0];ok=R.sel===r;
    document.querySelectorAll('.ans').forEach((b,i)=>{b.disabled=true;if(M.still){if(i===R.sel)b.classList.add('sel')}else if(i===r)b.classList.add('right');else if(i===R.sel)b.classList.add('wrong')});
    if(!ok)info=`<div class="why"><b>Richtig ist ${r+1}:</b> ${esc(q.optionen[r])}</div>`}
  if(q.typ==='multi'){if(!R.sel.length)return wackel();const rs=new Set(q.richtig);ok=R.sel.length===rs.size&&R.sel.every(i=>rs.has(i));
    document.querySelectorAll('.ans').forEach((b,i)=>{b.disabled=true;if(M.still)return;b.classList.remove('sel');if(rs.has(i))b.classList.add('right');else if(R.sel.includes(i))b.classList.add('wrong')});
    if(!ok)info=`<div class="why"><b>Richtig sind:</b><br>${q.richtig.map(i=>`${i+1}. ${esc(q.optionen[i])}`).join('<br>')}</div>`}
  if(q.typ==='zuordnen'){if(R.zu.some(v=>v===null))return wackel();ok=q.aussagen.every((a,j)=>R.zu[j]===a.k);
    if(!M.still)document.querySelectorAll('.row').forEach((r,j)=>{r.disabled=true;const good=R.zu[j]===q.aussagen[j].k;r.classList.add(good?'right':'wrong');if(!good)r.querySelector('.slot').innerHTML=`<s>${R.zu[j]+1}</s>${q.aussagen[j].k+1}`});
    if(!ok)info=`<div class="why"><b>Richtig:</b><br>${q.aussagen.map(a=>`<b>${a.k+1}</b> ${esc(q.kategorien[a.k])} ← ${esc(a.t)}`).join('<br>')}</div>`}
  if(q.typ==='reihenfolge'){ok=R.ord.every((v,i)=>v===i);
    if(!M.still)document.querySelectorAll('#sl .sitem').forEach((x,pos)=>x.classList.add(+x.dataset.ix===pos?'right':'wrong'));
    if(!ok)info=`<div class="why"><b>Richtige Reihenfolge:</b><br>${q.schritte.map((s,i)=>`${i+1}. ${esc(s)}`).join('<br>')}</div>`}
  if(q.typ==='zahl'){const v=parseNum($('#numIn').value);if(isNaN(v))return wackel();ok=Math.abs(v-q.loesung)<=Math.max(+q.toleranz||0,0.005);$('#numIn').disabled=true;$('#numIn').blur();
    if(!ok)info=`<div class="why"><b>Lösung:</b> ${esc(String(q.loesung).replace('.',','))} ${esc(q.einheit||'')}</div>`;
    if(q.rechenweg)info+=`<div class="why"><b>Rechenweg:</b> ${esc(q.rechenweg)}</div>`}
  R.done=true;R.res.push(ok);const sek=Math.round((Date.now()-R.qt0)/1000);verbuche(q,ok,sek);
  const chk=$('#chk'),[cx0,cy0]=mitte(chk);let plus=0,line,mood,hand='',schnell=false;
  if(ok){R.richtig++;R.combo++;S.serie++;S.best=Math.max(S.best,S.serie);const m=R.combo>=5?3:R.combo>=3?2:1;schnell=sek<10&&!M.blitz;
    plus=xpGeben(10*m+(schnell?5:0));R.knete+=2;S.knete+=2}
  else{R.combo=0;S.serie=0}
  save();
  if(M.still){const ich=R.i,rr=R;sfx('tap');haptic();return setTimeout(()=>{if(R!==rr||R.i!==ich)return;if(R.i+1>=R.n)return ende();R.i++;frage()},180)}
  if(M.blitz){sfx(ok?'ok':'heart');haptic(ok?1:2);flash(ok?'ok':'bad');if(ok){emojis(['⚡','✨'],6,cx0,cy0-40,160);xpFly(plus,chk)}else quake();
    const ich=R.i,rr=R;return setTimeout(()=>{if(R!==rr||R.i!==ich||!R.ende||Date.now()>=R.ende)return;R.i++;if(R.i>=R.list.length)R.list.push(...shuffle(R.pool));frage()},ok?380:700)}
  if(ok){sfx('ok');haptic();flash('ok');konfetti(R.combo>=3?150:80,cx0,cy0);emojis(['✨','💸','⭐','🤑'],10,cx0,cy0-40,200);xpFly(plus,chk);
    if(R.combo===3||R.combo===5||(R.combo>5&&R.combo%5===0)){setTimeout(()=>{slam(`COMBO x${R.combo>=5?3:2}`);sfx('combo');haptic(2);emojis(['🔥'],22,innerWidth/2,innerHeight/2,360)},250);line=pick(SAY.combo);mood='cool';hand='🤘'}
    else if(schnell){line=pick(SAY.schnell);mood='cool';hand='⚡';sfx('schnell',200)}
    else{line=pick(SAY.ok);mood='happy';hand=pick(['👍','🤙','💪','👌'])}}
  else{sfx('bad');haptic(2);flash('bad');quake();line=pick(SAY.bad);mood=pick(['angry','shock','smug']);hand=Math.random()<.65?'🖕':'🤦';
    if(hand==='🖕'){S.zahl.finger++;sfx('finger',650)}
    if(R.herz!==Infinity){R.herz--;const h=$('.hearts');if(h){h.innerHTML=herzHTML();h.classList.remove('lost');void h.offsetWidth;h.classList.add('lost')}sfx('heart',150);emojis(['💔'],5,...mitte($('.hearts')),90)}
    const qc=$('#qc');qc.classList.remove('shake');void qc.offsetWidth;qc.classList.add('shake')}
  save();
  const fertig=R.i+1>=R.n||R.herz<=0;
  chk.hidden=true;$('#sp').hidden=false;
  layer(`<div class="fb ${ok?'ok':'bad'}" role="status"><div class="in"><div class="fbhead">${maskot(mood,hand,.15)}<h3>${esc(line)}</h3>${ok?`<span class="xp">+${plus} XP</span>`:(R.herz!==Infinity?`<span class="xp" style="background:#fff;box-shadow:none">−1 ♥</span>`:'')}</div>${info}<div class="why">💡 ${esc(q.erklaerung)}</div>
  <div class="fbtools"><button class="qt" data-act="vorlesen-erkl" aria-label="Erklärung vorlesen">🔊 Vorlesen</button><button class="qt ${S.fav[q.id]?'on':''}" data-act="fav" aria-label="Merken">${S.fav[q.id]?'★ Gemerkt':'☆ Merken'}</button></div>
  <div class="btns"><button class="btn" style="--c:${ok?'var(--ok)':'var(--bad)'};--cd:${ok?'var(--ok-d)':'var(--bad-d)'}" data-act="${fertig?'ende':'weiter'}">${fertig?'Ergebnis':'Weiter'}</button></div></div></div>`);
}
function wackel(){sfx('boing');haptic(2);const b=$('#chk');b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake')}

/* ---------- Ende ---------- */
function statsZeile(){return `<div class="statrow"><div class="stat"><b class="cnt">+0</b><span>XP</span></div><div class="stat"><b class="cntk">+0</b><span>Knete</span></div><div class="stat"><b>${level()}</b><span>Level</span></div></div>`}
function nachEnde(){hochzaehlen($('.cnt'),R.xp);hochzaehlen($('.cntk'),R.knete);
  if(R.res.length&&streakZaehlen()){setTimeout(()=>{toast(`Lernserie: ${S.streak.n} ${S.streak.n===1?'Tag':'Tage'}`,'🔥');sfx('lvl')},1600)}
  if(level()>R.lv0)setTimeout(()=>{slam('LEVEL UP');sfx('lvl');haptic(2);emojis(['⬆️','⚡','🎉'],18,innerWidth/2,innerHeight/2,320)},900);
  const neu=erfolgePruefen();if(neu.length)setTimeout(()=>erfolgToast(neu),2200);save()}
function kisteHTML(){return `<div class="kiste" id="kiste"><button class="kbtn" data-act="kiste" aria-label="Kiste öffnen">🎁</button><div class="lbl">Tipp auf die Kiste!</div></div>`}
function kisteOeffnen(){const k=$('#kiste');if(!k||k.dataset.auf)return;k.dataset.auf=1;sfx('kiste');haptic(2);const r=Math.random();let txt,ic;
  if(r<.6){const n=10+Math.floor(Math.random()*31);S.knete+=n;txt=`+${n} Knete`;ic='💸'}else if(r<.75){S.inv.freeze++;txt='Serien-Schutz';ic='🧊'}else if(r<.9){S.inv.joker++;txt='50:50-Joker';ic='🃏'}else{S.boostBis=Date.now()+15*60000;txt='15 Min doppelte XP';ic='⚡'}
  save();k.innerHTML=`<div class="kauf"><span class="kic">${ic}</span><b>${txt}</b></div>`;const[x,y]=mitte(k);emojis([ic,'✨','🎉'],16,x,y,220);konfetti(120,x,y)}
function ende(){
  stopTimer();layer('');tabbar(false);const n=R.res.length,r=R.richtig,M=MODI[R.mode]||{};
  const falschListe=()=>{const f=R.list.slice(0,n).filter((q,i)=>!R.res[i]);return f.length?`<div class="fehler"><h3>Daneben (${f.length})</h3>${f.map(q=>`<div class="fz" style="--c:${W[q.welt].c}"><b>${esc(q.thema)} · ${esc(q.pruefung)} Nr. ${q.nr}</b><span>${esc(q.erklaerung)}</span><small>Richtig: ${esc(loesungText(q))}</small></div>`).join('')}</div>`:''};
  if(R.mode==='exam'||R.mode==='sim'){const p=Math.round(r/R.list.length*100),note=noteVon(p),gut=note<=4;
    if(R.mode==='exam'&&R.exam!=='*'&&(!S.exam[R.exam]||note<S.exam[R.exam]))S.exam[R.exam]=note;if(gut)S.knete+=30,R.knete+=30;save();
    if(gut){sfx('win');sfx('finger',1300);konfetti(220);emojis(['🎉','🖕','🏆','💸'],26,innerWidth/2,innerHeight/2,380)}else sfx('bad');
    app(`<div class="end"><div class="lbl">${R.mode==='sim'?'Prüfungssimulation':R.exam==='*'?'Gemischte Prüfung':esc(R.exam)}</div>
    <div class="duo"><div>${gut?maskot('cool','🖕',1):maskot('shock','🤦')}</div><div class="mask pfr">${pruefer(gut?'ko':'laugh')}</div></div>
    <div class="note">${note}</div><h1>${p} von 100 Punkten</h1><div class="bubble">${gut?`Bestanden mit „${NOTEN[note]}“! Tschüss, Prüfer.`:'Der Prüfer lacht. Noch. Spiel die Lektionen und komm wieder.'}</div><p class="muted">${r} von ${R.list.length} richtig${n<R.list.length?` · ${R.list.length-n} nicht bearbeitet`:''}</p>${statsZeile()}
    ${falschListe()}<div class="btns endbtns"><button class="btn" data-act="home">Weiter</button></div></div>`);return nachEnde()}
  if(R.mode==='blitz'){const neu=r>S.rek.blitz;if(neu)S.rek.blitz=r;save();if(neu&&r>0){sfx('win');konfetti(200);slam('REKORD!')}else sfx('lvl');
    app(`<div class="end"><div class="big">⚡ ${r}</div>${maskot(neu?'cool':'happy',neu?'🤘':'👍',.4)}<h1>${neu&&r>0?'Neuer Rekord!':'Zeit ist um!'}</h1><div class="bubble">${r} richtige in 60 Sekunden. Rekord: ${S.rek.blitz}</div>${statsZeile()}
    <div class="btns endbtns"><button class="btn" data-modus="blitz">Nochmal</button><button class="btn light" data-act="home">Fertig</button></div></div>`);return nachEnde()}
  if(R.mode==='surv'){const neu=r>S.rek.surv;if(neu)S.rek.surv=r;save();sfx(neu?'win':'bad');if(neu)konfetti(200);
    app(`<div class="end"><div class="big">🧟 ${r}</div>${maskot(neu?'cool':'angry',neu?'🤘':'🖕',.4)}<h1>${neu?'Neuer Rekord!':'Erwischt!'}</h1><div class="bubble">${r} richtige überlebt. Rekord: ${S.rek.surv}</div>${statsZeile()}${falschListe()}
    <div class="btns endbtns"><button class="btn" data-modus="surv">Nochmal</button><button class="btn light" data-act="home">Fertig</button></div></div>`);return nachEnde()}
  const tot=R.herz<=0&&n<R.n;
  if(R.mode==='boss'){const k=R.k,w=W[k],sieg=!tot;if(sieg){S.boss[k]=1;S.knete+=30;R.knete+=30;save();setTimeout(()=>{slam('BOSS BESIEGT');sfx('win');sfx('finger',900);haptic(2)},300);konfetti(220);emojis(['💥','🖕','🏆'],24,innerWidth/2,innerHeight/2,380)}else sfx('bad');
    app(`<div class="end" style="--c:${w.c};--cd:${w.cd}"><div class="duo"><div>${sieg?maskot('cool','🖕',1):maskot('shock','😵')}</div><div class="mask pfr">${pruefer(sieg?'ko':'laugh')}</div></div>
    <h1>${sieg?'Prüfer zerlegt!':'Der Prüfer gewinnt.'}</h1><div class="bubble">${sieg?`${w.name} gehört dir. Ab zum nächsten Abschnitt!`:'Herzen weg. Üb die Lektionen und hol dir Revanche.'}</div><p class="muted">${r} von ${n} richtig</p>${statsZeile()}
    <div class="btns endbtns"><button class="btn" data-act="home">${sieg?'Weiter':'Zum Pfad'}</button>${sieg?'':`<button class="btn light" data-bossplay="${k}">Revanche</button>`}</div></div>`);return nachEnde()}
  const f=n-r,sterne=tot?0:f===0?3:f<=1?2:1;let titel=MODI[R.mode].name,w=W[R.k]||{c:'var(--pri)',cd:'var(--pri-d)'};
  if(R.mode==='lesson'){const l=LEK[R.lesson];titel=l.titel;w=W[l.k];if(sterne>(S.done[l.id]||0))S.done[l.id]=sterne;if(sterne===3){S.knete+=15;R.knete+=15}}
  if(R.mode==='daily'&&!tot&&!S.daily[heute()]){S.daily[heute()]=1;S.knete+=25;R.knete+=25}
  save();
  if(sterne>=2){sfx('win');konfetti(200);emojis(['⭐','🎉','🔥'],18,innerWidth/2,innerHeight*.3,300)}else if(sterne===0){sfx('bad');sfx('finger',700)}else sfx('lvl');
  const line=tot?pick(SAY.tot):sterne===3?pick(SAY.win):pick(SAY.mid);
  app(`<div class="end" style="--c:${w.c};--cd:${w.cd}"><div class="big3">${[0,1,2].map(i=>i<sterne?'<b>★</b>':'★').join('')}</div>
  ${maskot(tot?'angry':sterne===3?'cool':'happy',tot?'🖕':sterne===3?'🤘':'👍',.5)}<div class="bubble">${esc(line)}</div>
  <h1>${tot?'Keine Herzen mehr':sterne===3?'Fehlerfrei!':sterne===2?'Starke Runde!':'Geschafft'}</h1><p class="muted">${esc(titel)}: ${r} von ${n} richtig</p>${statsZeile()}
  ${!tot&&R.mode==='lesson'?kisteHTML():''}${R.mode!=='lesson'?falschListe():''}
  <div class="btns endbtns"><button class="btn" data-act="home">${tot?'Zurück':'Weiter'}</button>${R.mode==='lesson'?`<button class="btn light" data-play="${R.lesson}">Nochmal</button>`:''}${tot&&R.k?`<button class="btn light" data-lern="${R.k}">📖 Spickzettel</button>`:''}</div></div>`);
  nachEnde();
}

/* ---------- Lernkarten ---------- */
function kartenStart(list,titel){stopTimer();R={karten:true,list:list.slice(0,12),i:0,gew:0,titel,xp:0,knete:0,res:[],lv0:level(),mode:'karten'};tabbar(false);sfx('whoosh');karteZeigen()}
function karteZeigen(){const q=R.list[R.i];if(!q)return kartenEnde();const w=W[q.welt];R.auf=false;
  app(`<div class="runde" style="--c:${w.c};--cd:${w.cd}"><div class="bar"><button class="x" data-act="quit" aria-label="Beenden">✕</button><div class="prog"><i style="width:${Math.round(R.i/R.list.length*100)}%"></i></div><span class="badge">🃏 ${R.i+1}/${R.list.length}</span></div>
  <div class="flip" id="flip" data-act="flip"><div class="fin"><div class="fvorn qcard"><span class="tag">${w.ic} ${esc(q.thema)}</span>${q.situation?`<div class="sit">${esc(q.situation)}</div>`:''}<div class="qtext">${esc(q.frage)}</div><div class="lbl fhint">Tipp zum Umdrehen 👆</div></div>
  <div class="fhinten qcard"><span class="tag">✅ Lösung</span><div class="qtext">${esc(loesungText(q))}</div><div class="why">💡 ${esc(q.erklaerung)}</div></div></div></div>
  <div class="kbtns" id="kb" hidden><button class="btn" style="--c:var(--bad);--cd:var(--bad-d)" data-karte="0">✗ Nochmal</button><button class="btn" style="--c:var(--ok);--cd:var(--ok-d)" data-karte="1">✓ Gewusst</button></div>
  <p class="muted center">Wisch nach rechts für „Gewusst“, nach links für „Nochmal“.</p></div>`)}
function karteDrehen(){if(!R||!R.karten)return;R.auf=!R.auf;$('#flip').classList.toggle('auf',R.auf);$('#kb').hidden=false;sfx('whoosh');haptic()}
function karteWerten(ok){const q=R.list[R.i];const s=st(q.id);s.box=ok?Math.min(6,(s.box||0)+1):1;s.last=heute();S.zahl.karten++;R.res.push(ok);if(ok){R.gew++;R.xp+=xpGeben(4)}
  save();sfx(ok?'ok':'heart');haptic();const f=$('#flip');if(f){f.classList.add(ok?'wegr':'wegl')}setTimeout(()=>{R.i++;karteZeigen()},260)}
function kartenEnde(){sfx('win');app(`<div class="end">${maskot('happy','🃏',.3)}<h1>Stapel durch!</h1><div class="bubble">${R.gew} von ${R.list.length} gewusst. Was du nicht wusstest, kommt bald wieder.</div>${statsZeile()}<div class="btns endbtns"><button class="btn" data-act="home">Weiter</button></div></div>`);nachEnde()}
let SW=null;
document.addEventListener('pointerdown',e=>{if(R&&R.karten&&e.target.closest('#flip'))SW={x:e.clientX,y:e.clientY,id:e.pointerId}});
document.addEventListener('pointerup',e=>{if(!SW||e.pointerId!==SW.id)return;const dx=e.clientX-SW.x;SW=null;if(Math.abs(dx)>70&&R&&R.karten){justDragged=true;setTimeout(()=>justDragged=false,60);if(!R.auf)karteDrehen();karteWerten(dx>0)}});
