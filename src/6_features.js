/* ===================== Crashkurs IHK · Funktionsliste ===================== */
const FEATURES=[
 ['📚 Inhalte',[
  '168 echte IHK-Aufgaben aus 6 WiSo-Prüfungen','Prüfung Winter 2021/22','Prüfung Sommer 2022','Prüfung Winter 2023/24','Prüfung Sommer 2024','Prüfung Winter 2024/25','Prüfung Sommer 2025',
  'Lösungen aus den offiziellen Lösungsbögen','Erklärung zu jeder Aufgabe in einfachen Worten','Merksatz in jeder Erklärung','Quelle an jeder Aufgabe (Prüfung und Nummer)',
  '6 Bereiche in der Reihenfolge der echten Prüfung','Spickzettel für alle 6 Bereiche','Glossar mit über 60 Begriffen von A bis Z','Suche im Glossar',
  '18 Formeln mit Rechenbeispiel','12 Prüfungstipps für den Prüfungstag','Fun Facts von Crashi','Rechenweg bei Rechenaufgaben','Hinweis bei überholtem Rechtsstand']],
 ['✍️ Aufgabenarten',[
  'Eine richtige Antwort wählen','Mehrere richtige Antworten wählen','Zuordnen per Ziehen mit dem Finger','Zuordnen per Antippen (erst Nummer, dann Fall)','Zuordnung wieder lösen durch Antippen',
  'Reihenfolge per Ziehen sortieren','Reihenfolge mit Pfeilen ▲▼ sortieren','Rechenaufgaben mit Zahlenfeld','Komma oder Punkt beim Rechnen erlaubt','Zahlentastatur auf dem iPhone',
  'Richtige Lösung grün, falsche rot markiert','Bei Zuordnung: falsche Ziffer durchgestrichen mit Korrektur','Vollständige Lösung bei falscher Antwort','Wackeln, wenn noch nichts gewählt ist']],
 ['🗺️ Lernpfad',[
  'Lernpfad wie bei Duolingo','28 Lektionen mit je etwa 6 Aufgaben','Lektionen nach Thema sortiert','6 Abschnitte mit eigener Farbe','Fortschrittsbalken je Abschnitt',
  'Trefferquote je Abschnitt','Prüfer-Boss am Ende jedes Abschnitts','Echte IHK-Prüfung am Ende des Pfads','START-Markierung an der aktuellen Lektion','Crashi steht an deiner aktuellen Lektion',
  'Automatisches Scrollen zur aktuellen Lektion','Goldene Knoten für geschaffte Lektionen','Krone bei 3 Sternen','Sterne unter jeder Lektion','Lektionsmenü mit Spickzettel und Lernkarten',
  'Anzeige, aus welchen Prüfungen eine Lektion stammt','Weiterlernen-Knopf springt zur nächsten Lektion','Pfad passt sich der Bildschirmbreite an']],
 ['🎯 Lernmodi',[
  'Lektion mit 3 Herzen','Prüfer-Boss mit 8 Fragen','Echte Prüfung mit Erklärungen','Gemischte Prüfung mit 28 Zufallsaufgaben','Prüfungssimulation: 28 Aufgaben in 60 Minuten ohne Hilfe',
  'Blitzrunde: 60 Sekunden so viele wie möglich','Survival: so lange, bis 3 Fehler passieren','Tages-Challenge: 10 Aufgaben, für alle gleich','Fehlertraining mit allen falschen Aufgaben',
  'Wiederholen nach Lernkurve (Spaced Repetition)','Schwächen-Training mit deinen 3 schwächsten Themen','Lernkarten zum Umdrehen','Lernkarten nach rechts und links wischen',
  'Zufallsmix mit 10 Aufgaben','Favoriten üben','Themen-Training für jedes Thema','Nur Rechenaufgaben','Nur Zuordnungen','Nur Reihenfolgen','Bereich gezielt trainieren',
  'Einzelaufgabe aus der Suche öffnen','Neue Aufgaben kommen zuerst','Lernkarten aus einer Lektion']],
 ['🎮 Spielspaß',[
  'XP für jede richtige Antwort','Combo x2 ab 3 richtigen in Folge','Combo x3 ab 5 richtigen in Folge','Schnell-Bonus unter 10 Sekunden','Level mit wachsender XP-Kurve','Level-up-Animation',
  'Herzen in Lektionen','Herz zerplatzt bei Fehler','Bis zu 3 Sterne je Lektion','Lernserie in Tagen','Rekord-Serie','Serien-Schutz rettet verpasste Tage','Tagesziel mit Ring',
  'Tagesziel wählbar: 20, 50, 100 oder 150 XP','Tagesziel-Feier','Belohnungskiste nach jeder Lektion','Kiste mit Knete, Joker, Serien-Schutz oder XP-Boost',
  'Knete als Spielwährung','Knete für richtige Antworten','Bonus-Knete für 3 Sterne','Bonus-Knete für Bosse','Bonus-Knete für bestandene Prüfungen','Bonus-Knete für die Tages-Challenge',
  'XP-Boost mit doppelten XP','50:50-Joker','Tipp-Funktion gegen Knete','Extra-Herz','Rekorde für Blitzrunde und Survival','Note nach IHK-Schlüssel am Ende jeder Prüfung',
  'Fehlerliste mit Lösung am Ende','Zähler, wie viele XP und Knete du geholt hast']],
 ['😎 Figuren',[
  'Crashi, der Crashtest-Dummy','6 Gesichter: fröhlich, wütend, geschockt, frech, cool, müde','Crashi blinzelt','Crashi wippt','Mittelfinger bei Fehlern','Gesten für richtige Antworten',
  'Sprüche für richtige Antworten','Sprüche für falsche Antworten','Sprüche für Combos','Sprüche für schnelle Antworten','Sprüche je Tageszeit','Crashi schläft nachts',
  'Crashi antippen für Sprüche und Fun Facts','Der Prüfer als Boss','Prüfer wird k.o. geschlagen','Prüfer lacht, wenn du verlierst','Begrüßung mit deinem Namen']],
 ['🛍️ Shop und Outfits',[
  'Shop mit Hüten, Accessoires und Farben','6 Hüte für Crashi','4 Accessoires','6 Farben für Crashi','Outfits an- und ausziehen','Outfit überall sichtbar',
  '4 Power-ups zum Kaufen','Inventar im Profil','Kauf-Animation mit Kassenklingeln']],
 ['🏅 Erfolge und Liga',[
  '38 Erfolge zum Freischalten','20 Knete je Erfolg','Erfolgs-Meldung mit Ton','Datum des Freischaltens','Gesperrte Erfolge mit Schloss',
  'Wöchentliche Liga','5 Ligen von Azubi bis Vorstand','Aufstieg für Platz 1 bis 3','Abstieg für die letzten 3','Liga-Gegner mit Bankernamen','Countdown bis Ligaende','Wochen-XP-Wertung']],
 ['📊 Statistik',[
  'Notenprognose aus deinen letzten Antworten','XP heute mit Ring','Lernserie und Rekord','Trefferquote gesamt','Lernzeit in Minuten','Gesehene Aufgaben','Sterne und besiegte Bosse',
  'Säulendiagramm der letzten 7 Tage','Lernkalender der letzten 5 Wochen','Trefferquote je Bereich','Trefferquote je Aufgabentyp','Deine 5 schwächsten Themen','Deine 3 stärksten Themen',
  'Direkt-Training für schwache Themen','Beste Note je echter Prüfung','Rekorde-Übersicht','Zähler für kassierte Mittelfinger','Statistik je Aufgabe im Hintergrund']],
 ['🔍 Werkzeuge',[
  'Volltextsuche über alle Aufgaben','Trefferzahl in der Suche','Status je Treffer (richtig oder falsch)','Aufgaben merken mit Stern','Aufgabe vorlesen lassen','Erklärung vorlesen lassen',
  'Countdown bis zur Prüfung','Prüfungsdatum einstellbar','Fortschritt kopieren','Fortschritt auf anderem Gerät einfügen','Alles zurücksetzen mit Sicherheitsfrage','App teilen']],
 ['🎨 Design',[
  'Liquid-Glass-Look','Bewegte Farbflächen im Hintergrund','Dunkelmodus','Automatisch hell oder dunkel nach iPhone-Einstellung','3 Schriftgrößen','Glanzstreifen über Knöpfe',
  'Seitenübergänge','Karten fliegen herein','Antworten erscheinen nacheinander','Knoten hüpfen in den Pfad','Startbildschirm mit Crash-Animation','Buchstaben knallen ins Bild',
  'Konfetti','Fliegende Emojis','XP fliegen in die Leiste','Bildschirm wackelt bei Fehlern','Farbblitz bei richtig und falsch','Große Einblendungen für Combo, Level und Boss','Zahlen zählen hoch',
  'Lernkarten drehen sich in 3D','Wisch-Animation bei Lernkarten']],
 ['📱 iPhone 17 Pro',[
  'Tab-Leiste unten wie eine echte App','4 Bereiche: Pfad, Üben, Statistik, Profil','Zähler für offene Fehler an der Tab-Leiste','Platz für Dynamic Island und Home-Leiste',
  'Optimiert für 402 Punkte Breite','Große Tippflächen','Kein Zoomen beim Tippen','Kein Text-Markieren aus Versehen','Bottom-Sheets mit Griff','Sheets nach unten wegwischen',
  'Vibration beim Tippen (iPhone mit iOS 18)','Als App auf den Home-Bildschirm','Eigenes App-Symbol','Läuft offline nach dem ersten Öffnen','Hinweis bei neuer Version',
  'Musik stoppt, wenn die App im Hintergrund ist','Tastatur-Kürzel 1 bis 9 und Enter fürs iPad']],
 ['🔊 Sound',[
  'Münzklang bei richtig','Trauriges Posaunen-Wah-Wah bei falsch','Plattenkratzer beim Mittelfinger','Airhorn bei Combo','Fanfare beim Sieg','Crash beim Start','Kassenklingeln im Shop',
  'Tick-Tack in den letzten 5 Sekunden','Kistenöffnen-Sound','Erfolgs-Jingle','Sound für Schnell-Bonus','Klick-Sounds','Lo-Fi-Hintergrundmusik','Ton an und aus']],
 ['⚙️ Einstellungen',[
  'Soundeffekte an oder aus','Musik an oder aus','Vibration an oder aus','Animationen an oder aus','Mittelfinger-Modus oder jugendfrei','Design: automatisch, hell, dunkel',
  'Schriftgröße','Tagesziel','Prüfungsdatum','Name ändern','Willkommens-Einrichtung beim ersten Start','Neuigkeiten nach Updates','Fortschritt bleibt auf dem Gerät gespeichert']]
];
