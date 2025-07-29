<?php
/**
 * VapeX E-Liquid Calculator - Internationalization System
 * 
 * @version 1.0.0
 * @author VapeX Development Team
 * @created 2025-07-29
 */

class I18n {
    
    // =====================================================
    // SUPPORTED LANGUAGES
    // =====================================================
    
    private static $supportedLanguages = [
        'de' => 'Deutsch',
        'en' => 'English',
        'fr' => 'Français',
        'it' => 'Italiano',
        'nl' => 'Nederlands',
        'ru' => 'Русский',
        'es' => 'Español'
    ];
    
    private static $fallbackLanguage = 'en';
    private static $currentLanguage = null;
    private static $translations = [];
    private static $loadedModules = [];
    
    // =====================================================
    // LANGUAGE DETECTION & SETUP
    // =====================================================
    
    /**
     * Initialize the I18n system
     */
    public static function init() {
        self::$currentLanguage = self::detectLanguage();
        self::loadCommonTranslations();
    }
    
    /**
     * Detect user's preferred language from browser
     * 
     * @return string Language code
     */
    public static function detectLanguage() {
        // Check if language is set in session
        if (isset($_SESSION['language']) && self::isSupported($_SESSION['language'])) {
            return $_SESSION['language'];
        }
        
        // Check if language is set via URL parameter
        if (isset($_GET['lang']) && self::isSupported($_GET['lang'])) {
            $_SESSION['language'] = $_GET['lang'];
            return $_GET['lang'];
        }
        
        // Detect from browser Accept-Language header
        if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
            $browserLanguages = self::parseBrowserLanguages($_SERVER['HTTP_ACCEPT_LANGUAGE']);
            
            foreach ($browserLanguages as $lang) {
                // Check exact match (e.g., 'de-DE' -> 'de')
                $langCode = substr($lang, 0, 2);
                if (self::isSupported($langCode)) {
                    $_SESSION['language'] = $langCode;
                    return $langCode;
                }
            }
        }
        
