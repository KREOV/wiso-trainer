/* ===================== Crashkurs IHK · Daten ===================== */
const VERSION='3.0';
const W={
 recht:{ic:'§',c:'var(--w4)',cd:'var(--w4d)',hex:'#A855F7',name:'Recht-Burg',sub:'Verträge, Besitz, Geschäftsfähigkeit'},
 arbeit:{ic:'⏱',c:'var(--w5)',cd:'var(--w5d)',hex:'#FF9F1C',name:'Arbeits-Dorf',sub:'Ausbildung, Schutzgesetze, Betriebsrat'},
 sozial:{ic:'✚',c:'var(--w6)',cd:'var(--w6d)',hex:'#06B6D4',name:'Sozial-Bucht',sub:'Sozialversicherung, Steuern'},
 markt:{ic:'%',c:'var(--w2)',cd:'var(--w2d)',hex:'#3B82F6',name:'Markt-Hafen',sub:'Preise, Elastizität, Wettbewerb'},
 kon:{ic:'↗',c:'var(--w3)',cd:'var(--w3d)',hex:'#10B981',name:'Konjunktur-Berg',sub:'Phasen, BIP, Inflation, Staat'},
 ezb:{ic:'€',c:'var(--w1)',cd:'var(--w1d)',hex:'#FF5A5F',name:'EZB-Insel',sub:'Geldpolitik, Außenwirtschaft'}
};
const ORDER=Object.keys(W);
const LEKTION=6, HERZEN=3, BOSS_N=8;
const AUFG=AUF.filter(a=>W[a.welt]);
const AID={};AUFG.forEach(a=>AID[a.id]=a);
const PRUEF=[...new Set(AUFG.map(a=>a.pruefung))];
const THEMEN=[...new Set(AUFG.map(a=>a.thema))].sort((a,b)=>a.localeCompare(b,'de'));
const TYPNAME={mc:'Eine Antwort',multi:'Mehrere Antworten',zuordnen:'Zuordnen',reihenfolge:'Reihenfolge',zahl:'Rechnen'};

/* Lektionen: je Welt nach Thema sortiert, je 6 Aufgaben */
const LEK={},UNITS={};
ORDER.forEach(k=>{
  const p=AUFG.filter(a=>a.welt===k).sort((a,b)=>String(a.thema).localeCompare(String(b.thema),'de')||a.id.localeCompare(b.id));
  const ch=[];for(let i=0;i<p.length;i+=LEKTION)ch.push(p.slice(i,i+LEKTION));
  if(ch.length>1&&ch[ch.length-1].length<3)ch[ch.length-2].push(...ch.pop());
  UNITS[k]=ch.map((list,i)=>{const c={};list.forEach(a=>c[a.thema]=(c[a.thema]||0)+1);
    const l={id:k+'-'+(i+1),k,nr:i+1,list,titel:Object.entries(c).sort((a,b)=>b[1]-a[1])[0][0]};LEK[l.id]=l;return l});
});
const ANZ_LEK=Object.keys(LEK).length;

