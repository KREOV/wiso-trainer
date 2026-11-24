/* ===================== Crashkurs IHK · Steuerung ===================== */
const SUBS={liga,erfolge,shop,einstellungen,features,glossar,formeln,tipps,suche};
function modus(m,el){
  const tc=n=>neueZuerst(n).slice(0,10);
  if(m==='daily')return starte({mode:'daily',list:seedShuffle(AUFG,heute()).slice(0,10)});
  if(m==='fehler')return starte({mode:'fehler',list:tc(AUFG.filter(a=>S.stat[a.id]&&S.stat[a.id].lastOk===false))});
  if(m==='wdh')return starte({mode:'wdh',list:AUFG.filter(a=>faellig(a.id)).sort((a,b)=>(S.stat[a.id].box||0)-(S.stat[b.id].box||0)).slice(0,10)});
  if(m==='schwach'){const t=themaQuoten().sort((a,b)=>a.q-b.q).slice(0,3).map(x=>x.t);if(!t.length){toast('Erst ein paar Aufgaben lösen, dann kenne ich deine Schwächen','🎯');return starte({mode:'zufall',list:shuffle(AUFG.slice()).slice(0,10)})}
    return starte({mode:'schwach',list:shuffle(AUFG.filter(a=>t.includes(a.thema))).slice(0,10)})}
  if(m==='karten')return kartenWahl();
  if(m==='blitz'){const l=shuffle(AUFG.filter(a=>a.typ==='mc'));return starte({mode:'blitz',list:l,pool:l})}
  if(m==='surv')return starte({mode:'surv',list:shuffle(AUFG.slice())});
  if(m==='zufall')return starte({mode:'zufall',list:shuffle(AUFG.slice()).slice(0,10)});
  if(m==='fav')return starte({mode:'fav',list:shuffle(AUFG.filter(a=>S.fav[a.id]))});
  if(m==='sim')return starte({mode:'sim',list:examMix()});
  if(m==='examliste')return examListe();
  if(m==='themen')return themenListe();
  if(m.startsWith('typ-')){const t=m.slice(4);return starte({mode:'typ',list:tc(AUFG.filter(a=>a.typ===t))})}
  if(m==='welt'){const k=el.dataset.welt;return starte({mode:'thema',k,list:tc(pool(k))})}
  if(SUBS[m])return sub(SUBS[m]);
}
function quitFrage(){if(!R)return zeigeTab(TAB);if(R.karten||!R.res.length||R.done&&R.i+1>=R.n)return zeigeTab(TAB);
  layer(`<div class="dim" data-act="close"><div class="sheet"><h2>Wirklich aufhören?</h2><div class="say">${maskot('shock','🥺',.1)}<div class="bubble">Ernsthaft? Du warst so gut dabei!</div></div><div class="btns"><button class="btn" data-act="close">Weiterspielen</button><button class="btn light" data-act="quitja">Aufhören</button></div></div></div>`)}
function crashiTap(el){sfx('boing');haptic();el.classList.remove('stups');void el.offsetWidth;el.classList.add('stups');toast(pick(SAY.tap),'💬')}
function nameAendern(){layer(`<div class="dim" data-act="close"><div class="sheet"><h2>Wie heißt du?</h2><input class="such" id="nin" maxlength="20" value="${esc(S.name)}" placeholder="Dein Name" autocomplete="given-name"><div class="btns"><button class="btn" data-act="nameok">Speichern</button></div></div></div>`);setTimeout(()=>$('#nin')&&$('#nin').focus(),250)}
function exportieren(){const t=JSON.stringify(S);try{navigator.clipboard.writeText(t).then(()=>toast('Fortschritt kopiert. Füg ihn auf dem anderen Gerät ein.','📋'),()=>zeigeText(t))}catch(e){zeigeText(t)}}
function zeigeText(t){layer(`<div class="dim" data-act="close"><div class="sheet"><h2>Dein Fortschritt</h2><p class="muted">Alles markieren und kopieren.</p><textarea class="such ta" readonly>${esc(t)}</textarea></div></div>`)}
function importieren(){layer(`<div class="dim" data-act="close"><div class="sheet"><h2>Fortschritt einfügen</h2><p class="muted">Füg hier den kopierten Text ein. Dein jetziger Stand wird ersetzt.</p><textarea class="such ta" id="imp" placeholder="{…}"></textarea><div class="btns"><button class="btn" data-act="importok">Übernehmen</button></div></div></div>`)}
function importOk(){try{const d=JSON.parse($('#imp').value);if(typeof d!=='object'||d.xp===undefined)throw 0;const neu=S0();S=Object.assign(neu,d);['inv','outfit','streak','rek','zahl','flags','liga'].forEach(k=>S[k]=Object.assign(S0()[k],d[k]||{}));save();themaSetzen();toast('Fortschritt übernommen!','✅');sfx('win');zeigeTab('pfad',true)}catch(e){sfx('boing');toast('Das sieht nicht nach einem Fortschritt aus','🤔')}}
function resetFrage(){layer(`<div class="dim" data-act="close"><div class="sheet"><h2>Alles löschen?</h2><div class="say">${maskot('shock','😱',.1)}<div class="bubble">XP, Sterne, Knete, Outfits, Statistik. Alles weg. Sicher?</div></div><div class="btns"><button class="btn" data-act="close">Nein, behalten</button><button class="btn light rot" data-act="resetja">Ja, alles löschen</button></div></div></div>`)}
async function teilen(){const d={title:'Crashkurs IHK',text:'WiSo lernen mit 168 echten IHK-Aufgaben und einem Crashtest-Dummy, der dir den Mittelfinger zeigt.',url:location.href.split('?')[0]};
  try{if(navigator.share)await navigator.share(d);else{await navigator.clipboard.writeText(d.url);toast('Link kopiert','🔗')}}catch(e){}}