        // Fallback to English
        $_SESSION['language'] = self::$fallbackLanguage;
        return self::$fallbackLanguage;
    }
    
    /**
     * Parse browser Accept-Language header
     * 
     * @param string $acceptLanguage
     * @return array Sorted array of language codes by preference
     */
    private static function parseBrowserLanguages($acceptLanguage) {
        $languages = [];
        
        // Parse Accept-Language header
        preg_match_all('/([a-z]{1,8}(?:-[a-z]{1,8})?)\s*(?:;\s*q\s*=\s*(1|0\.[0-9]+))?/i', $acceptLanguage, $matches);
        
        if ($matches[1]) {
            $languages = array_combine($matches[1], $matches[2]);
            
            // Set default quality to 1 if not specified
            foreach ($languages as $lang => $quality) {
                if ($quality === '') {
                    $languages[$lang] = 1;
                } else {
                    $languages[$lang] = floatval($quality);
                }
            }
            
            // Sort by quality (preference)
            arsort($languages, SORT_NUMERIC);
            $languages = array_keys($languages);
        }
        
        return $languages;
    }
    
    /**
     * Check if language is supported
     * 
     * @param string $lang Language code
     * @return bool
     */
    public static function isSupported($lang) {
        return isset(self::$supportedLanguages[$lang]);
    }
    
    // =====================================================
    // TRANSLATION LOADING
    // =====================================================
    
    /**
     * Load common translations (navigation, buttons, etc.)
     */
    private static function loadCommonTranslations() {
        self::loadTranslations('common');
    }
    
    /**
     * Load translations for a specific module
     * 
     * @param string $module Module name
     */
    public static function loadModule($module) {
        if (!in_array($module, self::$loadedModules)) {
            self::loadTranslations("modules/{$module}");
            self::$loadedModules[] = $module;
        }
    }
    
    /**
     * Load translation file
     * 
     * @param string $path Path relative to language directory
     */
    private static function loadTranslations($path) {
        $currentLang = self::getCurrentLanguage();
        $fallbackLang = self::$fallbackLanguage;
        
        // Get the correct base path for the application
        $basePath = dirname(dirname(__DIR__)); // Go up from core/i18n to root
        
        // Try to load current language
        $currentFile = $basePath . "/languages/{$currentLang}/{$path}.json";
        if (file_exists($currentFile)) {
            $content = file_get_contents($currentFile);
            $translations = json_decode($content, true);
            if ($translations && is_array($translations)) {
                self::$translations = array_merge(self::$translations, $translations);
            }
        }
        
        // Load fallback language for missing keys
        if ($currentLang !== $fallbackLang) {
            $fallbackFile = $basePath . "/languages/{$fallbackLang}/{$path}.json";
            if (file_exists($fallbackFile)) {
                $content = file_get_contents($fallbackFile);
                $fallbackTranslations = json_decode($content, true);
                if ($fallbackTranslations && is_array($fallbackTranslations)) {
                    // Only add missing keys from fallback
                    foreach ($fallbackTranslations as $key => $value) {
                        if (!isset(self::$translations[$key])) {
                            self::$translations[$key] = $value;
                        }
                    }
                }
            }
        }
    }
    
    // =====================================================
    // TRANSLATION FUNCTIONS
    // =====================================================
    
    /**
     * Translate a key
     * 
     * @param string $key Translation key
     * @param array $params Parameters for string interpolation
     * @return string Translated string
     */
    public static function t($key, $params = []) {
        $translation = self::$translations[$key] ?? $key;
        
        // Handle nested keys (e.g., 'auth.login.title')
        if (!isset(self::$translations[$key]) && strpos($key, '.') !== false) {
            $translation = self::getNestedTranslation($key);
        }
        
        // Parameter substitution
        if (!empty($params) && is_array($params)) {
            foreach ($params as $param => $value) {
                $translation = str_replace("{{$param}}", $value, $translation);
            }
        }
        
        return $translation;
    }
    
    /**
     * Get nested translation (e.g., 'auth.login.title')
     * 
     * @param string $key Nested key
     * @return string Translation or key if not found
     */
    private static function getNestedTranslation($key) {
        $keys = explode('.', $key);
        $translation = self::$translations;
        
        foreach ($keys as $nestedKey) {
            if (isset($translation[$nestedKey])) {
                $translation = $translation[$nestedKey];
            } else {
                return $key; // Key not found
            }
        }
        
        return is_string($translation) ? $translation : $key;
    }
    
    /**
     * Translate with pluralization
     * 
     * @param string $key Translation key
     * @param int $count Count for pluralization
     * @param array $params Additional parameters
     * @return string Translated string
     */
    public static function tn($key, $count, $params = []) {
        $params['count'] = $count;
        
        // Try plural form first
        if ($count !== 1) {
            $pluralKey = $key . '_plural';
            if (isset(self::$translations[$pluralKey])) {
                return self::t($pluralKey, $params);
            }
        }
        
        // Fallback to singular
        return self::t($key, $params);
    }
    
    // =====================================================
    // LANGUAGE MANAGEMENT
    // =====================================================
    
    /**
     * Set current language
     * 
     * @param string $lang Language code
     * @return bool Success
     */
    public static function setLanguage($lang) {
        if (self::isSupported($lang)) {
            self::$currentLanguage = $lang;
            $_SESSION['language'] = $lang;
            
            // Reload translations
            self::$translations = [];
            self::$loadedModules = [];
            self::loadCommonTranslations();
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Get current language
     * 
     * @return string Current language code
     */
    public static function getCurrentLanguage() {
        return self::$currentLanguage ?? self::$fallbackLanguage;
    }
    
    /**
     * Get current language name
     * 
     * @return string Current language name
     */
    public static function getCurrentLanguageName() {
        $lang = self::getCurrentLanguage();
        return self::$supportedLanguages[$lang] ?? 'English';
    }
    
    /**
     * Get all supported languages
     * 
     * @return array Language codes and names
     */
    public static function getSupportedLanguages() {
        return self::$supportedLanguages;
    }
    
    /**
     * Get fallback language
     * 
     * @return string Fallback language code
     */
    public static function getFallbackLanguage() {
        return self::$fallbackLanguage;
    }
    
    // =====================================================
    // UTILITY FUNCTIONS
    // =====================================================
    
    /**
     * Get language direction (LTR/RTL)
     * 
     * @param string $lang Language code (optional)
     * @return string 'ltr' or 'rtl'
     */
    public static function getDirection($lang = null) {
        $lang = $lang ?? self::getCurrentLanguage();
        
        // RTL languages
        $rtlLanguages = ['ar', 'he', 'fa', 'ur'];
        
        return in_array($lang, $rtlLanguages) ? 'rtl' : 'ltr';
    }
    
    /**
     * Get browser locale for date/number formatting
     * 
     * @param string $lang Language code (optional)
     * @return string Locale string
     */
    public static function getLocale($lang = null) {
        $lang = $lang ?? self::getCurrentLanguage();
        
        $locales = [
            'de' => 'de_DE',
            'en' => 'en_US',
            'fr' => 'fr_FR',
            'it' => 'it_IT',
            'nl' => 'nl_NL',
            'ru' => 'ru_RU',
            'es' => 'es_ES'
        ];
        
        return $locales[$lang] ?? 'en_US';
    }
    
    /**
     * Format date according to current language
     * 
     * @param string|int $date Date string or timestamp
     * @param string $format Format type ('short', 'medium', 'long', 'full')
     * @return string Formatted date
     */
    public static function formatDate($date, $format = 'medium') {
        $timestamp = is_numeric($date) ? $date : strtotime($date);
        $lang = self::getCurrentLanguage();
        
        $formats = [
            'de' => [
                'short' => 'd.m.Y',
                'medium' => 'd.m.Y H:i',
                'long' => 'd. F Y H:i',
                'full' => 'l, d. F Y H:i:s'
            ],
            'en' => [
                'short' => 'm/d/Y',
                'medium' => 'm/d/Y H:i',
                'long' => 'F d, Y H:i',
                'full' => 'l, F d, Y H:i:s'
            ],
            'fr' => [
                'short' => 'd/m/Y',
                'medium' => 'd/m/Y H:i',
                'long' => 'd F Y H:i',
                'full' => 'l d F Y H:i:s'
            ],
            'it' => [
                'short' => 'd/m/Y',
                'medium' => 'd/m/Y H:i',
                'long' => 'd F Y H:i',
                'full' => 'l d F Y H:i:s'
            ],
            'nl' => [
                'short' => 'd-m-Y',
                'medium' => 'd-m-Y H:i',
                'long' => 'd F Y H:i',
                'full' => 'l d F Y H:i:s'
            ],
            'ru' => [
                'short' => 'd.m.Y',
                'medium' => 'd.m.Y H:i',
                'long' => 'd F Y H:i',
                'full' => 'l, d F Y H:i:s'
            ],
            'es' => [
                'short' => 'd/m/Y',
                'medium' => 'd/m/Y H:i',
                'long' => 'd \d\e F \d\e Y H:i',
                'full' => 'l, d \d\e F \d\e Y H:i:s'
            ]
        ];
        
        $formatString = $formats[$lang][$format] ?? $formats['en'][$format];
        return date($formatString, $timestamp);
    }
    
    /**
     * Format number according to current language
     * 
     * @param float $number Number to format
     * @param int $decimals Number of decimal places
     * @return string Formatted number
     */
    public static function formatNumber($number, $decimals = 2) {
        $lang = self::getCurrentLanguage();
        
        $formats = [
            'de' => ['.', ','],  // 1.234,56
            'en' => [',', '.'],  // 1,234.56
            'fr' => [' ', ','],  // 1 234,56
            'it' => ['.', ','],  // 1.234,56
            'nl' => ['.', ','],  // 1.234,56
            'ru' => [' ', ','],  // 1 234,56
            'es' => ['.', ',']   // 1.234,56
        ];
        
        $format = $formats[$lang] ?? $formats['en'];
        return number_format($number, $decimals, $format[1], $format[0]);
    }
    
    // =====================================================
    // DEBUG & DEVELOPMENT
    // =====================================================
    
    /**
     * Get all loaded translations (for debugging)
     * 
     * @return array All translations
     */
    public static function getAllTranslations() {
        return self::$translations;
    }
    
    /**
     * Get missing translation keys
     * 
     * @return array Missing keys
     */
    public static function getMissingKeys() {
        // This would be implemented to track missing translations
        // during development
        return [];
    }
    
    /**
     * Export translations to different formats
     * 
     * @param string $format Format ('json', 'csv', 'xml')
     * @return string Exported data
     */
    public static function exportTranslations($format = 'json') {
        switch ($format) {
            case 'json':
                return json_encode(self::$translations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            case 'csv':
                // CSV export implementation
                break;
            case 'xml':
                // XML export implementation
                break;
        }
        
        return '';
    }
}

// =====================================================
// GLOBAL HELPER FUNCTIONS
// =====================================================

/**
 * Global translation function
 * 
 * @param string $key Translation key
 * @param array $params Parameters
 * @return string Translated string
 */
function __($key, $params = []) {
    return I18n::t($key, $params);
}

/**
 * Global pluralization function
 * 
 * @param string $key Translation key
 * @param int $count Count
 * @param array $params Parameters
 * @return string Translated string
 */
function _n($key, $count, $params = []) {
    return I18n::tn($key, $count, $params);
}

/**
 * Get current language
 * 
 * @return string Current language code
 */
function current_lang() {
    return I18n::getCurrentLanguage();
}

/**
 * Check if language is RTL
 * 
 * @return bool True if RTL
 */
function is_rtl() {
    return I18n::getDirection() === 'rtl';
}