/* Sprüche von Crashi */
const SAY={
 ok:['Ehrenmann! Die IHK hasst diesen Trick.','Sauber. Der Prüfer weint leise.','Bankkaufmann-Energie!','Zu einfach für dich, ehrlich.','Sitzt wie ein Tilgungsplan.','Boom. Nächste!','Die EZB ist stolz auf dich.','Läuft bei dir, Digga.','Das war Prüfungsniveau. Respekt.','Zack, verbucht.','Rendite: 100 Prozent.','Hirn an, Punkte rein.'],
 bad:['Bruder. Ernsthaft?','Nope. Lies nochmal, Digga.','Die IHK lacht dich gerade aus.','Autsch. Merk dir das jetzt!','Falsch, aber schön geklickt.','Mittelfinger. Aus Liebe.','Hätte, hätte, Lieferkette.','Das war eine Fehlbuchung.','Storno! Nochmal von vorn.','Kurs eingebrochen. Weiter gehts.'],
 combo:['Du brennst!','Nicht aufhören!','Wer stoppt dich noch?','Zinseszins-Effekt!','Bull Run!'],
 schnell:['Schnell wie eine Echtzeitüberweisung!','Blitzbuchung!','Turbo!'],
 start:['Los gehts, Kollege!','Bock? Ich hab Bock.','Heute machen wir die IHK platt.','Eine Runde geht immer.','Kaffee? Egal. Los.','Kopf hoch, Kurs auf Bestehen.'],
 tot:['Game over, Kollege. Nochmal!','Herzen leer. Mittelfinger von mir, dann nochmal.','Insolvenz. Neustart!'],
 win:['Fehlerfrei! Ich bin sprachlos.','Krank. Einfach krank.','So schreibt man Prüfungen!','Vorstandsreif!'],
 mid:['Geht klar. Da geht noch mehr.','Solide. Nächste Lektion!','Passt. Weiter im Text.'],
 morgen:['Guten Morgen! Erst Kaffee, dann IHK zerlegen.','Früh wach? Respekt.'],
 tag:['Mittagspause? Eine Lektion passt rein.','Na, Bock auf Punkte?'],
 abend:['Feierabend-Lernen. Ehrenhaft.','Noch eine Runde vorm Sofa?'],
 nacht:['Es ist mitten in der Nacht. Ab ins Bett, du Held.','Nachteule! Aber Schlaf zählt auch.'],
 tap:['Hey! Nicht anfassen, ich bin versichert.','Aua. Crashtest bestanden.','Ich bin Crashi. Ich hab schon alles gesehen.','Noch einmal und ich kündige.','Lern lieber, statt mich zu stupsen.','Fun Fact: Die EZB sitzt in Frankfurt.','Fun Fact: Die Unfallversicherung zahlt nur der Arbeitgeber.','Fun Fact: Ab 7 Jahren bist du beschränkt geschäftsfähig.','Fun Fact: Das Inflationsziel der EZB liegt bei 2 Prozent.','Fun Fact: Besitz ist die tatsächliche, Eigentum die rechtliche Herrschaft.','Fun Fact: Jugendliche brauchen nach 4,5 Stunden 30 Minuten Pause.','Fun Fact: Der Betriebsrat ist ab 5 Arbeitnehmern möglich.','Fun Fact: Mutterschutz läuft 6 Wochen vor und 8 nach der Geburt.','Fun Fact: Steigende Preise bei gleicher Menge heißen Inflation, nicht Aufschwung.','Fun Fact: Ein Kartell ist grundsätzlich verboten.','Psst. Der Prüfer hat auch nur gekocht.','Mittelfinger an alle, die sagen, du schaffst das nicht.']
};
const SAY_JF={'🖕':'🙄'};

