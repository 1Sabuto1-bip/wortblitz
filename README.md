# Wortblitz – Lesetraining für Klasse 3

Eine statische, datensparsame Web-App mit vier Übungen:

- **Blitzwort:** Wort kurz sehen, anschließend wiederfinden und die Suchzeit erfahren.
- **Lesekette:** Ein Zielwort exakt unter ähnlichen Wörtern erkennen.
- **Satzblitz:** Wörter nacheinander kurz sehen, wiedererkennen und fünf vollständige Sätze ordnen.
- **Richtig oder erfunden?:** Echte Wörter von lauttreuen Fantasiewörtern unterscheiden.

Die App benötigt keine Anmeldung und keinen Server. Tagesfortschritt, Sterne und Toneinstellung werden ausschließlich lokal im Browser des jeweiligen Tablets gespeichert.

## Veröffentlichung mit GitHub Pages

1. Ein neues GitHub-Repository anlegen.
2. Alle Dateien aus diesem Ordner in das Repository hochladen.
3. Unter **Settings → Pages** bei **Source** „Deploy from a branch“ wählen.
4. Den Branch `main` und den Ordner `/ (root)` auswählen und speichern.
5. Den anschließend angezeigten GitHub-Pages-Link in Relution oder auf den iPads als WebLink hinterlegen.

Nach dem ersten vollständigen Laden werden die benötigten Dateien zwischengespeichert. Dadurch funktioniert die App anschließend auch bei einer unterbrochenen Internetverbindung.

## Eigene Wörter ergänzen

In `app.js` stehen am Anfang die Listen `WORDS` und `MADE_UP`. Dort können Wörter in Anführungszeichen ergänzt oder ersetzt werden. Erfundenen Wörtern sollte kein echtes deutsches Wort entsprechen.
