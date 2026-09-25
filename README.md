# Wortblitz – Lesetraining für Klasse 2 bis 4

Eine statische, datensparsame Web-App mit fünf Übungen:

- **Blitzwort:** 20 Wörter mit vier Schwierigkeitsstufen. Anzeigedauer und Auswahlmenge steigen von vier auf sechs Wörter.
- **Lesekette:** Zehn Wörter nacheinander aus jeweils zwölf Möglichkeiten erkennen. Ein Fehler setzt die Kette zurück; Fehlversuche werden ausgewertet.
- **Satzblitz:** Wörter nacheinander kurz sehen, wiedererkennen und fünf vollständige Sätze ordnen. Drei Stufen steuern die Satzlänge.
- **Richtig oder erfunden?:** Echte Wörter von lauttreuen Fantasiewörtern unterscheiden.
- **Silbenschwingen:** Unter zehn möglichst breit dargestellten Wörtern mit dem Finger alle Silbenbögen verbunden in einem Zug zeichnen. Die App prüft die vollständige Breite jeder Silbe sowie die Hochpunkte an den Silbengrenzen. Drei Stufen steuern die Wortlänge; alle Vokale werden blau markiert.

Zu Beginn gibt jedes Kind seinen Namen und seine Klassenstufe (2, 3 oder 4) ein. Alle Wortspiele greifen anschließend auf einen passenden Grundwortschatz und die zusätzlichen Wörter dieser Klassenstufe zu. Name, Klasse, Gesamtpunkte, Tagesfortschritt und Toneinstellung werden ausschließlich lokal im Browser des jeweiligen Tablets gespeichert. Der Reset-Knopf löscht nur dieses Kinderprofil; Adminzugang und gemeinsame Wortlisten bleiben erhalten. Eigene Wörter liegen nach Klassen getrennt in `words.json` und werden von allen Tablets regelmäßig neu geladen.

## Veröffentlichung mit GitHub Pages

1. Ein neues GitHub-Repository anlegen.
2. Alle Dateien aus diesem Ordner in das Repository hochladen.
3. Unter **Settings → Pages** bei **Source** „Deploy from a branch“ wählen.
4. Den Branch `main` und den Ordner `/ (root)` auswählen und speichern.
5. Den anschließend angezeigten GitHub-Pages-Link in Relution oder auf den iPads als WebLink hinterlegen.

Nach dem ersten vollständigen Laden werden die benötigten Dateien zwischengespeichert. Dadurch funktioniert die App anschließend auch bei einer unterbrochenen Internetverbindung.

## Adminzugang einmalig einrichten

1. Bei GitHub unter **Settings → Developer settings → Personal access tokens → Fine-grained tokens** einen neuen Schlüssel erstellen.
2. Als Repository ausschließlich das Wortblitz-Repository auswählen.
3. Unter **Repository permissions** nur **Contents: Read and write** freigeben.
4. Die veröffentlichte Wortblitz-App auf dem Lehrergerät öffnen und oben auf das Schloss tippen.
5. GitHub-Benutzername, Repository, Branch `main`, Zugriffsschlüssel und eine eigene PIN eintragen.

Der Zugriffsschlüssel wird auf dem Lehrergerät mit der PIN verschlüsselt gespeichert. Er wird nicht in das Repository oder auf die Kindergeräte übertragen. Neue Wörter werden über den Adminbereich nach Klassenstufe in `words.json` gespeichert. GitHub Pages benötigt anschließend meist ungefähr ein bis zwei Minuten, bis die Änderung auf allen Tablets abrufbar ist. Die App prüft die gemeinsamen Wortlisten automatisch jede Minute.

## Wörter per CSV importieren

Im Adminbereich zuerst die Klassenstufe wählen und anschließend eine CSV-Datei hochladen. Zwei Formate werden unterstützt:

- Eine Spalte `Wort`: Alle Wörter werden der im Adminbereich gewählten Klasse zugeordnet.
- Zwei Spalten `Klasse;Wort`: Die Datei kann Wörter für Klasse 2, 3 und 4 gleichzeitig enthalten.

Eine passende Beispieldatei lässt sich im Adminbereich über **CSV-Vorlage** herunterladen. Komma, Semikolon und Tabulator werden als Trennzeichen erkannt. Doppelte Wörter und ungültige Zeilen werden übersprungen. Das bisherige Format mit `customWords` wird weiterhin gelesen und beim nächsten Speichern automatisch der Klasse 3 zugeordnet.

Wenn der Zugriffsschlüssel abläuft oder das Lehrergerät gewechselt wird, kann die Verbindung im Adminbereich neu eingerichtet werden. Die bereits gespeicherten Wörter bleiben dabei erhalten.
