# VapeX E-Liquid Calculator

Ein modernes, PHP-basiertes E-Liquid Rechner-System mit umfangreicher Aromen-Datenbank und Rezept-Verwaltung.

## 🚀 Features

### 📊 E-Liquid Rechner
- Präzise Berechnung von E-Liquid Mischungen
- Unterstützung für verschiedene Nikotinstärken
- VG/PG Verhältnis-Anpassung
- Aromen-Prozentsatz Optimierung

### 🧪 Aromen-Datenbank
- Umfangreiche Datenbank mit 25+ Aromen
- Kategorisierung nach Geschmacksrichtungen
- Marken-spezifische Informationen
- Empfohlene Mischverhältnisse

### 📝 Rezept-System
- Community-Rezepte teilen und bewerten
- Persönliche Rezept-Sammlung
- Bewertungs- und Kommentar-System
- Favoriten-Verwaltung

### 👤 Benutzer-System
- 4-stufiges Berechtigungssystem (Public, User, Premium, Admin)
- Sichere Authentifizierung
- Persönliche Profile
- Session-Management

## 🏗️ Technische Architektur

### Backend
- **PHP 8.1+** - Moderne PHP-Features
- **MySQL 8.0+** - Relationale Datenbank
- **Modulares Design** - Erweiterbare Architektur
- **RESTful APIs** - Saubere Schnittstellen

### Frontend
- **Tailwind CSS** - Utility-first CSS Framework
- **Material Icons** - Konsistente Iconographie
- **Roboto Font** - Professionelle Typographie
- **Responsive Design** - Mobile-first Ansatz

### Sicherheit
- **bcrypt Hashing** - Sichere Passwort-Speicherung
- **CSRF Protection** - Cross-Site Request Forgery Schutz
- **Input Validation** - Umfassende Eingabevalidierung
- **SQL Injection Prevention** - Prepared Statements

## 📁 Projekt-Struktur

```
/
├── config/              # Konfigurationsdateien
├── core/               # Kern-System (Router, Database, etc.)
├── modules/            # Feature-Module
│   ├── auth/          # Authentifizierung
│   ├── calculator/    # E-Liquid Rechner
│   ├── aromas/        # Aromen-Verwaltung
│   ├── recipes/       # Rezept-System
│   └── admin/         # Admin-Backend
├── assets/            # CSS, JS, Bilder
├── templates/         # HTML-Templates
├── api/              # API-Endpunkte
└── uploads/          # Benutzer-Uploads
```

## 🔧 Installation

### Voraussetzungen
- PHP 8.1 oder höher
- MySQL 8.0 oder höher
- Webserver (Apache/Nginx)
- Composer (für Dependencies)

### Setup
1. Repository klonen
2. Datenbank erstellen: `mysql < database_schema.sql`
3. Konfiguration anpassen: `config/database.php`
4. Webserver konfigurieren
5. Erste Anmeldung: admin/admin

## 🌟 Module

### 1. Authentication (auth)
- Benutzer-Registrierung und -Anmeldung
- Passwort-Reset
- Session-Verwaltung

### 2. Calculator (calculator)
- E-Liquid Berechnung
- Rezept-Import/Export
- Batch-Berechnung

### 3. Aromas (aromas)
- Aromen-Datenbank
- Suche und Filter
- Favoriten-System

### 4. Recipes (recipes)
- Rezept-Erstellung und -Verwaltung
- Community-Features
- Bewertungs-System

### 5. Admin (admin)
- Benutzer-Verwaltung
- System-Einstellungen
- Statistiken

## 📊 Datenbank-Schema

Das System verwendet eine normalisierte MySQL-Datenbank mit folgenden Haupttabellen:
- `users` - Benutzer-Daten
- `aromas` - Aromen-Informationen
- `recipes` - Rezept-Daten
- `recipe_ingredients` - Rezept-Zutaten
- `ratings` - Bewertungen
- `comments` - Kommentare

## 🚀 Deployment

### Entwicklung
- DEV-Server: `vapex.kami2go.de`
- Git-basiertes Deployment via Plesk
- Automatische Tests vor Live-Schaltung

### Produktion
- Live-Server: TBD
- Staging-Umgebung für Tests
- Backup-Strategien

## 📈 Roadmap

### Phase 1 (Aktuell)
- [x] Basis-System Setup
- [x] Datenbank-Schema
- [ ] Modulare Architektur
- [ ] Design-System

### Phase 2
- [ ] E-Liquid Rechner
- [ ] Aromen-Datenbank
- [ ] Basis-Templates

### Phase 3
- [ ] Benutzer-System
- [ ] Rezept-Verwaltung
- [ ] Community-Features

### Phase 4
- [ ] Admin-Backend
- [ ] Premium-Features
- [ ] Mobile App (optional)

## 🤝 Contributing

Beiträge sind willkommen! Bitte beachten Sie:
- Modulare Entwicklung
- Code-Standards einhalten
- Tests schreiben
- Dokumentation aktualisieren

## 📄 Lizenz

Dieses Projekt ist proprietär und für den internen Gebrauch bestimmt.

## 📞 Support

Bei Fragen oder Problemen wenden Sie sich an das Entwicklungsteam.

---

**Version:** 1.0.0  
**Letzte Aktualisierung:** 29.07.2025  
**Status:** In Entwicklung

