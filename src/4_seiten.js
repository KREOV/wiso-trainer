/* ===================== Crashkurs IHK · Seiten ===================== */
let TAB='pfad',SUB=null;
const app=h=>{const a=$('#app');a.innerHTML=h;a.classList.remove('seitein');void a.offsetWidth;a.classList.add('seitein');window.scrollTo({top:0})};
const layer=h=>{$('#layer').innerHTML=h;if(h)sheetGriff()};
const sterne=n=>`<div class="stars">${[0,1,2].map(i=>i<n?'<b>★</b>':'★').join('')}</div>`;
function ring(p,gr,inhalt,farbe){const r=(gr-8)/2,u=2*Math.PI*r,o=u*(1-Math.min(1,p/100));return `<div class="ringw" style="width:${gr}px;height:${gr}px"><svg viewBox="0 0 ${gr} ${gr}"><circle cx="${gr/2}" cy="${gr/2}" r="${r}" fill="none" stroke="var(--line)" stroke-width="8"/><circle cx="${gr/2}" cy="${gr/2}" r="${r}" fill="none" stroke="${farbe||'var(--pri)'}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${u}" stroke-dashoffset="${o}" transform="rotate(-90 ${gr/2} ${gr/2})"/></svg><div class="ringi">${inhalt}</div></div>`}

/* ---------- Leisten ---------- */
function topbar(){return `<div class="top"><button class="lvl" data-tab="profil" aria-label="Level ${level()}"><div class="ring">${level()}</div><div class="xpbar"><i style="width:${lvlProz()}%"></i></div></button>
 <span class="badge" title="Lernserie">🔥 ${S.streak.n}</span><span class="badge" title="Knete">💸 ${S.knete}</span><span class="badge xpb" title="XP">⚡ ${S.xp}</span>
 <button class="snd" data-act="snd" aria-label="Ton an oder aus">${S.sound?'🔊':'🔇'}</button></div>`}
function zaehlerUeben(){return AUFG.filter(a=>S.stat[a.id]&&S.stat[a.id].lastOk===false).length+AUFG.filter(a=>faellig(a.id)).length}
function tabbar(an){const t=$('#tabbar');document.body.classList.toggle('notab',an===false);if(an===false){t.classList.add('weg');return}t.classList.remove('weg');const z=zaehlerUeben();
  t.innerHTML=[['pfad','🗺️','Pfad'],['ueben','🎯','Üben'],['stats','📊','Statistik'],['profil','😎','Profil']].map(([k,ic,n])=>`<button class="tb ${TAB===k?'an':''}" data-tab="${k}" aria-label="${n}"><span class="ti">${ic}${k==='ueben'&&z?`<i class="pill">${z>99?'99+':z}</i>`:''}</span><span>${n}</span></button>`).join('')}
function kopfZurueck(titel,ic){return `<div class="subkopf"><button class="zur" data-act="zurueck" aria-label="Zurück">‹</button><h1>${ic?ic+' ':''}${titel}</h1></div>`}
function zeigeTab(t,ohneTon){TAB=t;SUB=null;R=null;stopTimer();layer('');if(!ohneTon){sfx('tab');haptic()}
  ({pfad:karte,ueben:ueben,stats:statistik,profil:profil})[t]();tabbar(true)}
function sub(f,...a){SUB=f;sfx('whoosh');haptic();f(...a);tabbar(true)}

