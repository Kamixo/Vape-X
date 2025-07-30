<?php
/**
 * VapeX E-Liquid Calculator - Main Entry Point & Router
 * 
 * @version 1.0.0
 * @author VapeX Development Team
 * @created 2025-07-29
 * 
 * This file serves as the main entry point and router for the VapeX application.
 * It handles URL routing, language detection, and module loading.
 */

// Start session for language and user management
session_start();

// Error reporting based on environment
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Define application constants
define('APP_ROOT', __DIR__);
define('APP_VERSION', '1.0.0');
define('APP_NAME', 'VapeX E-Liquid Calculator');

// Load configuration
$config = require_once 'config/app.php';

// Load core classes
require_once 'core/i18n/I18n.php';

// Initialize internationalization
I18n::init();

// Load common translations
I18n::loadModule('common');

// Get current language for HTML lang attribute
$currentLang = I18n::getCurrentLanguage();
$currentLangName = I18n::getCurrentLanguageName();
$isRTL = I18n::getDirection() === 'rtl';

// Simple routing - parse the URL
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);
$path = trim($path, '/');

// Remove query parameters for routing
$route = explode('?', $path)[0];
$route = $route ?: 'home';

// Define available routes
$routes = [
    'home' => 'home',
    '' => 'home',
    'calculator' => 'calculator',
    'rechner' => 'calculator', // German alias
    'aromas' => 'aromas',
    'aromen' => 'aromas', // German alias
    'recipes' => 'recipes',
    'rezepte' => 'recipes', // German alias
    'favorites' => 'favorites',
    'favoriten' => 'favorites', // German alias
    'profile' => 'profile',
    'profil' => 'profile', // German alias
    'admin' => 'admin',
    'login' => 'auth/login',
    'register' => 'auth/register',
    'logout' => 'auth/logout',
    'api' => 'api'
];

// Determine which page to load
$page = $routes[$route] ?? '404';

// Handle API requests separately
if (strpos($route, 'api/') === 0) {
    // API routing will be handled separately
    include 'api/router.php';
    exit;
}

// Handle language switching
if (isset($_GET['lang']) && I18n::isSupported($_GET['lang'])) {
    I18n::setLanguage($_GET['lang']);
    // Redirect to remove lang parameter from URL
    $redirectUrl = strtok($_SERVER['REQUEST_URI'], '?');
    header("Location: $redirectUrl");
    exit;
}

?>
<!DOCTYPE html>
<html lang="<?php echo $currentLang; ?>" dir="<?php echo $isRTL ? 'rtl' : 'ltr'; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?php echo __('site_description'); ?>">
    <meta name="keywords" content="e-liquid, calculator, vape, aromas, recipes, nicotine">
    <meta name="author" content="VapeX Development Team">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="<?php echo __('site_name'); ?>">
    <meta property="og:description" content="<?php echo __('site_description'); ?>">
    <meta property="og:url" content="<?php echo $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']; ?>">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="<?php echo __('site_name'); ?>">
    <meta property="twitter:description" content="<?php echo __('site_description'); ?>">
    
    <title><?php echo __('site_name'); ?></title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="assets/images/favicon.ico">
    <link rel="apple-touch-icon" href="assets/images/apple-touch-icon.png">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts - Roboto -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    
    <!-- Material Icons -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    
    <!-- Existing Default CSS (preserved) -->
    <?php if (file_exists('default.css')): ?>
        <link rel="stylesheet" href="default.css?v=<?php echo APP_VERSION; ?>">
    <?php endif; ?>
    
    <!-- Custom CSS Extensions -->
    <link rel="stylesheet" href="assets/css/custom.css?v=<?php echo APP_VERSION; ?>">
    
    <!-- Tailwind Configuration -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        'roboto': ['Roboto', 'sans-serif'],
                    },
                    colors: {
                        'vape-purple': '#6366f1',
                        'vape-blue': '#3b82f6',
                        'vape-green': '#10b981',
                        'vape-orange': '#f59e0b',
                        'vape-red': '#ef4444',
                        'vape-gray': '#6b7280',
                        'vape-dark': '#1f2937',
                    }
                }
            }
        }
    </script>
    
    <!-- App Configuration for JavaScript -->
    <script>
        window.VapeX = {
            config: {
                language: '<?php echo $currentLang; ?>',
                isRTL: <?php echo $isRTL ? 'true' : 'false'; ?>,
                version: '<?php echo APP_VERSION; ?>',
                apiUrl: '/api/v1/',
                assetsUrl: '/assets/'
            },
            i18n: {
                // Common translations for JavaScript
                loading: '<?php echo __('common.loading'); ?>',
                error: '<?php echo __('common.error'); ?>',
                success: '<?php echo __('common.success'); ?>',
                cancel: '<?php echo __('common.cancel'); ?>',
                save: '<?php echo __('common.save'); ?>',
                delete: '<?php echo __('common.delete'); ?>',
                confirm: '<?php echo __('messages.are_you_sure'); ?>'
            }
        };
    </script>
