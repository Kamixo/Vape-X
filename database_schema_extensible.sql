-- VapeX E-Liquid Calculator - Erweiterbares MySQL Database Schema
-- Created: 2025-07-29
-- Version: 1.0
-- Architecture: Pure MySQL Columns with Migration System

-- Create database
CREATE DATABASE IF NOT EXISTS vapex_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vapex_dev;

-- =====================================================
-- MIGRATIONS SYSTEM - Für sichere Schema-Erweiterungen
-- =====================================================

CREATE TABLE schema_migrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    version VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    execution_time_ms INT,
    success BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- USERS TABLE - Benutzer-System
-- =====================================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('public', 'user', 'premium', 'admin') DEFAULT 'public',
    
    -- Basis-Eigenschaften
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    date_of_birth DATE,
    country VARCHAR(50),
    
    -- Account-Status
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    -- Zukünftige Erweiterungen (Beispiele):
    -- phone VARCHAR(20),                    -- Migration v1.1
    -- newsletter_subscribed BOOLEAN,        -- Migration v1.2
    -- preferred_language VARCHAR(5),        -- Migration v1.3
    -- timezone VARCHAR(50),                 -- Migration v1.4
    -- avatar_url VARCHAR(255),              -- Migration v1.5
    -- bio TEXT,                             -- Migration v1.6
    -- website_url VARCHAR(255),             -- Migration v1.7
    -- social_media_links JSON,              -- Migration v1.8
    -- privacy_settings JSON,                -- Migration v1.9
    -- notification_preferences JSON         -- Migration v2.0
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_user_type (user_type),
    INDEX idx_is_active (is_active)
);

-- =====================================================
-- AROMAS TABLE - Erweiterbares Aromen-System
-- =====================================================

CREATE TABLE aromas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Kern-Eigenschaften (v1.0)
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    
    -- Mischungs-Eigenschaften
    recommended_percentage DECIMAL(5,2),
    min_percentage DECIMAL(5,2),
    max_percentage DECIMAL(5,2),
    
    -- Beschreibung und Details
    description TEXT,
    flavor_profile TEXT,
    mixing_notes TEXT,
    
    -- Reifezeit und Lagerung
    steeping_time_days INT DEFAULT 0,
    
    -- Medien
    image_url VARCHAR(255),
    
    -- Status und Meta
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Zukünftige Erweiterungen (Beispiele für Migrations):
    -- allergen_info VARCHAR(255),           -- Migration v1.1: Allergie-Informationen
    -- bio_certified BOOLEAN DEFAULT FALSE,  -- Migration v1.2: Bio-Zertifizierung
    -- country_origin VARCHAR(50),           -- Migration v1.3: Herstellungsland
    -- shelf_life_days INT,                  -- Migration v1.4: Haltbarkeit
    -- storage_temperature INT,              -- Migration v1.5: Lagerungstemperatur
    -- nicotine_compatible BOOLEAN,          -- Migration v1.6: Nikotin-Kompatibilität
    -- pg_vg_ratio VARCHAR(10),              -- Migration v1.7: Empfohlenes PG/VG
    -- intensity_level INT CHECK (intensity_level BETWEEN 1 AND 10), -- Migration v1.8
    -- color_hex VARCHAR(7),                 -- Migration v1.9: Farbe des Aromas
    -- density DECIMAL(4,3),                 -- Migration v2.0: Dichte
    -- viscosity VARCHAR(20),                -- Migration v2.1: Viskosität
    -- ph_value DECIMAL(3,1),                -- Migration v2.2: pH-Wert
    -- solubility VARCHAR(50),               -- Migration v2.3: Löslichkeit
    -- flash_point INT,                      -- Migration v2.4: Flammpunkt
    -- manufacturer_code VARCHAR(50),        -- Migration v2.5: Herstellercode
    -- batch_number VARCHAR(50),             -- Migration v2.6: Chargennummer
    -- expiry_date DATE,                     -- Migration v2.7: Ablaufdatum
    -- price_per_ml DECIMAL(6,2),            -- Migration v2.8: Preis pro ml
    -- availability_status ENUM('available', 'limited', 'discontinued'), -- Migration v2.9
    -- seasonal_availability VARCHAR(100),   -- Migration v3.0: Saisonale Verfügbarkeit
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_name (name),
    INDEX idx_brand (brand),
    INDEX idx_category (category),
    INDEX idx_is_active (is_active),
    INDEX idx_created_by (created_by),
    INDEX idx_recommended_percentage (recommended_percentage)
);

-- =====================================================
-- RECIPES TABLE - Erweiterbares Rezept-System
-- =====================================================