/* ---------- Pfad ---------- */
const OFFS=[0,52,84,52,0,-52,-84,-52];
function aktuell(){for(const k of ORDER){for(const l of UNITS[k])if(!S.done[l.id])return l.id;if(!S.boss[k])return 'boss-'+k}return 'final'}
function countdown(){const d=tageZwischen(heute(),S.datum);return d>1?`⏳ Noch ${d} Tage bis zur Prüfung`:d===1?'⏳ Morgen ist Prüfung!':d===0?'🔥 Heute ist Prüfung. Du rockst das!':'✅ Prüfung geschafft? Weiter fit bleiben!'}
function karte(){
  const cur=aktuell(),t=tag(),zp=Math.round(t.xp/S.ziel*100),sc=Math.min(1,innerWidth/430);let n=0;
  let h=`${topbar()}<div class="hello"><div class="hm">${maskot(moodJetzt(),null,0)}</div><div><div class="hname">Hey${S.name?' '+esc(S.name):''}!</div><div class="bubble klein">${tageszeitSpruch()}</div></div></div>
  <div class="heute glass2"><div class="hz">${ring(zp,64,`<b>${Math.min(999,zp)}%</b>`,'var(--gold)')}<div><b>Tagesziel</b><span>${t.xp} von ${S.ziel} XP</span></div></div><div class="hc">${countdown()}</div>
  <button class="btn weiter" data-act="weiterlernen">▶ Weiterlernen</button></div>
  ${boostAktiv()?`<div class="chipzeile"><span class="chipi boost">⚡ Doppelte XP noch ${Math.ceil((S.boostBis-Date.now())/60000)} Min</span></div>`:''}
  ${S.liga.auf?`<div class="chipzeile"><span class="chipi">🎉 Aufgestiegen in die ${S.liga.auf}!</span></div>`:''}`;
  ORDER.forEach((k,u)=>{const w=W[k],ls=UNITS[k],fertig=ls.filter(l=>S.done[l.id]).length,q=weltQuote(k);
    h+=`<div class="unit" style="--c:${w.c};--cd:${w.cd}"><div class="uic">${w.ic}</div><div class="ut"><div class="uk">Abschnitt ${u+1}${q!==null?` · ${q} % richtig`:''}</div><div class="un">${w.name}</div><div class="us">${w.sub}</div><div class="ubar"><i style="width:${Math.round(fertig/ls.length*100)}%"></i></div></div><button class="btn light ub" data-lern="${k}" aria-label="Spickzettel ${w.name}">📖</button></div><div class="path" style="--c:${w.c};--cd:${w.cd}">`;
    [...ls,null].forEach((l,j)=>{const x=Math.round(OFFS[j%8]*sc),d=((n++)%12)*.05,side=x>0?'l':'r';
      if(l){const s=S.done[l.id]||0,isCur=l.id===cur;
        h+=`<div class="pnode" style="--x:${x}px;--d:${d}s"${isCur?' id="cur"':''}>${isCur?'<div class="ring2"></div><div class="startb">START</div>':''}<button class="pbtn ${s?'done':isCur?'cur':'open'}" data-lesson="${l.id}" aria-label="Lektion ${l.nr}: ${esc(l.titel)}">${s?(s===3?'👑':'✓'):'★'}</button><div class="plbl">${esc(l.titel)}</div>${s?`<div class="pst">${[0,1,2].map(i=>i<s?'<b>★</b>':'★').join('')}</div>`:''}${isCur?`<div class="buddy ${side}">${maskot('happy')}</div>`:''}</div>`}
      else{const isCur=cur==='boss-'+k,weg=S.boss[k];
        h+=`<div class="pnode boss" style="--x:${x}px;--d:${d}s"${isCur?' id="cur"':''}>${isCur?'<div class="startb">BOSS</div>':''}<button class="pbtn" data-unitboss="${k}" aria-label="Prüfer-Boss ${w.name}">${pruefer(weg?'ko':'grumpy')}</button><div class="plbl">Prüfer-Boss${weg?' ✓':''}</div>${isCur?`<div class="buddy ${side}">${maskot('angry','🖕',.6)}</div>`:''}</div>`}});
    h+='</div>'});
  h+=`<div class="path"><div class="pnode final" style="--x:0px;--d:.2s"${cur==='final'?' id="cur"':''}><button class="pbtn" data-act="examliste" aria-label="Echte IHK-Prüfung">👑</button><div class="plbl">Echte IHK-Prüfung<br>28 Aufgaben, Note am Ende</div></div></div><div class="fuss">Crashkurs IHK ${VERSION} · ${AUFG.length} echte Aufgaben aus ${PRUEF.length} Prüfungen</div>`;
  app(h);const c=$('#cur');if(c&&!karte.einmal){karte.einmal=1;setTimeout(()=>c.scrollIntoView({block:'center',behavior:RM()?'auto':'smooth'}),450)}
}
function weiterlernen(){const c=aktuell();if(c==='final')return examListe();if(c.startsWith('boss-'))return bossMenu(c.slice(5));lektionMenu(c)}
function lektionMenu(id){const l=LEK[id],w=W[l.k];sfx('pick');haptic();
  layer(`<div class="dim" data-act="close"><div class="sheet" style="--c:${w.c};--cd:${w.cd}"><span class="tag">${w.ic} ${w.name} · Lektion ${l.nr} von ${UNITS[l.k].length}</span><h2>${esc(l.titel)}</h2>
  <div class="say">${maskot('smug')}<div class="bubble">${pick(SAY.start)}</div></div>
  <p class="muted">${l.list.length} echte Aufgaben · ${HERZEN} Herzen${S.inv.herz?` · +1 Extra-Herz`:''}${S.done[id]?' · bisher '+'★'.repeat(S.done[id]):''}</p>
  <div class="minitags">${[...new Set(l.list.map(a=>a.pruefung))].map(p=>`<span>${esc(p)}</span>`).join('')}</div>
  <div class="btns"><button class="btn" data-play="${id}">▶ Los gehts</button><button class="btn light" data-karten-lek="${id}">🃏 Als Lernkarten</button><button class="btn light" data-lern="${l.k}">📖 Spickzettel</button></div></div></div>`)}
function bossMenu(k){const w=W[k];sfx('boing');haptic();
  layer(`<div class="dim" data-act="close"><div class="sheet" style="--c:#3B2F86;--cd:#1A1540"><span class="tag">👔 Prüfer-Boss · ${w.name}</span><h2>Der Prüfer wartet.</h2>
  <div class="say"><div class="mask pfr" style="width:92px">${pruefer('grumpy')}</div><div class="bubble">${BOSS_N} Fragen aus ${w.name}. ${HERZEN} Fehler und du fliegst.</div></div>
  <div class="btns"><button class="btn" data-bossplay="${k}">⚔️ Kampf starten</button><button class="btn light" data-act="close">Lieber noch üben</button></div></div></div>`)}