document.addEventListener('click',e=>{
  if(justDragged)return;
  const b=e.target.closest('button,[data-act],[data-modus],[role=button]');if(!b)return;const ds=b.dataset;
  if(ds.act==='close'&&e.target!==b&&b.tagName!=='BUTTON')return;
  if(ds.tab)return zeigeTab(ds.tab);
  if(ds.sub){layer('');return sub(SUBS[ds.sub])}
  if(ds.lesson)return lektionMenu(ds.lesson);
  if(ds.unitboss)return bossMenu(ds.unitboss);
  if(ds.play){const l=LEK[ds.play];return starte({mode:'lesson',lesson:l.id,k:l.k,list:shuffle(l.list.slice())})}
  if(ds.bossplay){const k=ds.bossplay;return starte({mode:'boss',k,list:neueZuerst(pool(k)).slice(0,BOSS_N)})}
  if(ds.lern)return spick(ds.lern);
  if(ds.exam){const p=ds.exam;return starte({mode:'exam',exam:p,list:p==='*'?examMix():AUFG.filter(a=>a.pruefung===p).sort((a,b)=>a.nr-b.nr)})}
  if(ds.modus)return modus(ds.modus,b);
  if(ds.thema)return starte({mode:'thema',list:shuffle(AUFG.filter(a=>a.thema===ds.thema)).slice(0,10)});
  if(ds.einzel)return starte({mode:'einzel',list:[AID[ds.einzel]]});
  if(ds.karten){layer('');const l=ds.karten==='faellig'?neueZuerst(AUFG).sort((a,b)=>((S.stat[b.id]||{}).lastOk===false)-((S.stat[a.id]||{}).lastOk===false)||faellig(b.id)-faellig(a.id)):neueZuerst(pool(ds.karten));return kartenStart(l,'Lernkarten')}
  if(ds.kartenLek){layer('');return kartenStart(LEK[ds.kartenLek].list,'Lernkarten')}
  if(ds.karte!==undefined)return karteWerten(ds.karte==='1');
  if(ds.shop)return shopKlick(ds.shop);
  if(ds.kauf)return kaufen(ds.kauf);
  if(ds.seg){const k=ds.seg,v=isNaN(+ds.v)?ds.v:+ds.v;S[k]=v;save();sfx('tap');haptic();themaSetzen();return einstellungen()}
  if(ds.obz){S.ziel=+ds.obz;document.querySelectorAll('[data-obz]').forEach(x=>x.classList.toggle('an',x===b));sfx('tap');haptic();return}
  if(R&&!R.done&&!R.karten){
    if(ds.o!==undefined){const i=+ds.o;sfx('tap');haptic();
      if(R.q.typ==='multi')R.sel=R.sel.includes(i)?R.sel.filter(x=>x!==i):[...R.sel,i];else R.sel=i;
      document.querySelectorAll('.ans').forEach((x,j)=>x.classList.toggle('sel',R.q.typ==='multi'?R.sel.includes(j):j===R.sel));if(R.mode==='blitz')pruefen();return}
    if(ds.k!==undefined){const k=+ds.k;R.chip=R.chip===k?null:k;sfx('pick');haptic();return zuMalen()}
    if(ds.row!==undefined){const j=+ds.row;if(R.chip!==null)return setzeZu(j,R.chip);if(R.zu[j]!==null){R.zu[j]=null;sfx('tap');return zuMalen()}sfx('boing');b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');return}
    if(ds.up!==undefined||ds.down!==undefined){const p=+(ds.up??ds.down),t=ds.up!==undefined?p-1:p+1;if(t<0||t>=R.ord.length)return;[R.ord[p],R.ord[t]]=[R.ord[t],R.ord[p]];sfx('tap');haptic();return sortNeu()}
  }
  const a=ds.act;if(!a)return;
  ({
   los,close:()=>{sfx('tap');layer('')},snd:()=>{S.sound=!S.sound;save();if(S.sound)sfx('pick');const s=$('.snd');if(s)s.textContent=S.sound?'🔊':'🔇'},
   crashi:()=>crashiTap(b),name:nameAendern,nameok:()=>{S.name=($('#nin').value||'').trim().slice(0,20);save();layer('');sfx('kasse');zeigeTab(TAB,true)},
   teilen,weiterlernen,examliste:examListe,zurueck:()=>zeigeTab(TAB),home:()=>zeigeTab(TAB,true),
   check:pruefen,weiter:()=>{layer('');R.i++;sfx('whoosh');frage()},ende,quit:quitFrage,quitja:()=>zeigeTab(TAB),
   vorlesen:()=>R&&vorlesen([R.q.situation,R.q.frage,...(R.q.optionen||[]).map((o,i)=>`${i+1}: ${o}`)].filter(Boolean).join('. ')),
   'vorlesen-erkl':()=>R&&vorlesen(R.q.erklaerung),
   fav:()=>{const id=R.q.id;S.fav[id]=!S.fav[id];if(!S.fav[id])delete S.fav[id];save();sfx('pick');haptic();document.querySelectorAll('[data-act=fav]').forEach(x=>{x.classList.toggle('on',!!S.fav[id]);x.textContent=x.closest('.fbtools')?(S.fav[id]?'★ Gemerkt':'☆ Merken'):(S.fav[id]?'★':'☆')});toast(S.fav[id]?'Gemerkt':'Nicht mehr gemerkt','⭐')},
   joker,tipp,kiste:kisteOeffnen,flip:karteDrehen,
   export:exportieren,import:importieren,importok:importOk,reset:resetFrage,
   resetja:()=>{try{localStorage.removeItem(KEY)}catch(e){}S=S0();save();themaSetzen();layer('');zeigeTab('pfad',true);onboarding()},
   obfertig:()=>{S.name=($('#obn').value||'').trim().slice(0,20);S.onboard=true;S.v=VERSION;save();layer('');sfx('win');konfetti(150);toast(`Los gehts${S.name?', '+S.name:''}!`,'🚀');zeigeTab('pfad',true)}
  })[a]?.();
});
document.addEventListener('change',e=>{const k=e.target.dataset&&e.target.dataset.set;if(!k)return;S[k]=e.target.checked;save();haptic();
  if(k==='musik')S.musik?musikStart():musikStop();if(k==='sound'&&S.sound)sfx('pick');if(k==='fx')themaSetzen()});
document.addEventListener('keydown',e=>{if(!R||R.karten||e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  if(!R.done&&/^[1-9]$/.test(e.key)){const b=document.querySelectorAll('.ans,.chip')[+e.key-1];if(b)b.click()}
  if(e.key==='Enter'){const b=$('#layer [data-act=weiter], #layer [data-act=ende]')||(!R.done&&$('#chk'));if(b)b.click()}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)musikStop();else if(S.musik&&AC)musikStart()});
if('serviceWorker' in navigator){let erst=!navigator.serviceWorker.controller;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!erst)toast('Neue Version geladen. Einmal neu öffnen für alles Neue.','✨');erst=false})}