/* Glossar: Begriffe A bis Z */
const GLOSSAR=[
 ['AGB','Allgemeine Geschäftsbedingungen: vorformulierte Vertragsbedingungen für viele Verträge. Überraschende oder benachteiligende Klauseln sind unwirksam. Individuelle Absprachen gehen vor.'],
 ['Angebot (Antrag)','Erste Willenserklärung, die auf einen Vertrag zielt. Mit der Annahme entsteht der Vertrag. Werbung und Schaufenster sind nur Aufforderungen, ein Angebot abzugeben.'],
 ['Angebotsüberhang','Der Preis liegt über dem Gleichgewichtspreis: Es wird mehr angeboten als nachgefragt. Folge: Der Preis sinkt.'],
 ['Arbeitslosenquote','Anteil der Arbeitslosen an allen Erwerbspersonen (Erwerbstätige plus Arbeitslose) in Prozent.'],
 ['Aufschwung','Konjunkturphase mit steigender Produktion, sinkender Arbeitslosigkeit und guter Stimmung.'],
 ['Basiszinssatz','Von der Bundesbank halbjährlich veröffentlichter Zins. Grundlage für Verzugszinsen: Verbraucher plus 5, Unternehmen plus 9 Prozentpunkte.'],
 ['Beitragsbemessungsgrenze','Bis zu diesem Einkommen werden Sozialversicherungsbeiträge berechnet. Was darüber liegt, ist beitragsfrei.'],
 ['Berufsausbildungsvertrag','Vor Beginn der Ausbildung schriftlich niederzulegen. Enthält z. B. Dauer, Probezeit (1 bis 4 Monate), Vergütung, Urlaub.'],
 ['Besitz','Tatsächliche Herrschaft über eine Sache (wer sie hat). Unmittelbarer Besitzer hat sie in der Hand, mittelbarer hat sie überlassen.'],
 ['Betriebsrat','Vertretung der Arbeitnehmer im Betrieb, möglich ab 5 wahlberechtigten Arbeitnehmern. Wählen ab 16, wählbar ab 18 nach 6 Monaten Betriebszugehörigkeit.'],
 ['BIP','Bruttoinlandsprodukt: Wert aller Waren und Dienstleistungen, die in einem Jahr im Inland hergestellt werden. Real heißt: um Preissteigerungen bereinigt.'],
 ['Boom','Hochkonjunktur: Kapazitäten voll ausgelastet, kaum Arbeitslosigkeit, Preise und Löhne steigen stark.'],
 ['Deflation','Das Preisniveau sinkt über längere Zeit. Gefährlich, weil Konsumenten Käufe aufschieben.'],
 ['Depression','Tiefpunkt der Konjunktur: hohe Arbeitslosigkeit, wenig Investitionen, schlechte Stimmung.'],
 ['Eigentum','Rechtliche Herrschaft über eine Sache. Bei beweglichen Sachen übertragen durch Einigung und Übergabe.'],
 ['Eigentumsvorbehalt','Der Verkäufer bleibt Eigentümer, bis der Kaufpreis vollständig bezahlt ist.'],
 ['Einkommenselastizität','Zeigt, wie stark die Nachfrage auf eine Einkommensänderung reagiert.'],
 ['Elastisch','Die Nachfrage reagiert stark auf Preisänderungen (Elastizität größer als 1). Preissenkung erhöht den Umsatz.'],
 ['EZB','Europäische Zentralbank in Frankfurt. Ziel: Preisniveaustabilität, Inflation mittelfristig 2 Prozent.'],
 ['Einlagefazilität','Banken legen über Nacht Geld bei der Zentralbank an. Der Zins bildet die Untergrenze am Geldmarkt.'],
 ['Fusion','Unternehmen verschmelzen zu einem einzigen, mindestens eines verliert seine rechtliche Selbstständigkeit.'],
 ['Gefährdungshaftung','Haftung ohne Verschulden, z. B. für Tierhalter oder Kfz-Halter.'],
 ['Geschäftsfähigkeit','Fähigkeit, wirksam Rechtsgeschäfte abzuschließen. Unter 7 geschäftsunfähig, 7 bis 17 beschränkt, ab 18 voll.'],
 ['Gleichgewichtspreis','Preis, bei dem Angebot und Nachfrage gleich groß sind. Der Markt wird geräumt.'],
 ['Hauptrefinanzierungsgeschäft','Wichtigstes Offenmarktgeschäft der EZB: Banken leihen sich für eine Woche Zentralbankgeld gegen Sicherheiten.'],
 ['Holländisches Verfahren','Zinstender, bei dem alle zum niedrigsten noch zugeteilten Zinssatz zahlen (Einheitszins).'],
 ['Amerikanisches Verfahren','Zinstender, bei dem jede Bank ihren eigenen gebotenen Zinssatz zahlt.'],
 ['Inflation','Anhaltender Anstieg des Preisniveaus. Gemessen über den Verbraucherpreisindex (Warenkorb).'],
 ['JAV','Jugend- und Auszubildendenvertretung: für Beschäftigte unter 18 und Azubis unter 25. Wählbar ist, wer unter 25 ist.'],
 ['Jugendarbeitsschutzgesetz','Schützt Beschäftigte unter 18: höchstens 8 Stunden am Tag, 40 in der Woche, 5-Tage-Woche, Pausen 30 Minuten ab 4,5 Stunden und 60 Minuten ab 6 Stunden.'],
 ['Kartell','Vertragliche Absprache selbstständig bleibender Unternehmen, um den Wettbewerb zu beschränken. Grundsätzlich verboten.'],
 ['Kaufvertrag','Entsteht durch zwei übereinstimmende Willenserklärungen: Antrag und Annahme. Verpflichtet den Verkäufer zur Übergabe und Übereignung, den Käufer zur Zahlung und Abnahme.'],
 ['Konjunktur','Schwankungen der wirtschaftlichen Aktivität: Aufschwung, Boom, Abschwung, Depression.'],
 ['Konzern','Rechtlich selbstständige Unternehmen unter einheitlicher Leitung.'],
 ['Kündigungsfrist','Gesetzlich 4 Wochen zum 15. oder zum Monatsende. In der Probezeit 2 Wochen. Azubis nach der Probezeit 4 Wochen, nur schriftlich mit Grund.'],
 ['Leistungsbilanz','Teil der Zahlungsbilanz: Handelsbilanz, Dienstleistungen, Primär- und Sekundäreinkommen.'],
 ['Leitzins','Zinssätze der EZB, vor allem der Hauptrefinanzierungssatz. Höherer Leitzins macht Kredite teurer und bremst die Inflation.'],
 ['Mängelrüge','Mitteilung des Käufers über einen Mangel. Beim zweiseitigen Handelskauf unverzüglich, sonst innerhalb der Gewährleistung von 2 Jahren.'],
 ['Maximalprinzip','Mit gegebenen Mitteln den größtmöglichen Erfolg erzielen.'],
 ['Minimalprinzip','Ein bestimmtes Ziel mit möglichst geringem Mitteleinsatz erreichen.'],
 ['Mindestreserve','Banken müssen einen Teil ihrer Einlagen (derzeit 1 Prozent) bei der Zentralbank halten. Höherer Satz verknappt das Geld.'],
 ['Monopol','Ein Anbieter steht vielen Nachfragern gegenüber.'],
 ['Mutterschutz','6 Wochen vor der Geburt (freiwillig arbeiten erlaubt) und 8 Wochen danach (absolutes Beschäftigungsverbot). Kündigungsschutz bis 4 Monate nach der Geburt.'],
 ['Nachfrageüberhang','Der Preis liegt unter dem Gleichgewichtspreis: Es wird mehr nachgefragt als angeboten. Folge: Der Preis steigt.'],
 ['Nichtigkeit','Ein Rechtsgeschäft ist von Anfang an unwirksam, z. B. bei Geschäftsunfähigen, Formmangel oder Scheingeschäft.'],
 ['Oligopol','Wenige Anbieter teilen sich den Markt.'],
 ['Offenmarktpolitik','Die EZB kauft oder verkauft Wertpapiere bzw. vergibt Kredite an Banken über Tender.'],
 ['Polypol','Viele Anbieter und viele Nachfrager, kein einzelner hat Marktmacht.'],
 ['Preiselastizität','Prozentuale Mengenänderung geteilt durch prozentuale Preisänderung.'],
 ['Probezeit','Bei Ausbildung 1 bis 4 Monate. Kündigung jederzeit ohne Frist und ohne Grund, aber schriftlich.'],
 ['Rechtsfähigkeit','Fähigkeit, Träger von Rechten und Pflichten zu sein. Beginnt mit der Geburt.'],
 ['Rezession','Abschwung, oft definiert als zwei Quartale in Folge mit sinkendem realem BIP.'],
 ['Schenkung','Zweiseitiges Rechtsgeschäft, aber einseitig verpflichtender Vertrag.'],
 ['Sozialversicherung','Kranken-, Pflege-, Renten-, Arbeitslosen- und Unfallversicherung. Die Unfallversicherung zahlt nur der Arbeitgeber.'],
 ['Spitzenrefinanzierungsfazilität','Banken leihen sich über Nacht Geld bei der Zentralbank. Der Zins bildet die Obergrenze am Geldmarkt.'],
 ['Stabilitätsgesetz','Magisches Viereck: stabiles Preisniveau, hoher Beschäftigungsstand, außenwirtschaftliches Gleichgewicht, stetiges und angemessenes Wachstum.'],
 ['Stagflation','Stagnation der Wirtschaft bei gleichzeitig hoher Inflation.'],
 ['Tarifvertrag','Vertrag zwischen Gewerkschaft und Arbeitgeberverband. Manteltarif regelt Arbeitsbedingungen, Lohntarif die Vergütung. Während der Laufzeit gilt Friedenspflicht.'],
 ['Taschengeldparagraf','Beschränkt Geschäftsfähige können Verträge wirksam schließen, wenn sie mit eigenen, dafür überlassenen Mitteln sofort bezahlen.'],
 ['Unelastisch','Die Nachfrage reagiert kaum auf den Preis (Elastizität kleiner als 1), z. B. Grundnahrungsmittel. Preiserhöhung steigert den Umsatz.'],
 ['Verbraucherpreisindex','Misst die Preisentwicklung eines Warenkorbs, den private Haushalte kaufen.'],
 ['Verjährung','Regelmäßige Frist 3 Jahre, Beginn am Ende des Jahres, in dem der Anspruch entstanden ist.'],
 ['Versicherungspflichtgrenze','Wer mehr verdient, darf in die private Krankenversicherung wechseln.'],
 ['Willenserklärung','Äußerung, die auf eine Rechtsfolge gerichtet ist. Kann ausdrücklich, durch schlüssiges Handeln oder selten durch Schweigen erfolgen.'],
 ['Wirtschaftskreislauf','Geld- und Güterströme zwischen Haushalten, Unternehmen, Staat, Banken und Ausland.'],
 ['Zahlungsbilanz','Erfasst alle wirtschaftlichen Transaktionen zwischen Inland und Ausland in einem Zeitraum.'],
 ['Zahlungsverzug','Spätestens 30 Tage nach Fälligkeit und Rechnungszugang. Verbraucher nur, wenn in der Rechnung darauf hingewiesen wurde.']
];