function spick(k){const w=W[k];sfx('pick');
  layer(`<div class="dim" data-act="close"><div class="sheet lern" style="--c:${w.c};--cd:${w.cd}"><span class="tag">${w.ic} Spickzettel</span><h2>${w.sub}</h2>${SPICK[k]}
  <div class="btns"><button class="btn" data-modus="welt" data-welt="${k}">▶ ${w.name} trainieren</button></div></div></div>`)}
function examListe(){sfx('boing');
  layer(`<div class="dim" data-act="close"><div class="sheet" style="--c:#5B3BD6;--cd:#1A1540"><span class="tag">👑 Echte IHK-Prüfungen</span><h2>Welche Prüfung?</h2>
  <div class="say"><div class="mask pfr" style="width:92px">${pruefer('grumpy')}</div><div class="bubble">Alle Aufgaben am Stück, mit Erklärung nach jeder Aufgabe. Note am Ende.</div></div>
  <div class="btns">${PRUEF.map(p=>{const n=AUFG.filter(a=>a.pruefung===p).length;return `<button class="btn light exam" data-exam="${esc(p)}"><span>${esc(p)}</span><small>${n} Aufgaben${S.exam[p]?` · beste Note ${S.exam[p]}`:''}</small></button>`}).join('')}
  <button class="btn" data-exam="*">🎲 Gemischte Prüfung (28 zufällige)</button></div></div></div>`)}

/* ---------- Üben ---------- */
function ueben(){
  const fehler=AUFG.filter(a=>S.stat[a.id]&&S.stat[a.id].lastOk===false),fae=AUFG.filter(a=>faellig(a.id)),fav=AUFG.filter(a=>S.fav[a.id]),dz=!!S.daily[heute()];
  const k=(m,ic,t,s,extra,farbe,dis)=>`<button class="mk ${dis?'aus':''}" data-modus="${m}" style="--c:${farbe}"><span class="mi">${ic}</span><b>${t}</b><small>${s}</small>${extra?`<i class="pill">${extra}</i>`:''}</button>`;
  app(`${topbar()}<div class="seitenkopf"><h1>Üben</h1><p>Such dir aus, wie du heute lernst.</p></div>
  <div class="glass2 daily" data-modus="daily" role="button" tabindex="0"><div class="dl">📆</div><div><b>Tages-Challenge</b><span>${dz?'Heute geschafft! Morgen gibt es neue.':'10 Aufgaben, für alle gleich. +25 Knete'}</span></div><div class="dr">${dz?'✅':'▶'}</div></div>
  <h2 class="gk">Clever wiederholen</h2><div class="mgrid">
  ${k('fehler','🩹','Fehlertraining',fehler.length?`${fehler.length} Fehler warten`:'Keine offenen Fehler',fehler.length,'#F43F5E',!fehler.length)}
  ${k('wdh','🔁','Wiederholen',fae.length?`${fae.length} fällig`:'Nichts fällig',fae.length,'#8B5CF6',!fae.length)}
  ${k('schwach','🎯','Schwächen','Deine 3 schwächsten Themen','','#F59E0B')}
  ${k('karten','🃏','Lernkarten','Umdrehen, wischen, merken','','#0EA5E9')}</div>
  <h2 class="gk">Action</h2><div class="mgrid">
  ${k('blitz','⚡','Blitzrunde',`60 Sekunden · Rekord ${S.rek.blitz}`,'','#EAB308')}
  ${k('surv','🧟','Survival',`Bis 3 Fehler · Rekord ${S.rek.surv}`,'','#22C55E')}
  ${k('zufall','🎲','Zufallsmix','10 Aufgaben quer durch','','#EC4899')}
  ${k('fav','⭐','Favoriten',fav.length?`${fav.length} gemerkt`:'Noch nichts gemerkt',fav.length,'#F97316',!fav.length)}</div>
  <h2 class="gk">Prüfung</h2><div class="mgrid">
  ${k('sim','⏱️','Simulation','28 Aufgaben, 60 Minuten, wie echt','','#6D4AFF')}
  ${k('examliste','👑','Echte Prüfungen',`${PRUEF.length} Prüfungen mit Erklärung`,'','#5B3BD6')}</div>
  <h2 class="gk">Gezielt</h2><div class="mgrid">
  ${k('themen','🏷️','Nach Thema',`${THEMEN.length} Themen`,'','#14B8A6')}
  ${k('typ-zahl','🧮','Nur Rechnen',`${AUFG.filter(a=>a.typ==='zahl').length} Aufgaben`,'','#0891B2')}
  ${k('typ-zuordnen','🔢','Nur Zuordnen',`${AUFG.filter(a=>a.typ==='zuordnen').length} Aufgaben`,'','#7C3AED')}
  ${k('typ-reihenfolge','↕️','Nur Reihenfolge',`${AUFG.filter(a=>a.typ==='reihenfolge').length} Aufgaben`,'','#DB2777')}</div>
  <h2 class="gk">Nachschlagen</h2><div class="mgrid">
  ${k('suche','🔍','Suche','Alle Aufgaben durchsuchen','','#64748B')}
  ${k('glossar','📖','Glossar',`${GLOSSAR.length} Begriffe A bis Z`,'','#2563EB')}
  ${k('formeln','🧪','Formeln',`${FORMELN.length} Formeln mit Beispiel`,'','#059669')}
  ${k('tipps','🧠','Prüfungstipps',`${TIPPS.length} Tricks für morgen`,'','#D946EF')}</div>
  <h2 class="gk">Spickzettel</h2><div class="welten">${ORDER.map(k=>`<button class="wk" data-lern="${k}" style="--c:${W[k].c};--cd:${W[k].cd}"><span>${W[k].ic}</span>${W[k].name}</button>`).join('')}</div>`);
}
function themenListe(){const q={};themaQuoten().forEach(x=>q[x.t]=x.q);
  layer(`<div class="dim" data-act="close"><div class="sheet"><span class="tag">🏷️ Themen-Training</span><h2>Welches Thema?</h2><div class="tliste">${THEMEN.map(t=>{const n=AUFG.filter(a=>a.thema===t).length,w=W[AUFG.find(a=>a.thema===t).welt];
    return `<button class="titem" data-thema="${esc(t)}" style="--c:${w.c}"><span class="tdot"></span><span class="tt">${esc(t)}</span><small>${n}${q[t]!==undefined?` · ${q[t]} %`:''}</small></button>`}).join('')}</div></div></div>`)}
