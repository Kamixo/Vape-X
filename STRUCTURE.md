# VapeX E-Liquid Calculator - Modulare Ordnerstruktur

## 📁 Übersicht der Architektur

```
/
├── 📁 config/                    # Konfigurationsdateien
├── 📁 core/                      # Kern-System
│   ├── 📁 database/             # Datenbankverbindung & ORM
│   ├── 📁 router/               # URL-Routing System
│   ├── 📁 auth/                 # Authentifizierung Core
│   └── 📁 validation/           # Input-Validierung
├── 📁 modules/                   # Feature-Module (Hauptfunktionen)
│   ├── 📁 auth/                 # 🔐 Benutzer-Authentifizierung
│   ├── 📁 calculator/           # 🧮 E-Liquid Rechner (Herzstück)
│   ├── 📁 aromas/               # 🧪 Aromen-Datenbank & Verwaltung
│   ├── 📁 recipes/              # 📝 Rezept-System & Community
│   ├── 📁 admin/                # ⚙️ Admin-Backend
│   ├── 📁 favorites/            # ⭐ Favoriten-System
│   ├── 📁 ratings/              # ⭐ Bewertungs-System
│   ├── 📁 comments/             # 💬 Kommentar-System
│   └── 📁 users/                # 👤 Benutzer-Profile
├── 📁 assets/                    # Frontend-Ressourcen
│   ├── 📁 css/                  # Stylesheets (Tailwind + Custom)
│   ├── 📁 js/                   # JavaScript-Dateien
│   ├── 📁 images/               # Bilder und Icons
│   └── 📁 fonts/                # Schriftarten (Roboto)
├── 📁 templates/                 # HTML-Templates
│   ├── 📁 layouts/              # Basis-Layouts (Header, Footer)
│   ├── 📁 components/           # Wiederverwendbare Komponenten
│   └── 📁 pages/                # Seiten-Templates
├── 📁 api/                       # RESTful API-Endpunkte
│   └── 📁 v1/                   # API Version 1
│       ├── 📁 auth/             # Authentifizierung API
│       ├── 📁 aromas/           # Aromen API
│       ├── 📁 recipes/          # Rezepte API
│       ├── 📁 calculator/       # Rechner API
│       ├── 📁 admin/            # Admin API
│       ├── 📁 users/            # Benutzer API
│       ├── 📁 favorites/        # Favoriten API
│       ├── 📁 ratings/          # Bewertungen API
│       └── 📁 comments/         # Kommentare API
├── 📁 uploads/                   # Benutzer-Uploads
│   ├── 📁 images/               # Hochgeladene Bilder
│   └── 📁 documents/            # Dokumente & Dateien
├── 📁 logs/                      # System-Logs
├── 📁 cache/                     # Cache-Dateien
├── 📁 migrations/                # Datenbank-Migrations
└── 📄 Root-Dateien              # index.php, .htaccess, etc.
```

## 🎯 Modul-Beschreibungen

### 🔐 AUTH MODULE (modules/auth/)
**Zweck:** Benutzer-Authentifizierung und Session-Management
**Funktionen:**
- Registrierung und Anmeldung
- Passwort-Reset
- Session-Verwaltung
- Berechtigungsprüfung (Public, User, Premium, Admin)

**Dateien:**
- `login.php` - Anmeldelogik
- `register.php` - Registrierung
- `logout.php` - Abmeldung
- `password_reset.php` - Passwort zurücksetzen
- `session_manager.php` - Session-Verwaltung

### 🧮 CALCULATOR MODULE (modules/calculator/)
**Zweck:** E-Liquid Rechner - Herzstück der Anwendung
**Funktionen:**
- Präzise E-Liquid Berechnungen
- VG/PG Verhältnis-Anpassung
- Nikotin-Berechnung
- Aromen-Prozentsatz Optimierung
- Batch-Berechnungen

**Dateien:**
- `calculator.php` - Haupt-Rechner-Logik
- `nicotine_calculator.php` - Nikotin-Berechnungen
- `batch_calculator.php` - Batch-Berechnungen
- `recipe_converter.php` - Rezept-Umrechnungen

### 🧪 AROMAS MODULE (modules/aromas/)
**Zweck:** Aromen-Datenbank und Verwaltung
**Funktionen:**
- Aromen-Katalog durchsuchen
- Filter nach Kategorie, Marke, etc.
- Aromen-Details anzeigen
- Mehrfachauswahl für Rechner
- Favoriten-Liste (für angemeldete User)

**Dateien:**
- `catalog.php` - Aromen-Katalog
- `search.php` - Suchfunktionen
- `details.php` - Aromen-Details
- `favorites.php` - Favoriten-Verwaltung
- `admin_manage.php` - Admin-Verwaltung