</head>
<body class="font-roboto bg-gray-50 text-gray-900">
    
    <!-- Language Selector (Top Bar) -->
    <div class="bg-gray-800 text-white py-1">
        <div class="container mx-auto px-4 flex justify-end items-center text-sm">
            <div class="flex items-center space-x-2">
                <span class="material-icons text-sm">language</span>
                <select id="languageSelector" class="bg-transparent border-none text-white text-sm cursor-pointer">
                    <?php foreach (I18n::getSupportedLanguages() as $code => $name): ?>
                        <option value="<?php echo $code; ?>" <?php echo $code === $currentLang ? 'selected' : ''; ?>>
                            <?php echo $name; ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>
    </div>
    
    <!-- Main Navigation -->
    <nav class="bg-white shadow-lg sticky top-0 z-50">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center py-4">
                
                <!-- Logo -->
                <div class="flex items-center">
                    <a href="/" class="flex items-center space-x-2">
                        <div class="w-8 h-8 bg-vape-blue rounded-lg flex items-center justify-center">
                            <span class="material-icons text-white text-lg">science</span>
                        </div>
                        <span class="text-xl font-bold text-vape-dark">VapeX</span>
                    </a>
                </div>
                
                <!-- Main Navigation Links -->
                <div class="hidden md:flex items-center space-x-6">
                    <a href="/" class="flex items-center space-x-1 text-gray-700 hover:text-vape-blue transition-colors <?php echo $page === 'home' ? 'text-vape-blue font-medium' : ''; ?>">
                        <span class="material-icons text-sm">home</span>
                        <span><?php echo __('navigation.home'); ?></span>
                    </a>
                    <a href="/calculator" class="flex items-center space-x-1 text-gray-700 hover:text-vape-blue transition-colors <?php echo $page === 'calculator' ? 'text-vape-blue font-medium' : ''; ?>">
                        <span class="material-icons text-sm">calculate</span>
                        <span><?php echo __('navigation.calculator'); ?></span>
                    </a>
                    <a href="/aromas" class="flex items-center space-x-1 text-gray-700 hover:text-vape-blue transition-colors <?php echo $page === 'aromas' ? 'text-vape-blue font-medium' : ''; ?>">
                        <span class="material-icons text-sm">local_florist</span>
                        <span><?php echo __('navigation.aromas'); ?></span>
                    </a>
                    <a href="/recipes" class="flex items-center space-x-1 text-gray-700 hover:text-vape-blue transition-colors <?php echo $page === 'recipes' ? 'text-vape-blue font-medium' : ''; ?>">
                        <span class="material-icons text-sm">menu_book</span>
                        <span><?php echo __('navigation.recipes'); ?></span>
                    </a>
                </div>
                
                <!-- User Actions -->
                <div class="flex items-center space-x-4">
                    <!-- Search Button -->
                    <button class="text-gray-700 hover:text-vape-blue transition-colors">
                        <span class="material-icons">search</span>
                    </button>
                    
                    <!-- User Menu -->
                    <div class="flex items-center space-x-2">
                        <a href="/login" class="text-gray-700 hover:text-vape-blue transition-colors">
                            <?php echo __('navigation.login'); ?>
                        </a>
                        <span class="text-gray-400">|</span>
                        <a href="/register" class="bg-vape-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                            <?php echo __('navigation.register'); ?>
                        </a>
                    </div>
                    
                    <!-- Mobile Menu Button -->
                    <button class="md:hidden text-gray-700 hover:text-vape-blue transition-colors">
                        <span class="material-icons">menu</span>
                    </button>
                </div>
                
            </div>
        </div>
    </nav>
    
    <!-- Main Content -->
    <main class="min-h-screen">
        <?php
        // Load the appropriate page content
        switch ($page) {
            case 'home':
                include 'templates/pages/home.php';
                break;
            case 'calculator':
                I18n::loadModule('calculator');
                include 'templates/pages/calculator.php';
                break;
            case 'aromas':
                I18n::loadModule('aromas');
                include 'templates/pages/aromas.php';
                break;
            case 'recipes':
                I18n::loadModule('recipes');
                include 'templates/pages/recipes.php';
                break;
            case 'favorites':
                I18n::loadModule('favorites');
                include 'templates/pages/favorites.php';
                break;
            case 'profile':
                I18n::loadModule('users');
                include 'templates/pages/profile.php';
                break;
            case 'admin':
                I18n::loadModule('admin');
                include 'templates/pages/admin.php';
                break;
            case 'auth/login':
                I18n::loadModule('auth');
                include 'templates/pages/auth/login.php';
                break;
            case 'auth/register':
                I18n::loadModule('auth');
                include 'templates/pages/auth/register.php';
                break;
            case 'auth/logout':
                // Handle logout logic
                session_destroy();
                header('Location: /');
                exit;
                break;
            default:
                include 'templates/pages/404.php';
                break;
        }
        ?>
    </main>
    
    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8 mt-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                
                <!-- About -->
                <div>
                    <h3 class="text-lg font-semibold mb-4"><?php echo __('common.about'); ?></h3>
                    <p class="text-gray-300 text-sm">
                        <?php echo __('site_description'); ?>
                    </p>
                </div>
                
                <!-- Quick Links -->
                <div>
                    <h3 class="text-lg font-semibold mb-4"><?php echo __('navigation.home'); ?></h3>
                    <ul class="space-y-2 text-sm">
                        <li><a href="/calculator" class="text-gray-300 hover:text-white transition-colors"><?php echo __('navigation.calculator'); ?></a></li>
                        <li><a href="/aromas" class="text-gray-300 hover:text-white transition-colors"><?php echo __('navigation.aromas'); ?></a></li>
                        <li><a href="/recipes" class="text-gray-300 hover:text-white transition-colors"><?php echo __('navigation.recipes'); ?></a></li>
                    </ul>
                </div>
                
                <!-- Support -->
                <div>
                    <h3 class="text-lg font-semibold mb-4"><?php echo __('common.help'); ?></h3>
                    <ul class="space-y-2 text-sm">
                        <li><a href="/help" class="text-gray-300 hover:text-white transition-colors"><?php echo __('common.help'); ?></a></li>
                        <li><a href="/contact" class="text-gray-300 hover:text-white transition-colors"><?php echo __('common.contact'); ?></a></li>
                        <li><a href="/privacy" class="text-gray-300 hover:text-white transition-colors"><?php echo __('common.privacy'); ?></a></li>
                    </ul>
                </div>
                
                <!-- Language & Version -->
                <div>
                    <h3 class="text-lg font-semibold mb-4"><?php echo __('language.current'); ?></h3>
                    <p class="text-gray-300 text-sm mb-2">
                        <?php echo $currentLangName; ?>
                    </p>
                    <p class="text-gray-400 text-xs">
                        Version <?php echo APP_VERSION; ?>
                    </p>
                </div>
                
            </div>
            
            <!-- Copyright -->
            <div class="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
                <p>&copy; <?php echo date('Y'); ?> VapeX E-Liquid Calculator. <?php echo __('common.all'); ?> rights reserved.</p>
            </div>
        </div>
    </footer>
    
    <!-- Search Data -->
    <script>
        // Load search data for JavaScript modules
        <?php
        $searchDataPath = __DIR__ . '/data/search-data.json';
        if (file_exists($searchDataPath)) {
            $searchDataContent = file_get_contents($searchDataPath);
            echo "const searchData = " . $searchDataContent . ";";
        } else {
            echo "const searchData = {aromas: [], categories: [], brands: []};";
        }
        ?>
    </script>
    
    <!-- Embedded JavaScript -->
    <script src="assets/js/main.js?v=<?php echo APP_VERSION; ?>"></script>
    
    <!-- Search Engine (Embedded) -->
    <script>
        <?php
        $searchEngineJs = __DIR__ . '/assets/js/search-engine.js';
        if (file_exists($searchEngineJs)) {
            echo file_get_contents($searchEngineJs);
        }
        ?>
    </script>
    
    <!-- Live Search (Embedded) -->
    <script>
        <?php
        $liveSearchJs = __DIR__ . '/assets/js/live-search.js';
        if (file_exists($liveSearchJs)) {
            echo file_get_contents($liveSearchJs);
        }
        ?>
    </script>
    
    <!-- Language Selector Script -->
    <script>
        document.getElementById('languageSelector').addEventListener('change', function() {
            const selectedLang = this.value;
            const currentUrl = window.location.pathname;
            window.location.href = currentUrl + '?lang=' + selectedLang;
        });
    </script>
    
    <!-- Search Module Initialization -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize search system if search data is available
            if (typeof searchData !== 'undefined' && window.SearchEngine) {
                const searchEngine = new SearchEngine(searchData);
                const liveSearch = new LiveSearch(searchEngine);
                
                // Initialize search for all contexts
                liveSearch.init();
                
                console.log('Search system initialized successfully');
            }
        });
    </script>
    
</body>
</html>