function kartenWahl(){layer(`<div class="dim" data-act="close"><div class="sheet"><span class="tag">🃏 Lernkarten</span><h2>Welcher Stapel?</h2>
  <div class="btns"><button class="btn" data-karten="faellig">🔁 Fällige und Fehler zuerst</button>${ORDER.map(k=>`<button class="btn light exam" data-karten="${k}"><span>${W[k].ic} ${W[k].name}</span><small>${pool(k).length} Karten</small></button>`).join('')}</div></div></div>`)}

/* ---------- Nachschlagen ---------- */
function glossar(f=''){const fl=f.toLowerCase();const liste=GLOSSAR.filter(([b,t])=>!fl||b.toLowerCase().includes(fl)||t.toLowerCase().includes(fl));
  const html=liste.map(([b,t])=>`<details class="gl"><summary>${esc(b)}</summary><p>${esc(t)}</p></details>`).join('')||'<p class="muted center">Nichts gefunden.</p>';
  if($('#glr')){$('#glr').innerHTML=html;return}
  app(`${kopfZurueck('Glossar','📖')}<input class="such" id="glf" type="search" placeholder="Begriff suchen …" value="${esc(f)}" autocomplete="off"><div id="glr" class="glliste">${html}</div>`);
  $('#glf').addEventListener('input',e=>glossar(e.target.value))}
function formeln(){app(`${kopfZurueck('Formeln','🧪')}<div class="fliste">${FORMELN.map(([n,f,b])=>`<div class="fk glass2"><b>${esc(n)}</b><div class="formel">${esc(f)}</div><small>${esc(b)}</small></div>`).join('')}</div>`)}
function tipps(){S.flags.tipps=true;save();app(`${kopfZurueck('Prüfungstipps','🧠')}<div class="say">${maskot('cool','🤙',.3)}<div class="bubble">Die Tricks, die dir morgen Punkte bringen.</div></div><div class="fliste">${TIPPS.map(([i,t,x])=>`<div class="fk glass2 tip"><span class="tipic">${i}</span><div><b>${esc(t)}</b><small>${esc(x)}</small></div></div>`).join('')}</div>`);const neu=erfolgePruefen();if(neu.length)erfolgToast(neu)}
function suche(f=''){const fl=f.trim().toLowerCase();const liste=fl.length<2?[]:AUFG.filter(a=>[a.frage,a.situation,a.thema,a.erklaerung,a.pruefung,(a.optionen||[]).join(' ')].join(' ').toLowerCase().includes(fl)).slice(0,60);
  const html=fl.length<2?'<p class="muted center">Mindestens 2 Buchstaben, z. B. „Elastizität“, „Mutterschutz“, „Tender“.</p>':liste.length?liste.map(a=>`<button class="sitemr" data-einzel="${a.id}" style="--c:${W[a.welt].c}"><span class="tag">${W[a.welt].ic} ${esc(a.thema)}</span><span class="st">${esc(a.frage)}</span><small>${esc(a.pruefung)} · Aufgabe ${a.nr}${S.stat[a.id]?` · ${S.stat[a.id].lastOk?'✅':'❌'}`:''}</small></button>`).join(''):'<p class="muted center">Nichts gefunden.</p>';
  if($('#sr')){$('#sr').innerHTML=html;$('#sz').textContent=fl.length<2?'':`${liste.length} Treffer`;return}
  app(`${kopfZurueck('Suche','🔍')}<input class="such" id="sf" type="search" placeholder="Wonach suchst du?" value="${esc(f)}" autocomplete="off"><div class="muted" id="sz"></div><div id="sr" class="srliste">${html}</div>`);
  $('#sf').addEventListener('input',e=>suche(e.target.value));setTimeout(()=>$('#sf').focus(),300)}