### 📝 RECIPES MODULE (modules/recipes/)
**Zweck:** Rezept-System und Community-Features
**Funktionen:**
- Rezepte erstellen und bearbeiten
- Community-Rezepte durchsuchen
- Rezept-Bewertungen und Kommentare
- Rezept-Sharing und Export
- Persönliche Rezept-Sammlung

**Dateien:**
- `create.php` - Rezept erstellen
- `browse.php` - Rezepte durchsuchen
- `details.php` - Rezept-Details
- `edit.php` - Rezept bearbeiten
- `share.php` - Rezept teilen

### ⚙️ ADMIN MODULE (modules/admin/)
**Zweck:** Admin-Backend für System-Verwaltung
**Funktionen:**
- Benutzer-Verwaltung
- Aromen-Verwaltung
- Rezept-Moderation
- System-Einstellungen
- Statistiken und Reports

**Dateien:**
- `dashboard.php` - Admin-Dashboard
- `users.php` - Benutzer-Verwaltung
- `aromas.php` - Aromen-Verwaltung
- `recipes.php` - Rezept-Moderation
- `settings.php` - System-Einstellungen

### ⭐ FAVORITES MODULE (modules/favorites/)
**Zweck:** Favoriten-System für Aromen und Rezepte
**Funktionen:**
- Aromen zu Favoriten hinzufügen
- Rezepte favorisieren
- Persönliche Favoriten-Listen
- Favoriten-Management

### ⭐ RATINGS MODULE (modules/ratings/)
**Zweck:** Bewertungs-System (1-5 Sterne)
**Funktionen:**
- Aromen bewerten
- Rezepte bewerten
- Bewertungs-Statistiken
- Bewertungs-Übersichten

### 💬 COMMENTS MODULE (modules/comments/)
**Zweck:** Kommentar-System für Rezepte
**Funktionen:**
- Kommentare zu Rezepten
- Antworten auf Kommentare
- Kommentar-Moderation
- Kommentar-Benachrichtigungen

### 👤 USERS MODULE (modules/users/)
**Zweck:** Benutzer-Profile und Einstellungen
**Funktionen:**
- Profil-Verwaltung
- Benutzer-Einstellungen
- Aktivitäts-Historie
- Öffentliche Profile

## 🔗 Modul-Verknüpfungen

### Beispiel: Aroma → Rechner
1. User wählt Aromen in `modules/aromas/catalog.php`
2. Ausgewählte Aromen werden an `modules/calculator/calculator.php` übertragen
3. Rechner verwendet Aromen-Daten für Berechnungen

### Beispiel: Rezept → Favoriten
1. User sieht Rezept in `modules/recipes/details.php`
2. Klick auf Favorit-Button ruft `modules/favorites/add.php` auf
3. Favorit wird gespeichert und in `modules/users/profile.php` angezeigt

## 🚀 Erweiterbarkeit

### Neue Module hinzufügen:
1. Neuen Ordner in `modules/` erstellen
2. Modul-spezifische Dateien hinzufügen
3. API-Endpunkte in `api/v1/` erstellen
4. Templates in `templates/` hinzufügen
5. Routing in `core/router/` konfigurieren

### Beispiel zukünftige Module:
- `modules/notifications/` - Benachrichtigungen
- `modules/social/` - Social Media Integration
- `modules/shop/` - E-Commerce Features
- `modules/analytics/` - Erweiterte Statistiken
- `modules/mobile/` - Mobile App API

## 📋 Entwicklungs-Workflow

### 1. Modul entwickeln:
```bash
# Neues Feature in eigenem Modul
modules/new_feature/
├── feature.php
├── api.php
└── templates/
```

### 2. API-Endpunkt erstellen:
```bash
# RESTful API
api/v1/new_feature/
├── index.php
├── create.php
├── update.php
└── delete.php
```

### 3. Templates hinzufügen:
```bash
# Frontend-Templates
templates/pages/new_feature/
├── list.php
├── detail.php
└── form.php
```

## 🔧 Konfiguration

### Module aktivieren/deaktivieren:
```php
// config/modules.php
return [
    'auth' => true,
    'calculator' => true,
    'aromas' => true,
    'recipes' => true,
    'admin' => true,
    'favorites' => true,
    'ratings' => true,
    'comments' => true,
    'users' => true,
    // 'new_feature' => false, // Deaktiviert
];
```

**Diese modulare Architektur ermöglicht:**
- ✅ Einfache Erweiterungen
- ✅ Saubere Code-Trennung
- ✅ Unabhängige Entwicklung
- ✅ Einfache Wartung
- ✅ Skalierbare Architektur