CREATE TABLE recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Basis-Eigenschaften
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Mischungs-Parameter
    total_volume INT NOT NULL, -- in ml
    nicotine_strength DECIMAL(4,2) DEFAULT 0,
    vg_ratio INT DEFAULT 70, -- VG percentage
    pg_ratio INT DEFAULT 30, -- PG percentage
    
    -- Reifezeit und Schwierigkeit
    steeping_time_days INT DEFAULT 0,
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    
    -- Medien und Status
    image_url VARCHAR(255),
    is_public BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Statistiken
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0,
    rating_count INT DEFAULT 0,
    
    -- Meta-Daten
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Zukünftige Erweiterungen (Beispiele):
    -- preparation_time_minutes INT,         -- Migration v1.1: Zubereitungszeit
    -- equipment_needed TEXT,                -- Migration v1.2: Benötigte Ausrüstung
    -- cost_estimate DECIMAL(6,2),           -- Migration v1.3: Kostenschätzung
    -- yield_ml INT,                         -- Migration v1.4: Ausbeute in ml
    -- color_description VARCHAR(50),        -- Migration v1.5: Farbbeschreibung
    -- aroma_intensity INT CHECK (aroma_intensity BETWEEN 1 AND 10), -- Migration v1.6
    -- throat_hit_level INT CHECK (throat_hit_level BETWEEN 1 AND 10), -- Migration v1.7
    -- cloud_production ENUM('low', 'medium', 'high'), -- Migration v1.8
    -- recipe_type ENUM('single_flavor', 'simple_mix', 'complex_mix'), -- Migration v1.9
    -- season_recommendation VARCHAR(50),    -- Migration v2.0: Saisonempfehlung
    -- age_restriction INT,                  -- Migration v2.1: Altersempfehlung
    -- health_warnings TEXT,                 -- Migration v2.2: Gesundheitshinweise
    -- storage_instructions TEXT,            -- Migration v2.3: Lagerungshinweise
    -- mixing_order TEXT,                    -- Migration v2.4: Mischungsreihenfolge
    -- temperature_recommendation INT,       -- Migration v2.5: Temperaturempfehlung
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_name (name),
    INDEX idx_created_by (created_by),
    INDEX idx_is_public (is_public),
    INDEX idx_is_featured (is_featured),
    INDEX idx_difficulty_level (difficulty_level),
    INDEX idx_rating_average (rating_average),
    INDEX idx_view_count (view_count)
);

-- =====================================================
-- RECIPE INGREDIENTS - Rezept-Zutaten Verknüpfung
-- =====================================================

CREATE TABLE recipe_ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT NOT NULL,
    aroma_id INT NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    notes TEXT,
    
    -- Reihenfolge und Priorität
    sort_order INT DEFAULT 0,
    
    -- Zukünftige Erweiterungen:
    -- is_optional BOOLEAN DEFAULT FALSE,    -- Migration v1.1: Optionale Zutat
    -- substitution_notes TEXT,              -- Migration v1.2: Ersatzmöglichkeiten
    -- mixing_stage ENUM('base', 'flavor', 'finish'), -- Migration v1.3: Mischungsstufe
    -- temperature_addition INT,             -- Migration v1.4: Zugabetemperatur
    -- mixing_time_seconds INT,              -- Migration v1.5: Mischzeit
    
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (aroma_id) REFERENCES aromas(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_recipe_aroma (recipe_id, aroma_id),
    INDEX idx_recipe_id (recipe_id),
    INDEX idx_aroma_id (aroma_id),
    INDEX idx_percentage (percentage)
);

-- =====================================================
-- USER FAVORITES - Benutzer-Favoriten
-- =====================================================

CREATE TABLE user_favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_type ENUM('aroma', 'recipe') NOT NULL,
    item_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Zukünftige Erweiterungen:
    -- priority INT DEFAULT 0,               -- Migration v1.1: Priorität/Reihenfolge
    -- notes TEXT,                           -- Migration v1.2: Persönliche Notizen
    -- tags VARCHAR(255),                    -- Migration v1.3: Persönliche Tags
    -- reminder_date DATE,                   -- Migration v1.4: Erinnerungsdatum
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_favorite (user_id, item_type, item_id),
    INDEX idx_user_id (user_id),
    INDEX idx_item_type_id (item_type, item_id)
);

-- =====================================================
-- RATINGS - Bewertungs-System
-- =====================================================

CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_type ENUM('aroma', 'recipe') NOT NULL,
    item_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    
    -- Detaillierte Bewertungen
    -- Zukünftige Erweiterungen:
    -- taste_rating INT CHECK (taste_rating BETWEEN 1 AND 5),     -- Migration v1.1
    -- quality_rating INT CHECK (quality_rating BETWEEN 1 AND 5), -- Migration v1.2
    -- value_rating INT CHECK (value_rating BETWEEN 1 AND 5),     -- Migration v1.3
    -- difficulty_rating INT CHECK (difficulty_rating BETWEEN 1 AND 5), -- Migration v1.4
    -- would_recommend BOOLEAN,              -- Migration v1.5: Weiterempfehlung
    -- experience_level ENUM('beginner', 'intermediate', 'expert'), -- Migration v1.6
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_rating (user_id, item_type, item_id),
    INDEX idx_user_id (user_id),
    INDEX idx_item_type_id (item_type, item_id),
    INDEX idx_rating (rating)
);

