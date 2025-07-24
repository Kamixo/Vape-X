# Vape-X Liquidrechner - Lokale Einrichtung auf macOS

## Voraussetzungen

Bevor du beginnst, stelle sicher, dass folgende Software auf deinem Mac installiert ist:

### 1. Homebrew (Paketmanager für macOS)
Falls noch nicht installiert, öffne das Terminal und führe aus:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Python 3.11 oder höher
```bash
brew install python@3.11
```

### 3. Git (sollte bereits installiert sein)
```bash
git --version
```
Falls nicht installiert:
```bash
brew install git
```

### 4. MySQL Client Library
```bash
brew install mysql-client
```

## Projekt einrichten

### Schritt 1: Repository klonen
```bash
# Navigiere zu deinem gewünschten Arbeitsverzeichnis
cd ~/Desktop  # oder ein anderer Ordner deiner Wahl

# Klone das Repository
git clone https://github.com/Kamixo/Vape-X.git

# Wechsle in das Projektverzeichnis
cd Vape-X
```

### Schritt 2: Virtuelle Umgebung erstellen und aktivieren
```bash
# Erstelle eine virtuelle Python-Umgebung
python3.11 -m venv venv

# Aktiviere die virtuelle Umgebung
source venv/bin/activate

# Du solltest jetzt "(venv)" am Anfang deiner Terminal-Zeile sehen
```

### Schritt 3: Abhängigkeiten installieren
```bash
# Installiere alle benötigten Python-Pakete
pip install -r requirements.txt

# Falls requirements.txt nicht vollständig ist, installiere manuell:
pip install Flask Flask-SQLAlchemy Flask-CORS PyMySQL Flask-JWT-Extended
```

### Schritt 4: Umgebungsvariablen setzen (optional)
```bash
# Setze den Python-Pfad für die Imports
export PYTHONPATH=$PYTHONPATH:$(pwd)
```

### Schritt 5: Anwendung starten
```bash
# Starte den Flask-Server
python src/main.py
```

Du solltest eine Ausgabe wie diese sehen:
```
* Serving Flask app 'main'
* Debug mode: on
* Running on all addresses (0.0.0.0)
* Running on http://127.0.0.1:5000
* Running on http://[deine-lokale-IP]:5000
```

### Schritt 6: Anwendung im Browser öffnen
Öffne deinen Browser und gehe zu:
```
http://127.0.0.1:5000
```

Du solltest jetzt deinen Liquidrechner sehen!

## API-Endpunkte testen

### Test-Endpunkt
```
GET http://127.0.0.1:5000/api/test
```

### Benutzerregistrierung
```
POST http://127.0.0.1:5000/api/user/register
Content-Type: application/json

{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpassword"
}
```

### Benutzer-Login
```
POST http://127.0.0.1:5000/api/user/login
Content-Type: application/json

{
    "username": "testuser",
    "password": "testpassword"
}
```

## Fehlerbehebung

### Problem: "ModuleNotFoundError"
```bash
# Stelle sicher, dass die virtuelle Umgebung aktiviert ist
source venv/bin/activate

# Setze den Python-Pfad
export PYTHONPATH=$PYTHONPATH:$(pwd)
```

### Problem: "MySQL connection error"
- Überprüfe deine Internetverbindung
- Stelle sicher, dass die Datenbankzugangsdaten korrekt sind

### Problem: "Port already in use"
```bash
# Finde den Prozess, der Port 5000 verwendet
lsof -i :5000

# Beende den Prozess (ersetze PID mit der tatsächlichen Prozess-ID)
kill -9 PID
```

## Entwicklung

### Änderungen am Code
- Frontend-Dateien befinden sich in `src/static/`
- Backend-Code befindet sich in `src/`
- Nach Änderungen am Backend: Stoppe den Server (Ctrl+C) und starte ihn neu

### Git-Workflow
```bash
# Änderungen hinzufügen
git add .

# Commit erstellen
git commit -m "Beschreibung der Änderungen"

# Änderungen zu GitHub pushen
git push origin main
```

## Stoppen der Anwendung
Drücke `Ctrl+C` im Terminal, um den Flask-Server zu stoppen.

## Virtuelle Umgebung deaktivieren
```bash
deactivate
```

---

Bei Problemen oder Fragen, melde dich gerne!