/* Formeln */
const FORMELN=[
 ['Preiselastizität der Nachfrage','Δ Menge in % ÷ Δ Preis in %','Preis +10 %, Menge −20 % → 2,0 (elastisch)'],
 ['Einkommenselastizität','Δ Menge in % ÷ Δ Einkommen in %','Einkommen +5 %, Nachfrage +10 % → 2,0'],
 ['Kreuzpreiselastizität','Δ Menge Gut A in % ÷ Δ Preis Gut B in %','Positiv: Ersatzgüter, negativ: Ergänzungsgüter'],
 ['Umsatz','Preis × Menge','2,50 EUR × 1.000 Stück = 2.500 EUR'],
 ['Inflationsrate','(VPI neu − VPI alt) ÷ VPI alt × 100','(105,1 − 102,0) ÷ 102,0 × 100 = 3,04 %'],
 ['Reales Wachstum (Näherung)','nominales Wachstum − Inflationsrate','BIP nominal +6 %, Inflation 4 % → real etwa +2 %'],
 ['Reallohn (Näherung)','Nominallohnänderung − Inflationsrate','Lohn +3 %, Inflation 5 % → Reallohn etwa −2 %'],
 ['Arbeitslosenquote','Arbeitslose ÷ (Erwerbstätige + Arbeitslose) × 100','2,6 Mio ÷ 46,6 Mio × 100 = 5,6 %'],
 ['Kaufkraft','100 ÷ Preisindex × 100','Index 125 → Kaufkraft 80 % des Basisjahres'],
 ['Mindestreserve','reservepflichtige Einlagen × 1 % − Freibetrag','Freibetrag 100.000 EUR je Bank'],
 ['Zinsen','Kapital × Zinssatz × Tage ÷ (100 × 360)','10.000 EUR × 4 × 90 ÷ 36.000 = 100 EUR'],
 ['Verzugszins','Basiszinssatz + 5 (Verbraucher) bzw. + 9 Prozentpunkte (Unternehmen)','Basis 1,27 % + 9 = 10,27 %'],
 ['Produktivität','Ausbringung ÷ Einsatz','500 Stück ÷ 100 Stunden = 5 Stück je Stunde'],
 ['Wirtschaftlichkeit','Ertrag ÷ Aufwand','größer als 1 heißt wirtschaftlich'],
 ['Rentabilität','Gewinn ÷ Kapital × 100','50.000 ÷ 400.000 × 100 = 12,5 %'],
 ['Lohnquote','Arbeitnehmerentgelt ÷ Volkseinkommen × 100','zeigt den Anteil der Löhne am Volkseinkommen'],
 ['Wechselkurs (Mengennotierung)','Betrag in Fremdwährung ÷ Kurs = EUR','11.000 USD ÷ 1,10 = 10.000 EUR'],
 ['Staatsquote','Staatsausgaben ÷ BIP × 100','Anteil des Staates an der Wirtschaftsleistung']
];

