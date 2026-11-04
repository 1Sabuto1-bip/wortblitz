# Wortblitz – Lesetraining für Klasse 2 bis 4

Eine statische, datensparsame Web-App mit sechs Übungen:

- **Blitzwort:** 20 Wörter mit vier Schwierigkeitsstufen. Anzeigedauer und Auswahlmenge steigen von vier auf sechs Wörter.
- **Lesekette:** Zehn Wörter nacheinander aus jeweils zwölf Möglichkeiten erkennen. Ein Fehler setzt die Kette zurück; Fehlversuche werden ausgewertet.
- **Satzblitz:** Wörter nacheinander kurz sehen, wiedererkennen und fünf vollständige Sätze ordnen. Drei Stufen steuern die Satzlänge.
- **Richtig oder erfunden?:** Echte Wörter von lauttreuen Fantasiewörtern unterscheiden.
- **Silbenschwingen:** Unter zehn möglichst breit dargestellten Wörtern mit dem Finger alle Silbenbögen verbunden in einem Zug zeichnen. Die äußeren Enden dürfen versetzt sein; die inneren Hochpunkte müssen an der tatsächlichen Silbengrenze liegen (mit Toleranz innerhalb eines Buchstabens). Drei Stufen steuern die Wortlänge; alle Vokale werden blau markiert.
- **Anlaut-Geheimwort:** Bildsymbole drehen sich wie Spielautomatenwalzen und stoppen der Reihe nach. Nach dem lauten Lesen deckt das Kind die Lösung auf und bewertet sich selbst. Wählbar sind 3, 4 oder 5 Lautbilder; `au`, `ei`, `eu`, `sch` usw. belegen jeweils nur ein Feld. Jede Länge hat 20 verschiedene kindgerechte Wörter. Die Kinder-App wählt zehn davon pro Runde; an der Tafel erscheinen alle 20 ohne Wiederholung, bevor die Liste neu gemischt wird.

Auf der Startseite mit der Namenseingabe führt **Tafelversion** in einen eigenen Bereich ohne Kinderprofil. Dort ist zunächst **Anlaut-Geheimwort** verfügbar: besonders große Bildkarten, Auswahl von 3/4/5 Lautbildern, optionale Lösungsanzeige und beliebig viele weitere Wörter. Weitere Tafelspiele können später im selben Bereich ergänzt werden. Auch aus der Kinder-Startseite ist die Tafelversion erreichbar. Die Tafelrunde verändert weder Punkte noch Kinderstatistik.

Die 34 verwendeten Lautbilder sind ausschließlich aus der zuletzt bereitgestellten Bildvorlage ausgeschnitten und für die Anzeige auf Tablets und an der Tafel vergrößert. **O** zeigt den Holzofen. Die Vorlage enthält keinen eindeutig passenden Gegenstand für **J**; der Schulranzen wird deshalb nicht als J-Bild angezeigt. Alle 50 Einzelmotive sind außerdem als separates ZIP verfügbar.

Zu Beginn gibt jedes Kind seinen Namen und seine Klassenstufe (2, 3 oder 4) ein. Alle Wortspiele greifen anschließend auf einen passenden Grundwortschatz und die zusätzlichen Wörter dieser Klassenstufe zu. Name, Klasse, Gesamtpunkte, Tagesfortschritt und Toneinstellung werden ausschließlich lokal im Browser des jeweiligen Tablets gespeichert. Der Reset-Knopf löscht nur dieses Kinderprofil; Adminzugang und gemeinsame Wortlisten bleiben erhalten. Eigene Wörter liegen nach Klassen getrennt in `words.json` und werden von allen Tablets regelmäßig neu geladen.

## Veröffentlichung mit GitHub Pages

1. Ein neues GitHub-Repository anlegen.
2. Alle Dateien aus diesem Ordner in das Repository hochladen.
3. Unter **Settings → Pages** bei **Source** „Deploy from a branch“ wählen.
4. Den Branch `main` und den Ordner `/ (root)` auswählen und speichern.
5. Den anschließend angezeigten GitHub-Pages-Link in Relution oder auf den iPads als WebLink hinterlegen.

Nach dem ersten vollständigen Laden werden die benötigten Dateien zwischengespeichert. Dadurch funktioniert die App anschließend auch bei einer unterbrochenen Internetverbindung.

Die Anlautsymbole stammen aus einer Buchvorlage. Vor einer öffentlichen Veröffentlichung der Bilddateien über GitHub Pages die Bildrechte für diesen Einsatz klären. Für den Betrieb muss der Ordner `anlaute/` mit hochgeladen werden.

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