-- =====================================================
-- COMMENTS - Kommentar-System
-- =====================================================

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_type ENUM('recipe') NOT NULL,
    item_id INT NOT NULL,
    comment TEXT NOT NULL,
    parent_id INT NULL, -- für Antworten
    
    -- Status und Moderation
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Zukünftige Erweiterungen:
    -- is_pinned BOOLEAN DEFAULT FALSE,      -- Migration v1.1: Angepinnter Kommentar
    -- like_count INT DEFAULT 0,             -- Migration v1.2: Likes für Kommentare
    -- report_count INT DEFAULT 0,           -- Migration v1.3: Meldungen
    -- moderation_status ENUM('approved', 'pending', 'rejected'), -- Migration v1.4
    -- edited_at TIMESTAMP NULL,             -- Migration v1.5: Bearbeitungszeit
    -- edit_reason VARCHAR(255),             -- Migration v1.6: Bearbeitungsgrund
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_item_type_id (item_type, item_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_is_active (is_active)
);

-- =====================================================
-- USER SESSIONS - Session-Management
-- =====================================================

CREATE TABLE user_sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Session-Details
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Zukünftige Erweiterungen:
    -- device_type VARCHAR(50),              -- Migration v1.1: Gerätetyp
    -- browser_name VARCHAR(50),             -- Migration v1.2: Browser
    -- os_name VARCHAR(50),                  -- Migration v1.3: Betriebssystem
    -- location_country VARCHAR(50),         -- Migration v1.4: Land
    -- location_city VARCHAR(100),           -- Migration v1.5: Stadt
    -- is_mobile BOOLEAN DEFAULT FALSE,      -- Migration v1.6: Mobile Erkennung
    -- login_method ENUM('password', 'oauth', 'token'), -- Migration v1.7
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at),
    INDEX idx_is_active (is_active)
);

-- =====================================================
-- SYSTEM SETTINGS - Konfiguration
-- =====================================================

CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    setting_type ENUM('string', 'integer', 'boolean', 'json') DEFAULT 'string',
    
    -- Zukünftige Erweiterungen:
    -- is_public BOOLEAN DEFAULT FALSE,      -- Migration v1.1: Öffentlich sichtbar
    -- category VARCHAR(50),                 -- Migration v1.2: Einstellungs-Kategorie
    -- validation_rules JSON,                -- Migration v1.3: Validierungsregeln
    -- default_value TEXT,                   -- Migration v1.4: Standardwert
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_setting_key (setting_key),
    INDEX idx_setting_type (setting_type)
);

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Default admin user
INSERT INTO users (username, email, password_hash, user_type) VALUES 
('admin', 'admin@vapex.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- System settings
INSERT INTO system_settings (setting_key, setting_value, description, setting_type) VALUES 
('site_name', 'VapeX E-Liquid Calculator', 'Name der Website', 'string'),
('maintenance_mode', '0', 'Wartungsmodus (0=aus, 1=an)', 'boolean'),
('registration_enabled', '1', 'Registrierung erlaubt (0=nein, 1=ja)', 'boolean'),
('max_recipes_per_user', '50', 'Maximale Anzahl Rezepte pro Benutzer', 'integer'),
('default_vg_ratio', '70', 'Standard VG-Verhältnis', 'integer'),
('default_pg_ratio', '30', 'Standard PG-Verhältnis', 'integer'),
('schema_version', '1.0', 'Aktuelle Schema-Version', 'string');

-- Initial migration record
INSERT INTO schema_migrations (version, description) VALUES 
('1.0.0', 'Initial database schema with extensible architecture');

-- =====================================================
-- MIGRATION EXAMPLES (für zukünftige Verwendung)
-- =====================================================

-- Beispiel Migration v1.1 - Allergie-Informationen für Aromen
/*
ALTER TABLE aromas ADD COLUMN allergen_info VARCHAR(255) AFTER mixing_notes;
ALTER TABLE aromas ADD COLUMN bio_certified BOOLEAN DEFAULT FALSE AFTER allergen_info;
INSERT INTO schema_migrations (version, description) VALUES ('1.1.0', 'Added allergen_info and bio_certified to aromas');
*/

-- Beispiel Migration v1.2 - Erweiterte Benutzer-Profile
/*
ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER country;
ALTER TABLE users ADD COLUMN newsletter_subscribed BOOLEAN DEFAULT TRUE AFTER phone;
INSERT INTO schema_migrations (version, description) VALUES ('1.2.0', 'Added phone and newsletter subscription to users');
*/

