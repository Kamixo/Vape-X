# VapeX Database Migrations System

## Übersicht

Das Migrations-System ermöglicht es, die Datenbank-Struktur sicher und versioniert zu erweitern, ohne bestehende Daten zu verlieren oder das System neu aufbauen zu müssen.

## Wie Migrations funktionieren

### 1. Schema-Versionierung
Jede Änderung an der Datenbank-Struktur wird als "Migration" versioniert:
- `v1.0.0` - Basis-Schema
- `v1.1.0` - Allergie-Informationen hinzugefügt
- `v1.2.0` - Bio-Zertifikate hinzugefügt
- `v1.3.0` - Herstellungsland hinzugefügt

### 2. Sichere Erweiterungen
Neue Eigenschaften werden als neue Spalten hinzugefügt:
```sql
-- Beispiel: Allergie-Informationen für Aromen
ALTER TABLE aromas ADD COLUMN allergen_info VARCHAR(255) AFTER description;
ALTER TABLE aromas ADD COLUMN bio_certified BOOLEAN DEFAULT FALSE AFTER allergen_info;
```

### 3. Rückwärtskompatibilität
- Bestehende Daten bleiben unverändert
- Neue Spalten haben Standardwerte
- Alte API-Aufrufe funktionieren weiterhin

## Migration-Beispiele

### Aromen erweitern

#### v1.1 - Allergie & Bio-Informationen
```sql
-- Migration: 001_add_allergen_bio_info.sql
ALTER TABLE aromas ADD COLUMN allergen_info VARCHAR(255) AFTER description;
ALTER TABLE aromas ADD COLUMN bio_certified BOOLEAN DEFAULT FALSE AFTER allergen_info;
ALTER TABLE aromas ADD COLUMN country_origin VARCHAR(50) AFTER bio_certified;

-- Migration protokollieren
INSERT INTO schema_migrations (version, description) VALUES 
('1.1.0', 'Added allergen_info, bio_certified, country_origin to aromas');
```

#### v1.2 - Lagerung & Haltbarkeit
```sql
-- Migration: 002_add_storage_info.sql
ALTER TABLE aromas ADD COLUMN shelf_life_days INT AFTER country_origin;
ALTER TABLE aromas ADD COLUMN storage_temperature INT AFTER shelf_life_days;
ALTER TABLE aromas ADD COLUMN storage_humidity INT AFTER storage_temperature;

INSERT INTO schema_migrations (version, description) VALUES 
('1.2.0', 'Added storage and shelf life information to aromas');
```

#### v1.3 - Erweiterte Eigenschaften
```sql
-- Migration: 003_add_advanced_properties.sql
ALTER TABLE aromas ADD COLUMN intensity_level INT CHECK (intensity_level BETWEEN 1 AND 10) AFTER storage_humidity;
ALTER TABLE aromas ADD COLUMN color_hex VARCHAR(7) AFTER intensity_level;
ALTER TABLE aromas ADD COLUMN density DECIMAL(4,3) AFTER color_hex;
ALTER TABLE aromas ADD COLUMN ph_value DECIMAL(3,1) AFTER density;

INSERT INTO schema_migrations (version, description) VALUES 
('1.3.0', 'Added intensity, color, density, pH properties to aromas');
```

### Benutzer erweitern

#### v1.1 - Kontakt-Informationen
```sql
-- Migration: 004_add_user_contact.sql
ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER country;
ALTER TABLE users ADD COLUMN address TEXT AFTER phone;
ALTER TABLE users ADD COLUMN postal_code VARCHAR(10) AFTER address;

INSERT INTO schema_migrations (version, description) VALUES 
('1.1.0', 'Added contact information to users');
```

### Rezepte erweitern

#### v1.1 - Kosten & Zeit
```sql
-- Migration: 005_add_recipe_details.sql
ALTER TABLE recipes ADD COLUMN preparation_time_minutes INT AFTER difficulty_level;
ALTER TABLE recipes ADD COLUMN cost_estimate DECIMAL(6,2) AFTER preparation_time_minutes;
ALTER TABLE recipes ADD COLUMN equipment_needed TEXT AFTER cost_estimate;

INSERT INTO schema_migrations (version, description) VALUES 
('1.1.0', 'Added preparation time, cost estimate, equipment to recipes');
```

