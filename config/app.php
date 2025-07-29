<?php
/**
 * VapeX E-Liquid Calculator - Main Configuration
 * 
 * @version 1.0.0
 * @author VapeX Development Team
 * @created 2025-07-29
 */

return [
    
    // =====================================================
    // APPLICATION SETTINGS
    // =====================================================
    
    'app' => [
        'name' => 'VapeX E-Liquid Calculator',
        'version' => '1.0.0',
        'environment' => 'development', // development, staging, production
        'debug' => true,
        'timezone' => 'Europe/Berlin',
        'locale' => 'de_DE',
        'charset' => 'UTF-8',
    ],
    
    // =====================================================
    // DATABASE CONFIGURATION
    // =====================================================
    
    'database' => [
        'default' => 'mysql',
        'connections' => [
            'mysql' => [
                'driver' => 'mysql',
                'host' => 'localhost',
                'port' => '3306',
                'database' => 'vapex_dev',
                'username' => 'vapex_user',
                'password' => 'secure_password',
                'charset' => 'utf8mb4',
                'collation' => 'utf8mb4_unicode_ci',
                'prefix' => '',
                'strict' => true,
                'engine' => null,
            ],
        ],
    ],
    
    // =====================================================
    // SECURITY SETTINGS
    // =====================================================
    
    'security' => [
        'session' => [
            'name' => 'VAPEX_SESSION',
            'lifetime' => 7200, // 2 hours
            'path' => '/',
            'domain' => '',
            'secure' => false, // Set to true in production with HTTPS
            'httponly' => true,
            'samesite' => 'Lax',
        ],
        'csrf' => [
            'enabled' => true,
            'token_name' => '_token',
            'regenerate' => true,
        ],
        'password' => [
            'algorithm' => PASSWORD_ARGON2ID,
            'options' => [
                'memory_cost' => 65536, // 64 MB
                'time_cost' => 4,       // 4 iterations
                'threads' => 3,         // 3 threads
            ],
        ],
    ],
    
    // =====================================================
    // MODULE CONFIGURATION
    // =====================================================
    
    'modules' => [
        'auth' => [
            'enabled' => true,
            'registration_enabled' => true,
            'email_verification' => false,
            'password_reset' => true,
            'remember_me' => true,
            'max_login_attempts' => 5,
            'lockout_duration' => 900, // 15 minutes
        ],
        'calculator' => [
            'enabled' => true,
            'max_batch_size' => 10000, // ml
            'default_vg_ratio' => 70,
            'default_pg_ratio' => 30,
            'max_nicotine_strength' => 100, // mg/ml
            'precision' => 2, // decimal places
        ],
        'aromas' => [
            'enabled' => true,
            'items_per_page' => 24,
            'max_favorites' => 100,
            'image_upload' => true,
            'max_image_size' => 2048, // KB
            'allowed_extensions' => ['jpg', 'jpeg', 'png', 'webp'],
        ],
        'recipes' => [
            'enabled' => true,
            'items_per_page' => 12,
            'max_recipes_per_user' => 50,
            'max_ingredients' => 20,
            'public_by_default' => true,
            'comments_enabled' => true,
            'ratings_enabled' => true,
        ],
        'admin' => [
            'enabled' => true,
            'items_per_page' => 50,
            'backup_enabled' => true,
            'maintenance_mode' => false,
        ],
        'favorites' => [
            'enabled' => true,
            'max_favorites_per_user' => 200,
        ],
        'ratings' => [
            'enabled' => true,
            'scale' => 5, // 1-5 stars
            'allow_reviews' => true,
            'max_review_length' => 1000,
        ],
        'comments' => [
            'enabled' => true,
            'max_comment_length' => 500,
            'nested_comments' => true,
            'max_nesting_level' => 3,
            'moderation' => false,
        ],
        'users' => [
            'enabled' => true,
            'public_profiles' => true,
            'avatar_upload' => true,
            'max_avatar_size' => 1024, // KB
        ],
    ],
    
    // =====================================================
    // API CONFIGURATION
    // =====================================================
    
    'api' => [
        'version' => 'v1',
        'rate_limiting' => [
            'enabled' => true,
            'requests_per_minute' => 60,
            'requests_per_hour' => 1000,
        ],
        'cors' => [
            'enabled' => true,
            'allowed_origins' => ['*'],
            'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With'],
        ],
        'authentication' => [
            'required' => false, // Global API auth requirement
            'token_lifetime' => 3600, // 1 hour
        ],
    ],
    
    // =====================================================
    // FILE UPLOAD SETTINGS
    // =====================================================
    
    'uploads' => [
        'max_file_size' => 5120, // KB (5MB)
        'allowed_types' => [
            'images' => ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            'documents' => ['pdf', 'doc', 'docx', 'txt'],
        ],
        'paths' => [
            'images' => 'uploads/images/',
            'documents' => 'uploads/documents/',
            'temp' => 'uploads/temp/',
        ],
        'image_processing' => [
            'resize' => true,
            'max_width' => 1920,
            'max_height' => 1080,
            'quality' => 85,
            'thumbnails' => [
                'small' => [150, 150],
                'medium' => [300, 300],
                'large' => [600, 600],
            ],
        ],
    ],
    
    // =====================================================
    // CACHING CONFIGURATION
    // =====================================================
    
    'cache' => [
        'enabled' => true,
        'driver' => 'file', // file, redis, memcached
        'ttl' => 3600, // 1 hour default
        'paths' => [
            'file' => 'cache/',
        ],
        'keys' => [
            'aromas' => 'aromas_list',
            'recipes' => 'recipes_list',
            'settings' => 'system_settings',
        ],
    ],
    
    // =====================================================
    // LOGGING CONFIGURATION
    // =====================================================
    
    'logging' => [
        'enabled' => true,
        'level' => 'info', // debug, info, warning, error
        'channels' => [
            'application' => 'logs/app.log',
            'database' => 'logs/database.log',
            'security' => 'logs/security.log',
            'api' => 'logs/api.log',
        ],
        'rotation' => [
            'enabled' => true,
            'max_files' => 30,
            'max_size' => 10240, // KB (10MB)
        ],
    ],
    
    // =====================================================
    // EMAIL CONFIGURATION
    // =====================================================
    
    'mail' => [
        'enabled' => false, // Enable when SMTP is configured
        'driver' => 'smtp', // smtp, sendmail, mail
        'host' => 'smtp.example.com',
        'port' => 587,
        'username' => '',
        'password' => '',
        'encryption' => 'tls', // tls, ssl, null
        'from' => [
            'address' => 'noreply@vapex.local',
            'name' => 'VapeX E-Liquid Calculator',
        ],
    ],
    
    // =====================================================
    // FRONTEND ASSETS
    // =====================================================
    
    'assets' => [
        'css' => [
            'tailwind' => 'https://cdn.tailwindcss.com',
            'material_icons' => 'https://fonts.googleapis.com/icon?family=Material+Icons',
            'roboto_font' => 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
            'custom' => 'assets/css/custom.css',
        ],
        'js' => [
            'main' => 'assets/js/main.js',
            'calculator' => 'assets/js/calculator.js',
            'components' => 'assets/js/components.js',
        ],
        'versioning' => [
            'enabled' => true,
            'strategy' => 'timestamp', // timestamp, hash, version
        ],
    ],
    
    // =====================================================
    // DEVELOPMENT SETTINGS
    // =====================================================
    
    'development' => [
        'error_reporting' => E_ALL,
        'display_errors' => true,
        'log_errors' => true,
        'debug_bar' => true,
        'query_logging' => true,
        'profiling' => false,
    ],
    
    // =====================================================
    // PRODUCTION SETTINGS
    // =====================================================
    
    'production' => [
        'error_reporting' => E_ERROR | E_WARNING | E_PARSE,
        'display_errors' => false,
        'log_errors' => true,
        'debug_bar' => false,
        'query_logging' => false,
        'profiling' => false,
        'compression' => [
            'gzip' => true,
            'css_minify' => true,
            'js_minify' => true,
        ],
    ],
    
    // =====================================================
    // FEATURE FLAGS
    // =====================================================
    
    'features' => [
        'beta_features' => false,
        'premium_features' => true,
        'social_login' => false,
        'mobile_app_api' => false,
        'analytics' => false,
        'a_b_testing' => false,
    ],
    
];

