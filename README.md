# Feeder

Editor für Social-Media-Grafiken (Formel-E-Ergebnisse, Wertungen, Quali, Rennkalender). Die Grafik wird im
Browser gebaut und per html2canvas als PNG exportiert. Vue 3 + Vite + TypeScript, deployt auf Vercel.

## Entwickeln

Node 22.12 oder neuer (Vercel nutzt 24, siehe `.nvmrc`).

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # Datenprüfung + Typecheck + Build nach dist/
npm test             # Unit-Tests (Datenmatching, Schema)
npm run lint
npm run check:data   # prüft Saison-JSONs und ob alle Flaggen/Autos existieren
npm run optimize:images  # verkleinert zu große Auto-/Flaggenbilder (nach dem Hinzufügen neuer Liveries)
```

## Struktur

```
src/
  views/            Seiten (Landing, Studio, Menüs)
  components/
    studio/         Sidebar, Vorschau, Export-Button
    eformel/        Vorlagen: RankingTemplate (Ergebnisse/Fahrer/Teams), Quali, Schedule
    landing/        Abschnitte der Landing Page
  stores/editor.ts  Pinia: Optionen, CSV-Import, Sidebar-Zustand
  data/             Saison-Daten, Matching, Rennorte (siehe unten)
  app/              Hilfsfunktionen (Export, Bilder, Browser-Speicher, Uploads)
  assets/fonts.css  selbst gehostete Schriften (Karla, Roboto Condensed)
public/img/eformel/ flags/ (Länder + Team-Wappen), cars/ (Liveries), bg/
scripts/            check-data.ts
```

## Daten (das "Backend")

Alles sind JSON-Dateien, kein Server.

- `src/data/seasons/<id>.json`: eine Datei pro Saison mit `teams`, `drivers` und `venues`.
- `src/data/venues.json`: Stichwörter, die aus dem Text eines Rennorts ("Berlin E-Prix") die Flagge ableiten.
  Die Reihenfolge zählt, der erste Treffer gewinnt.
- `src/data/seasons.ts`: `CURRENT_SEASON_ID` bestimmt die Saison der Vorlagen.

Beim Eintippen eines Namens (oder beim CSV-Import) wird in der aktuellen Saison gesucht. Gefunden wird nach
vollem Namen, Kürzel (`VAN`), Startnummer, Teamname oder Teil eines Namens, ohne auf Groß-/Kleinschreibung
oder Umlaute zu achten (`Mueller` und `Muller` finden `Nico Müller`).

### Neue Saison anlegen

1. `src/data/seasons/s14.json` anlegen, am einfachsten durch Kopieren der vorherigen Saison.
2. Teams: `crest` ist die Datei in `public/img/eformel/flags/<crest>.png`, `car` die Datei in
   `public/img/eformel/cars/<car>.png`. Eine Sonderlackierung ist nur ein anderer Wert bei `car`
   (z. B. `porsche_berlin`), die Bilder müssen nicht mehr umbenannt werden.
3. Fahrer: `team` verweist auf die `id` eines Teams, `country` auf eine Flagge.
4. `CURRENT_SEASON_ID` in `src/data/seasons.ts` auf `s14` setzen.
5. Neue Auto-/Flaggenbilder einfach in `public/img/eformel/cars|flags` legen und `npm run optimize:images` ausführen
   (macht sie auf eine sinnvolle Größe klein).
6. `npm run check:data`. Fehlende Bilder oder falsche Verweise in der aktuellen Saison sind Fehler und stoppen
   auch den Build, bei älteren Saisons nur Warnungen.

## Export

Der PNG-Export rendert in 2-facher Größe (1024-px-Layout wird zu 2048 px). Eingabefelder werden dafür im Export
durch normalen Text ersetzt (`src/app/export.ts`), weil html2canvas sie sonst ohne Großschreibung und falsch
ausgerichtet zeichnet.

## Bekannte Altlasten

- Die Demo liest noch `public/json/eformel_202021.json` (altes Format).
- `public/img/eformel/drivers` und `bg` werden vom Code nicht mehr benutzt.
- Die Demo-Tabelle nutzt TheSportsDB, das inzwischen einen Premium-Key verlangt.
- Im Eformel-Menü fehlen Vorschaubilder für Fahrerwertung, Teamwertung und Rennkalender.