/* Prüfungstipps */
const TIPPS=[
 ['⏱','60 Minuten, 28 Aufgaben','Etwa 2 Minuten je Aufgabe. Hängst du fest: markieren, weiter, am Ende zurück.'],
 ['🔍','Lies das Wort „nicht“','Viele Aufgaben fragen nach der FALSCHEN Aussage. Unterstreich „nicht“ und „falsch“.'],
 ['✂️','Ausschlussprinzip','Streich erst, was sicher falsch ist. Oft bleiben nur zwei Antworten übrig.'],
 ['🔢','Zuordnungen zählen','Bei Ziffernaufgaben: Jede Ziffer kann mehrfach oder gar nicht vorkommen. Lies genau, was gefragt ist.'],
 ['🧮','Rechnen zuletzt','Rechenaufgaben kosten Zeit. Mach erst die schnellen Punkte, dann rechnen.'],
 ['📝','Lösungsbogen','Übertrag die Lösungen sofort, nicht erst am Ende. Am Ende fehlt sonst die Zeit.'],
 ['🎯','Keine Lücke lassen','Falsch kostet nicht mehr als leer. Rate lieber, als nichts einzutragen.'],
 ['📅','Datumsaufgaben','Fristen genau zählen: Beginnt der Tag mit, endet sie zum Monatsende, Wochenende oder Feiertag?'],
 ['🧠','Erst die Situation','Lies die Ausgangslage. Oft steckt die Lösung im Alter, im Datum oder im Betrag.'],
 ['😮‍💨','Atmen','Panik bei einer Aufgabe? Kurz durchatmen, weiter zur nächsten. Eine Aufgabe sind nur 3,57 Punkte.'],
 ['💧','Wasser und Traubenzucker','Kopf braucht Energie. Kurz trinken hilft wirklich.'],
 ['✅','Bestehen','In WiSo reichen 50 Punkte für die 4. Das sind 14 von 28 Aufgaben.']
];