/* ---------- Statistik ---------- */
function statistik(){
  const pr=prognose(),z=S.zahl,quoteGes=z.n?Math.round(z.ok/z.n*100):0,min=Math.round(z.sek/60),gesehen=Object.keys(S.seen).length;
  const tage=[...Array(35)].map((_,i)=>tagPlus(heute(),i-34)),maxXp=Math.max(10,...tage.map(d=>(S.tage[d]||{}).xp||0));
  const sieben=tage.slice(-7),m7=Math.max(10,...sieben.map(d=>(S.tage[d]||{}).xp||0));
  const tq=themaQuoten().filter(x=>x.n>=2).sort((a,b)=>a.q-b.q);
  const balken=(lbl,q,farbe,extra='')=>`<div class="bz"><span class="bl">${lbl}</span><div class="bb"><i style="width:${q||0}%;background:${farbe}"></i></div><span class="bq">${q===null?'–':q+' %'}</span>${extra}</div>`;
  app(`${topbar()}<div class="seitenkopf"><h1>Statistik</h1><p>Wo du stehst und was noch fehlt.</p></div>
  <div class="glass2 prog-k">${pr?`<div class="pnote n${pr.note}">${pr.note}</div><div><b>Prognose: ${NOTEN[pr.note]}</b><span>${pr.p} % richtig in deinen letzten ${pr.n} Antworten. ${pr.note<=4?'Damit bestehst du WiSo.':'Noch unter 50 %. Weiter trainieren!'}</span></div>`:`<div class="pnote">?</div><div><b>Prognose</b><span>Beantworte mindestens 10 Aufgaben, dann rechne ich deine Note aus.</span></div>`}</div>
  <div class="kgrid">
   <div class="kz glass2">${ring(Math.round(tag().xp/S.ziel*100),70,`<b>${tag().xp}</b>`,'var(--gold)')}<span>XP heute<br><small>Ziel ${S.ziel}</small></span></div>
   <div class="kz glass2"><div class="kbig">🔥 ${S.streak.n}</div><span>Tage Serie<br><small>Rekord ${S.streak.max||0}</small></span></div>
   <div class="kz glass2"><div class="kbig">${quoteGes}%</div><span>richtig<br><small>${z.ok} von ${z.n}</small></span></div>
   <div class="kz glass2"><div class="kbig">${min}</div><span>Minuten<br><small>gelernt</small></span></div>
   <div class="kz glass2"><div class="kbig">${gesehen}</div><span>von ${AUFG.length}<br><small>gesehen</small></span></div>
   <div class="kz glass2"><div class="kbig">⭐ ${sterneGesamt()}</div><span>Sterne<br><small>👔 ${Object.keys(S.boss).length}/6 Bosse</small></span></div>
  </div>
  <div class="glass2 box"><h3>Letzte 7 Tage</h3><div class="saeulen">${sieben.map(d=>{const x=(S.tage[d]||{}).xp||0;return `<div class="sae"><div class="sb"><i style="height:${Math.round(x/m7*100)}%" ${d===heute()?'class="hz"':''}></i></div><b>${x}</b><span>${WT[(new Date(d+'T12:00:00').getDay()+6)%7]}</span></div>`}).join('')}</div></div>
  <div class="glass2 box"><h3>Lernkalender</h3><div class="kal">${tage.map(d=>{const x=(S.tage[d]||{}).xp||0,s=x?Math.min(4,1+Math.floor(x/maxXp*4)):0;return `<i class="k${s} ${d===heute()?'heute':''}" title="${d}: ${x} XP"></i>`}).join('')}</div><div class="muted klein">Die letzten 5 Wochen. Je dunkler, desto mehr XP.</div></div>
  <div class="glass2 box"><h3>Nach Bereich</h3>${ORDER.map(k=>balken(`${W[k].ic} ${W[k].name}`,weltQuote(k),W[k].hex)).join('')}</div>
  <div class="glass2 box"><h3>Nach Aufgabentyp</h3>${Object.keys(TYPNAME).map(t=>balken(TYPNAME[t],typQuote(t),'var(--pri)')).join('')}</div>
  <div class="glass2 box"><h3>Schwächste Themen</h3>${tq.length?tq.slice(0,5).map(x=>`<div class="schw"><span class="tdot" style="--c:${W[x.welt].c}"></span><span class="tt">${esc(x.t)}</span><b>${x.q} %</b><button class="mini" data-thema="${esc(x.t)}">Üben</button></div>`).join(''):'<p class="muted">Noch zu wenig Antworten. Spiel ein paar Lektionen.</p>'}</div>
  ${tq.length>3?`<div class="glass2 box"><h3>Stärkste Themen</h3>${tq.slice(-3).reverse().map(x=>`<div class="schw"><span class="tdot" style="--c:${W[x.welt].c}"></span><span class="tt">${esc(x.t)}</span><b>${x.q} %</b></div>`).join('')}</div>`:''}
  <div class="glass2 box"><h3>Echte Prüfungen</h3>${PRUEF.map(p=>`<div class="schw"><span class="tt">${esc(p)}</span><b>${S.exam[p]?'Note '+S.exam[p]:'–'}</b><button class="mini" data-exam="${esc(p)}">Schreiben</button></div>`).join('')}</div>
  <div class="glass2 box"><h3>Rekorde</h3><div class="schw"><span class="tt">⚡ Blitzrunde</span><b>${S.rek.blitz}</b></div><div class="schw"><span class="tt">🧟 Survival</span><b>${S.rek.surv}</b></div><div class="schw"><span class="tt">🔥 Beste Serie</span><b>${S.best}</b></div><div class="schw"><span class="tt">🏎️ Schnelle Antworten</span><b>${z.schnell}</b></div><div class="schw"><span class="tt">🖕 Kassierte Mittelfinger</span><b>${z.finger}</b></div></div>`);
}

