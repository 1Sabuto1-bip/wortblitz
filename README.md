# Wortblitz – Lesetraining für Klasse 3

Eine statische, datensparsame Web-App mit vier Übungen:

- **Blitzwort:** Wort kurz sehen, anschließend wiederfinden und die Suchzeit erfahren.
- **Lesekette:** Ein Zielwort exakt unter ähnlichen Wörtern erkennen.
- **Satzblitz:** Wörter nacheinander kurz sehen, wiedererkennen und fünf vollständige Sätze ordnen. Drei Stufen steuern die Satzlänge.
- **Richtig oder erfunden?:** Echte Wörter von lauttreuen Fantasiewörtern unterscheiden.

Die Kinder benötigen keine Anmeldung. Tagesfortschritt, Sterne und Toneinstellung werden ausschließlich lokal im Browser des jeweiligen Tablets gespeichert. Eigene Wörter liegen gemeinsam in `words.json` und werden von allen Tablets regelmäßig neu geladen.

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

Der Zugriffsschlüssel wird auf dem Lehrergerät mit der PIN verschlüsselt gespeichert. Er wird nicht in das Repository oder auf die Kindergeräte übertragen. Neue Wörter werden über den Adminbereich in `words.json` gespeichert. GitHub Pages benötigt anschließend meist ungefähr ein bis zwei Minuten, bis die Änderung auf allen Tablets abrufbar ist. Die App prüft die gemeinsame Wortliste automatisch jede Minute.

Wenn der Zugriffsschlüssel abläuft oder das Lehrergerät gewechselt wird, kann die Verbindung im Adminbereich neu eingerichtet werden. Die bereits gespeicherten Wörter bleiben dabei erhalten.