/* Erfolge */
const ACHV=[
 ['erste','🎬','Erste Schritte','Erste Lektion geschafft',s=>Object.keys(s.done).length>=1],
 ['l5','📗','Fleißig','5 Lektionen geschafft',s=>Object.keys(s.done).length>=5],
 ['l10','📘','Streber','10 Lektionen geschafft',s=>Object.keys(s.done).length>=10],
 ['l20','📕','Bücherwurm','20 Lektionen geschafft',s=>Object.keys(s.done).length>=20],
 ['lalle','📚','Komplett','Alle Lektionen geschafft',s=>Object.keys(s.done).length>=ANZ_LEK],
 ['drei','⭐','Fehlerfrei','Eine Lektion mit 3 Sternen',s=>Object.values(s.done).some(v=>v>=3)],
 ['sterne30','🌟','Sternenhimmel','30 Sterne gesammelt',s=>Object.values(s.done).reduce((a,b)=>a+b,0)>=30],
 ['boss1','👔','Prüferschreck','Ersten Prüfer besiegt',s=>Object.keys(s.boss).length>=1],
 ['boss3','🥊','Prüferjäger','3 Prüfer besiegt',s=>Object.keys(s.boss).length>=3],
 ['boss6','🏆','Endgegner','Alle 6 Prüfer besiegt',s=>Object.keys(s.boss).length>=6],
 ['exam','🎓','Bestanden','Eine echte Prüfung bestanden',s=>Object.values(s.exam).some(n=>n<=4)],
 ['note1','💯','Einser','Note 1 in einer echten Prüfung',s=>Object.values(s.exam).some(n=>n<=1)],
 ['exam6','🗂️','Archivar','Alle 6 Prüfungen geschrieben',s=>Object.keys(s.exam).length>=6],
 ['serie10','🔥','Heiß','10 richtige in Folge',s=>s.best>=10],
 ['serie25','☄️','Feuerball','25 richtige in Folge',s=>s.best>=25],
 ['serie50','🌋','Vulkan','50 richtige in Folge',s=>s.best>=50],
 ['streak3','📅','Dranbleiber','3 Tage Lernserie',s=>s.streak.max>=3],
 ['streak7','🗓️','Wochenkrieger','7 Tage Lernserie',s=>s.streak.max>=7],
 ['n100','💪','Hundert','100 Aufgaben beantwortet',s=>s.zahl.n>=100],
 ['n500','🦾','Maschine','500 Aufgaben beantwortet',s=>s.zahl.n>=500],
 ['alle','👀','Alles gesehen','Alle Aufgaben einmal gesehen',s=>Object.keys(s.seen).length>=AUFG.length],
 ['eule','🦉','Nachteule','Nach 23 Uhr gelernt',s=>s.flags.eule],
 ['frueh','🐓','Frühaufsteher','Vor 7 Uhr gelernt',s=>s.flags.frueh],
 ['blitz10','⚡','Blitzmerker','10 richtige in einer Blitzrunde',s=>s.rek.blitz>=10],
 ['blitz20','🌩️','Lichtgeschwindigkeit','20 richtige in einer Blitzrunde',s=>s.rek.blitz>=20],
 ['surv15','🧟','Überlebender','15 im Survival-Modus',s=>s.rek.surv>=15],
 ['daily','📆','Challenger','Eine Tages-Challenge geschafft',s=>Object.keys(s.daily).length>=1],
 ['fehler10','🩹','Fehlerkiller','10 Fehler im Fehlertraining ausgebügelt',s=>s.zahl.fix>=10],
 ['shop','🛍️','Shopping-Queen','Erstes Teil im Shop gekauft',s=>s.owned.length>=1],
 ['reich','💰','Bonze','500 Knete auf einmal',s=>s.knete>=500],
 ['lvl5','🎖️','Level 5','Level 5 erreicht',s=>lvl(s.xp)>=5],
 ['lvl10','🏅','Level 10','Level 10 erreicht',s=>lvl(s.xp)>=10],
 ['lvl25','👑','Level 25','Level 25 erreicht',s=>lvl(s.xp)>=25],
 ['finger50','🖕','Abgehärtet','50 Mittelfinger kassiert',s=>s.zahl.finger>=50],
 ['liga','🥇','Ligasieger','Platz 1 in der Liga',s=>s.flags.liga1],
 ['karten20','🃏','Kartenhai','20 Lernkarten gelernt',s=>s.zahl.karten>=20],
 ['tipp','💡','Neugierig','Alle Prüfungstipps gelesen',s=>s.flags.tipps],
 ['schnell','🏎️','Raser','10 schnelle Antworten unter 10 Sekunden',s=>s.zahl.schnell>=10]
];
const lvl=xp=>Math.floor(Math.sqrt(xp/40))+1;
const lvlXp=l=>40*(l-1)*(l-1);