/* ---------- Profil ---------- */
function profil(){const tab=ligaTabelle(),rang=tab.findIndex(x=>x.du)+1,er=Object.keys(S.achv).length;
  app(`${topbar()}<div class="prof"><div class="pm">${maskot('happy',null,0)}</div><div class="pn"><button class="pname" data-act="name">${S.name?esc(S.name):'Name eingeben'} ✏️</button><div class="muted">Level ${level()} · ${S.xp} XP · seit ${Object.keys(S.tage).length||1} ${Object.keys(S.tage).length===1?'Tag':'Tagen'} dabei</div></div></div>
  <div class="kgrid">
   <button class="kz glass2" data-sub="liga"><div class="kbig">🏆 ${rang}.</div><span>${LIGEN[S.liga.stufe]}<br><small>diese Woche</small></span></button>
   <button class="kz glass2" data-sub="erfolge"><div class="kbig">🏅 ${er}</div><span>von ${ACHV.length}<br><small>Erfolgen</small></span></button>
   <button class="kz glass2" data-sub="shop"><div class="kbig">💸 ${S.knete}</div><span>Knete<br><small>zum Shop</small></span></button>
   <div class="kz glass2"><div class="kbig">🎒</div><span>🧊${S.inv.freeze} 🃏${S.inv.joker}<br><small>❤️${S.inv.herz}</small></span></div>
  </div>
  <div class="liste glass2">
   <button class="li" data-sub="shop"><span>🛍️</span>Shop und Outfits<i>›</i></button>
   <button class="li" data-sub="erfolge"><span>🏅</span>Erfolge<i>›</i></button>
   <button class="li" data-sub="liga"><span>🏆</span>Liga<i>›</i></button>
   <button class="li" data-sub="einstellungen"><span>⚙️</span>Einstellungen<i>›</i></button>
   <button class="li" data-sub="features"><span>✨</span>Was die App alles kann<i>›</i></button>
   <button class="li" data-act="teilen"><span>📤</span>App teilen<i>›</i></button>
  </div>`)}
function shop(){
  const it=x=>{const hat=S.owned.includes(x.id),an=S.outfit[x.typ]===x.id;return `<button class="si ${an?'an':''}" data-shop="${x.id}"><span class="se" ${x.typ==='farbe'?`style="background:${x.ov}"`:''}>${x.typ==='farbe'?'':x.e}</span><b>${x.name}</b><small>${an?'Angezogen':hat?'Anziehen':x.p?`💸 ${x.p}`:'Gratis'}</small></button>`};
  app(`${kopfZurueck('Shop','🛍️')}<div class="shopkopf glass2"><div class="spm">${maskot('cool',null,0)}</div><div><b>💸 ${S.knete} Knete</b><span>Knete gibt es für richtige Antworten, 3 Sterne, Bosse, Challenges, Kisten und Erfolge.</span></div></div>
  <h2 class="gk">Power-ups</h2><div class="vgrid">${VERBRAUCH.map(v=>`<button class="vi glass2" data-kauf="${v.id}"><span class="se">${v.e}</span><div><b>${v.name}</b><small>${v.info}</small></div><span class="preis">💸 ${v.p}</span><span class="hab">${v.id==='boost'?(boostAktiv()?'aktiv':''):`× ${S.inv[v.id]}`}</span></button>`).join('')}</div>
  <h2 class="gk">Hüte</h2><div class="sgrid">${SHOP.filter(x=>x.typ==='hut').map(it).join('')}</div>
  <h2 class="gk">Accessoires</h2><div class="sgrid">${SHOP.filter(x=>x.typ==='acc').map(it).join('')}</div>
  <h2 class="gk">Farbe</h2><div class="sgrid">${SHOP.filter(x=>x.typ==='farbe').map(it).join('')}</div>`)}
function shopKlick(id){const x=SHOP.find(s=>s.id===id);if(!x)return;
  if(S.owned.includes(id)){S.outfit[x.typ]=S.outfit[x.typ]===id&&x.typ!=='farbe'?null:id;save();sfx('pick');haptic();return shop()}
  if(S.knete<x.p){sfx('boing');haptic(2);return toast(`Dir fehlen ${x.p-S.knete} Knete`,'💸')}
  S.knete-=x.p;S.owned.push(id);S.outfit[x.typ]=id;save();sfx('kasse');haptic(2);toast(`${x.name} gekauft!`,x.e);emojis([x.e,'✨','💸'],14,innerWidth/2,200,220);shop();const neu=erfolgePruefen();if(neu.length)setTimeout(()=>erfolgToast(neu),600)}