/* ---------- Los ---------- */
themaSetzen();streakPflegen();ligaWoche();
function direkt(){const h=new URLSearchParams(location.hash.slice(1));if(![...h.keys()].length)return false;try{
  if(h.get('t'))zeigeTab(h.get('t'),true);else zeigeTab('pfad',true);
  if(h.get('s')&&SUBS[h.get('s')])sub(SUBS[h.get('s')]);
  if(h.get('m'))modus(h.get('m'),{dataset:{welt:h.get('w')||'recht'}});
  const d=h.get('d');if(d){const l=AUFG.filter(a=>a.typ===d||d==='fb'||d==='ende');starte({mode:'zufall',list:l.slice(0,10)});
    if(d==='fb'){const q=R.q;if(q.typ==='mc'){document.querySelectorAll('.ans')[(q.richtig[0]+1)%q.optionen.length].click();pruefen()}}
    if(d==='ende'){R.res=[1,1,1,0,1];R.richtig=4;R.i=4;R.list=R.list.slice(0,5);R.n=5;ende()}}
  if(h.get('l')==='1'){const id=h.get('lek')||aktuell();if(LEK[id])lektionMenu(id)}
  }catch(e){console.error(e)}return true}
if(!direkt()){zeigeTab('pfad',true);splash()}