/* Shop */
const SHOP=[
 {id:'hut-party',typ:'hut',e:'🥳',name:'Partyhut',p:40,ov:'🎉'},
 {id:'hut-cap',typ:'hut',e:'🧢',name:'Cap',p:60,ov:'🧢'},
 {id:'hut-zylinder',typ:'hut',e:'🎩',name:'Zylinder',p:120,ov:'🎩'},
 {id:'hut-doktor',typ:'hut',e:'🎓',name:'Doktorhut',p:150,ov:'🎓'},
 {id:'hut-krone',typ:'hut',e:'👑',name:'Krone',p:300,ov:'👑'},
 {id:'hut-helm',typ:'hut',e:'⛑️',name:'Rettungshelm',p:90,ov:'⛑️'},
 {id:'acc-koffer',typ:'acc',e:'💼',name:'Aktenkoffer',p:80,ov:'💼'},
 {id:'acc-geld',typ:'acc',e:'💸',name:'Geldbündel',p:100,ov:'💸'},
 {id:'acc-kaffee',typ:'acc',e:'☕',name:'Kaffee',p:50,ov:'☕'},
 {id:'acc-pokal',typ:'acc',e:'🏆',name:'Pokal',p:250,ov:'🏆'},
 {id:'farbe-gold',typ:'farbe',e:'🟡',name:'Klassik Gelb',p:0,ov:'#FFD23F'},
 {id:'farbe-pink',typ:'farbe',e:'🩷',name:'Pink',p:120,ov:'#FF7EB6'},
 {id:'farbe-tuerkis',typ:'farbe',e:'🩵',name:'Türkis',p:120,ov:'#5EEAD4'},
 {id:'farbe-lila',typ:'farbe',e:'💜',name:'Lila',p:150,ov:'#C4A1FF'},
 {id:'farbe-gruen',typ:'farbe',e:'💚',name:'Geldschein-Grün',p:150,ov:'#86EFAC'},
 {id:'farbe-chrom',typ:'farbe',e:'🪩',name:'Chrom',p:400,ov:'#D6DEE8'}
];
const VERBRAUCH=[
 {id:'freeze',e:'🧊',name:'Serien-Schutz',info:'Rettet deine Lernserie, wenn du einen Tag aussetzt.',p:60},
 {id:'boost',e:'⚡',name:'XP-Boost',info:'15 Minuten doppelte XP.',p:80},
 {id:'herz',e:'❤️',name:'Extra-Herz',info:'+1 Herz in deiner nächsten Lektion.',p:30},
 {id:'joker',e:'🃏',name:'50:50-Joker',info:'Streicht zwei falsche Antworten.',p:25}
];

/* Liga */
const LIGEN=['Azubi-Liga','Sachbearbeiter-Liga','Berater-Liga','Filialleiter-Liga','Vorstands-Liga'];
const BOTS=['Kevin aus der Filiale','Zinseszins-Zoe','Bausparfuchs','Dispo-Dieter','Rendite-Rita','Schufa-Schorsch','Tilgungs-Tina','Kredit-Karl','Aktien-Aylin','Girokonto-Gerd','Festgeld-Fiona','Leasing-Lars','Tagesgeld-Tom','Bonität-Bianca'];