function kaufen(id){const v=VERBRAUCH.find(x=>x.id===id);if(S.knete<v.p){sfx('boing');haptic(2);return toast(`Dir fehlen ${v.p-S.knete} Knete`,'💸')}
  S.knete-=v.p;if(id==='boost')S.boostBis=Math.max(Date.now(),S.boostBis)+15*60000;else S.inv[id]++;save();sfx('kasse');haptic(2);toast(`${v.name} gekauft!`,v.e);shop()}
function erfolge(){app(`${kopfZurueck('Erfolge','🏅')}<p class="muted">${Object.keys(S.achv).length} von ${ACHV.length} freigeschaltet. Jeder Erfolg bringt 20 Knete.</p><div class="egrid">${ACHV.map(([id,ic,t,b])=>{const d=S.achv[id];return `<div class="ek ${d?'an':''}"><span class="ei">${d?ic:'🔒'}</span><b>${t}</b><small>${b}</small>${d?`<em>${d.split('-').reverse().join('.')}</em>`:''}</div>`}).join('')}</div>`)}
function erfolgePruefen(){const neu=[];ACHV.forEach(a=>{if(!S.achv[a[0]]){let ok=false;try{ok=a[4](S)}catch(e){}if(ok){S.achv[a[0]]=heute();S.knete+=20;neu.push(a)}}});if(neu.length)save();return neu}
function erfolgToast(neu){neu.forEach((a,i)=>setTimeout(()=>{toast(`Erfolg: ${a[2]} · +20 Knete`,a[1]);sfx('erfolg');haptic(2);emojis([a[1],'✨'],12,innerWidth/2,90,180)},i*2700))}
function liga(){ligaWoche();const tab=ligaTabelle(),wEnde=tagPlus(S.liga.woche,7),rest=tageZwischen(heute(),wEnde);
  app(`${kopfZurueck(LIGEN[S.liga.stufe],'🏆')}<div class="ligakopf glass2"><div class="lstufen">${LIGEN.map((l,i)=>`<span class="${i===S.liga.stufe?'an':i<S.liga.stufe?'weg':''}">${['🥉','🥈','🥇','💎','👑'][i]}</span>`).join('')}</div><span>Noch ${rest} ${rest===1?'Tag':'Tage'}. Platz 1 bis 3 steigen auf, die letzten 3 steigen ab.</span></div>
  <div class="ltab glass2">${tab.map((x,i)=>`<div class="lz ${x.du?'du':''} ${i<3?'auf':i>=12?'ab':''}"><span class="lp">${i+1}</span><span class="la">${x.du?maskot('happy',null,0):`<i>${x.n[0]}</i>`}</span><span class="ln">${esc(x.n)}</span><b>${x.xp} XP</b></div>`).join('')}</div>`)}
function einstellungen(){
  const sw=(k,t,s)=>`<label class="sw"><span><b>${t}</b>${s?`<small>${s}</small>`:''}</span><input type="checkbox" switch data-set="${k}" ${S[k]?'checked':''}><i></i></label>`;
  const seg=(k,opts)=>`<div class="seg">${opts.map(([v,t])=>`<button class="${String(S[k])===String(v)?'an':''}" data-seg="${k}" data-v="${v}">${t}</button>`).join('')}</div>`;
  app(`${kopfZurueck('Einstellungen','⚙️')}
  <div class="liste glass2">${sw('sound','Soundeffekte')}${sw('musik','Hintergrundmusik','Lo-Fi-Beat beim Lernen')}${sw('haptik','Vibration','Spürbares Feedback beim Tippen')}${sw('fx','Animationen und Effekte','Konfetti, Wackeln, Explosionen')}${sw('finger','Mittelfinger-Modus','Aus: jugendfreie Gesten')}</div>
  <h2 class="gk">Design</h2><div class="glass2 pad">${seg('thema',[['auto','Automatisch'],['hell','Hell'],['dunkel','Dunkel']])}</div>
  <h2 class="gk">Schriftgröße</h2><div class="glass2 pad">${seg('schrift',[[0.92,'Klein'],[1,'Normal'],[1.1,'Groß']])}</div>
  <h2 class="gk">Tagesziel</h2><div class="glass2 pad">${seg('ziel',[[20,'20 XP'],[50,'50 XP'],[100,'100 XP'],[150,'150 XP']])}</div>
  <h2 class="gk">Prüfungsdatum</h2><div class="glass2 pad"><input class="such" type="date" id="datum" value="${S.datum}"></div>
  <h2 class="gk">Fortschritt</h2><div class="liste glass2"><button class="li" data-act="export"><span>📋</span>Fortschritt kopieren<i>›</i></button><button class="li" data-act="import"><span>📥</span>Fortschritt einfügen<i>›</i></button><button class="li rot" data-act="reset"><span>🗑️</span>Alles zurücksetzen<i>›</i></button></div>
  <p class="muted center klein">Crashkurs IHK ${VERSION} · Dein Fortschritt bleibt auf diesem Gerät.</p>`);
  $('#datum').addEventListener('change',e=>{S.datum=e.target.value||S.datum;save();toast('Prüfungsdatum gespeichert','📅')})}