## Migration ausführen

### 1. Migration-Datei erstellen
```bash
# Neue Migration erstellen
touch migrations/006_add_new_feature.sql
```

### 2. Migration-SQL schreiben
```sql
-- migrations/006_add_new_feature.sql
ALTER TABLE aromas ADD COLUMN new_property VARCHAR(100) AFTER existing_column;

-- Migration protokollieren
INSERT INTO schema_migrations (version, description, executed_at) VALUES 
('1.4.0', 'Added new_property to aromas', NOW());
```

### 3. Migration ausführen
```bash
# Via MySQL
mysql -u username -p vapex_dev < migrations/006_add_new_feature.sql

# Oder via PHP Migration-Script
php core/migrations/run_migration.php 006_add_new_feature
```

## Migration-Status prüfen

```sql
-- Alle ausgeführten Migrations anzeigen
SELECT * FROM schema_migrations ORDER BY executed_at DESC;

-- Aktuelle Schema-Version
SELECT setting_value FROM system_settings WHERE setting_key = 'schema_version';
```

## Best Practices

### 1. Immer Standardwerte setzen
```sql
-- Gut: Mit Standardwert
ALTER TABLE aromas ADD COLUMN bio_certified BOOLEAN DEFAULT FALSE;

-- Schlecht: Ohne Standardwert (kann NULL-Probleme verursachen)
ALTER TABLE aromas ADD COLUMN bio_certified BOOLEAN;
```

### 2. Rückwärtskompatible Änderungen
```sql
-- Gut: Neue optionale Spalte
ALTER TABLE aromas ADD COLUMN allergen_info VARCHAR(255);

-- Vorsicht: Bestehende Spalte ändern (kann Probleme verursachen)
ALTER TABLE aromas MODIFY COLUMN name VARCHAR(200); -- War vorher VARCHAR(100)
```

### 3. Indizes für neue Spalten
```sql
-- Neue Spalte mit Index für bessere Performance
ALTER TABLE aromas ADD COLUMN country_origin VARCHAR(50);
ALTER TABLE aromas ADD INDEX idx_country_origin (country_origin);
```

### 4. Migration dokumentieren
```sql
-- Immer Migration protokollieren
INSERT INTO schema_migrations (version, description, executed_at) VALUES 
('1.5.0', 'Detailed description of what was changed', NOW());
```

## Rollback-Strategien

### 1. Spalte entfernen (Vorsicht!)
```sql
-- Nur wenn sicher, dass keine Daten verloren gehen
ALTER TABLE aromas DROP COLUMN temporary_column;
```

### 2. Spalte deaktivieren (sicherer)
```sql
-- Spalte behalten, aber in Anwendung ignorieren
-- Später via Migration entfernen wenn sicher
```

## Produktions-Deployment

### 1. Backup vor Migration
```bash
mysqldump -u username -p vapex_live > backup_before_migration.sql
```

### 2. Migration testen
```bash
# Erst auf DEV-Server testen
mysql -u username -p vapex_dev < migration.sql
```

### 3. Live-Migration
```bash
# Dann auf Live-Server ausführen
mysql -u username -p vapex_live < migration.sql
```

## Zukünftige Erweiterungen

Das System ist vorbereitet für:

### Aromen:
- Allergie-Informationen
- Bio-Zertifikate
- Herstellungsland
- Lagerungshinweise
- Intensitätslevel
- Farbcodes
- Chemische Eigenschaften
- Preise und Verfügbarkeit

### Benutzer:
- Erweiterte Profile
- Präferenzen
- Social Media Links
- Benachrichtigungseinstellungen

### Rezepte:
- Kosten-Schätzungen
- Zubereitungszeit
- Ausrüstungsanforderungen
- Detaillierte Bewertungen

**Das System wächst mit Ihren Anforderungen mit, ohne bestehende Daten zu gefährden!**