function features(){let n=0;app(`${kopfZurueck('Was die App kann','✨')}<p class="muted">${FEATURES.reduce((a,g)=>a+g[1].length,0)} Funktionen in ${FEATURES.length} Bereichen.</p>${FEATURES.map(([g,l])=>`<details class="gl" open><summary>${g} <small>(${l.length})</small></summary><ol start="${n+1}">${l.map(x=>(n++,`<li>${esc(x)}</li>`)).join('')}</ol></details>`).join('')}`)}

/* ---------- Bottom-Sheets: nach unten wischen schließt ---------- */
function sheetGriff(){const sh=$('#layer .sheet');if(!sh||sh.dataset.g)return;sh.dataset.g=1;sh.insertAdjacentHTML('afterbegin','<div class="grab" aria-hidden="true"></div>');let y0=null,dy=0;
  sh.addEventListener('pointerdown',e=>{if(sh.scrollTop>0||e.target.closest('button,input,a,summary'))return;y0=e.clientY;dy=0;sh.style.transition='none'});
  sh.addEventListener('pointermove',e=>{if(y0===null)return;dy=Math.max(0,e.clientY-y0);sh.style.transform=`translateY(${dy}px)`});
  const los=()=>{if(y0===null)return;y0=null;sh.style.transition='transform .2s';if(dy>90){sh.style.transform='translateY(100%)';sfx('tap');setTimeout(()=>layer(''),180)}else sh.style.transform=''};
  sh.addEventListener('pointerup',los);sh.addEventListener('pointercancel',los)}

/* ---------- Start, Onboarding, Neuigkeiten ---------- */
function splash(){const d=document.createElement('div');d.id='splash';
  d.innerHTML=`${maskot('cool','🖕',1.1)}<h1>${'Crashkurs'.split('').map((c,i)=>`<span style="animation-delay:${.85+i*.05}s">${c}</span>`).join('')}<br><em>IHK Prüfung</em></h1><p>${AUFG.length} echte Aufgaben. Null Gnade.</p><button class="btn" data-act="los">Bock drauf ▶</button>`;
  document.body.appendChild(d)}
function los(){const d=$('#splash');ac();sfx('crash');sfx('finger',450);haptic(2);flash('white');emojis(['💥','🖕','🔥','💸','⭐'],26,innerWidth/2,innerHeight/2,340);
  if(d){d.style.transition='opacity .35s,transform .35s';d.style.opacity='0';d.style.transform='scale(1.15)';setTimeout(()=>d.remove(),360)}
  zeigeTab('pfad',true);setTimeout(quake,60);if(S.musik)musikStart();
  setTimeout(()=>{if(!S.onboard)onboarding();else if(S.v!==VERSION)neuigkeiten()},700)}
function onboarding(){layer(`<div class="dim"><div class="sheet"><span class="tag">👋 Willkommen</span><h2>Ich bin Crashi.</h2><div class="say">${maskot('happy','👋',.2)}<div class="bubble">Ich bring dich durch die IHK. Wie heißt du?</div></div>
  <input class="such" id="obn" placeholder="Dein Name" maxlength="20" autocomplete="given-name" value="${esc(S.name)}"><h3 class="gk">Wie viel pro Tag?</h3><div class="seg" id="obz">${[[20,'Locker'],[50,'Normal'],[100,'Ernst'],[150,'Brutal']].map(([v,t])=>`<button class="${S.ziel==v?'an':''}" data-obz="${v}">${t}<small>${v} XP</small></button>`).join('')}</div>
  <div class="btns"><button class="btn" data-act="obfertig">Los gehts!</button></div></div></div>`)}
function neuigkeiten(){S.v=VERSION;save();layer(`<div class="dim" data-act="close"><div class="sheet"><span class="tag">✨ Neu in ${VERSION}</span><h2>Crashi hat aufgerüstet!</h2><div class="say">${maskot('cool','🤘',.2)}<div class="bubble">Über 200 neue Sachen. Hier die Highlights:</div></div>
  <div class="neu">${['📱 Leiste unten wie eine echte App','🎯 Üben-Seite mit 17 Lernmodi','⚡ Blitzrunde, 🧟 Survival, 📆 Tages-Challenge','🔁 Wiederholen nach Lernkurve, 🩹 Fehlertraining','🃏 Lernkarten zum Wischen','📊 Statistik mit Notenprognose und Kalender','🛍️ Shop mit Outfits für Crashi und Power-ups','🏅 38 Erfolge, 🏆 Liga mit Auf- und Abstieg','📖 Glossar, 🧪 Formeln, 🧠 Prüfungstipps','🌙 Dunkelmodus, 🎵 Musik, 📳 Vibration, 🔊 Vorlesen'].map(x=>`<div>${x}</div>`).join('')}</div>
  <div class="btns"><button class="btn" data-act="close">Geil, los!</button><button class="btn light" data-sub="features">Alle Funktionen ansehen</button></div></div></div>`)}
