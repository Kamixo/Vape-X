<?php
/**
 * VapeX E-Liquid Calculator - Home Page Template
 */
?>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-vape-blue to-vape-purple text-white py-20">
    <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold mb-6">
            <?php echo __('site_name'); ?>
        </h1>
        <p class="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            <?php echo __('site_description'); ?>
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/calculator" class="bg-white text-vape-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center">
                <span class="material-icons mr-2">calculate</span>
                <?php echo __('navigation.calculator'); ?>
            </a>
            <a href="/aromas" class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-vape-blue transition-colors inline-flex items-center">
                <span class="material-icons mr-2">local_florist</span>
                <?php echo __('navigation.aromas'); ?>
            </a>
        </div>
    </div>
</section>

<!-- Features Section -->
<section class="py-16 bg-white">
    <div class="container mx-auto px-4">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
                <?php echo __('common.features', 'Funktionen'); ?>
            </h2>
            <p class="text-gray-600 max-w-2xl mx-auto">
                <?php echo __('home.features_description', 'Professionelle Tools für die perfekte E-Liquid Mischung'); ?>
            </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <!-- Calculator Feature -->
            <div class="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div class="w-16 h-16 bg-vape-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="material-icons text-white text-2xl">calculate</span>
                </div>
                <h3 class="text-xl font-semibold mb-2"><?php echo __('navigation.calculator'); ?></h3>
                <p class="text-gray-600 text-sm">
                    <?php echo __('home.calculator_description', 'Präzise Berechnungen für perfekte Mischungen'); ?>
                </p>
            </div>
            
            <!-- Aromas Feature -->
            <div class="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div class="w-16 h-16 bg-vape-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="material-icons text-white text-2xl">local_florist</span>
                </div>
                <h3 class="text-xl font-semibold mb-2"><?php echo __('navigation.aromas'); ?></h3>
                <p class="text-gray-600 text-sm">
                    <?php echo __('home.aromas_description', 'Umfangreiche Datenbank mit allen wichtigen Aromen'); ?>
                </p>
            </div>
            
            <!-- Recipes Feature -->
            <div class="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div class="w-16 h-16 bg-vape-orange rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="material-icons text-white text-2xl">menu_book</span>
                </div>
                <h3 class="text-xl font-semibold mb-2"><?php echo __('navigation.recipes'); ?></h3>
                <p class="text-gray-600 text-sm">
                    <?php echo __('home.recipes_description', 'Community-Rezepte und eigene Kreationen verwalten'); ?>
                </p>
            </div>
            
            <!-- Multilingual Feature -->
            <div class="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div class="w-16 h-16 bg-vape-purple rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="material-icons text-white text-2xl">language</span>
                </div>
                <h3 class="text-xl font-semibold mb-2"><?php echo __('language.current'); ?></h3>
                <p class="text-gray-600 text-sm">
                    <?php echo __('home.multilingual_description', 'Verfügbar in 7 Sprachen mit automatischer Erkennung'); ?>
                </p>
            </div>
            
        </div>
    </div>
</section>

<!-- Language Demo Section -->
<section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
                <?php echo __('language.select'); ?>
            </h2>
            <p class="text-gray-600 mb-8">
                <?php echo __('home.language_demo', 'Testen Sie die automatische Spracherkennung'); ?>
            </p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 max-w-4xl mx-auto">
            <?php foreach (I18n::getSupportedLanguages() as $code => $name): ?>
                <a href="?lang=<?php echo $code; ?>" 
                   class="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-vape-blue hover:shadow-md transition-all <?php echo $code === $currentLang ? 'border-vape-blue bg-blue-50' : ''; ?>">
                    <div class="text-2xl mb-2">
                        <?php
                        $flags = [
                            'de' => '🇩🇪',
                            'en' => '🇬🇧', 
                            'fr' => '🇫🇷',
                            'it' => '🇮🇹',
                            'nl' => '🇳🇱',
                            'ru' => '🇷🇺',
                            'es' => '🇪🇸'
                        ];
                        echo $flags[$code] ?? '🌍';
                        ?>
                    </div>
                    <span class="text-sm font-medium text-gray-700"><?php echo $name; ?></span>
                    <?php if ($code === $currentLang): ?>
                        <span class="text-xs text-vape-blue mt-1">✓ <?php echo __('common.active'); ?></span>
                    <?php endif; ?>
                </a>
            <?php endforeach; ?>
        </div>
        
        <div class="text-center mt-8">
            <p class="text-sm text-gray-500">
                <?php echo __('home.current_language', 'Aktuelle Sprache'); ?>: 
                <strong><?php echo I18n::getCurrentLanguageName(); ?></strong>
                (<?php echo __('language.auto_detect', 'Automatisch erkannt'); ?>)
            </p>
        </div>
    </div>
</section>

<!-- Quick Start Section -->
<section class="py-16 bg-white">
    <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">
                    <?php echo __('home.quick_start', 'Schnellstart'); ?>
                </h2>
                <p class="text-gray-600">
                    <?php echo __('home.quick_start_description', 'In wenigen Schritten zu Ihrer perfekten E-Liquid Mischung'); ?>
                </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <!-- Step 1 -->
                <div class="text-center">
                    <div class="w-12 h-12 bg-vape-blue text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                        1
                    </div>
                    <h3 class="text-lg font-semibold mb-2">
                        <?php echo __('home.step1_title', 'Aromen wählen'); ?>
                    </h3>
                    <p class="text-gray-600 text-sm">
                        <?php echo __('home.step1_description', 'Durchsuchen Sie unsere umfangreiche Aromen-Datenbank'); ?>
                    </p>
                </div>
                
                <!-- Step 2 -->
                <div class="text-center">
                    <div class="w-12 h-12 bg-vape-green text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                        2
                    </div>
                    <h3 class="text-lg font-semibold mb-2">
                        <?php echo __('home.step2_title', 'Berechnen'); ?>
                    </h3>
                    <p class="text-gray-600 text-sm">
                        <?php echo __('home.step2_description', 'Nutzen Sie unseren präzisen Rechner für perfekte Ergebnisse'); ?>
                    </p>
                </div>
                
                <!-- Step 3 -->
                <div class="text-center">
                    <div class="w-12 h-12 bg-vape-orange text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                        3
                    </div>
                    <h3 class="text-lg font-semibold mb-2">
                        <?php echo __('home.step3_title', 'Mischen & Genießen'); ?>
                    </h3>
                    <p class="text-gray-600 text-sm">
                        <?php echo __('home.step3_description', 'Folgen Sie der Anleitung und genießen Sie Ihr E-Liquid'); ?>
                    </p>
                </div>
                
            </div>
            
            <div class="text-center mt-12">
                <a href="/calculator" class="bg-vape-blue text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors inline-flex items-center">
                    <span class="material-icons mr-2">play_arrow</span>
                    <?php echo __('home.start_now', 'Jetzt starten'); ?>
                </a>
            </div>
        </div>
    </div>
</section>

<!-- Statistics Section -->
<section class="py-16 bg-gray-900 text-white">
    <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <div>
                <div class="text-3xl font-bold text-vape-blue mb-2">25+</div>
                <div class="text-gray-300"><?php echo __('home.stat_aromas', 'Aromen'); ?></div>
            </div>
            
            <div>
                <div class="text-3xl font-bold text-vape-green mb-2">15+</div>
                <div class="text-gray-300"><?php echo __('home.stat_recipes', 'Rezepte'); ?></div>
            </div>
            
            <div>
                <div class="text-3xl font-bold text-vape-orange mb-2">7</div>
                <div class="text-gray-300"><?php echo __('home.stat_languages', 'Sprachen'); ?></div>
            </div>
            
            <div>
                <div class="text-3xl font-bold text-vape-purple mb-2">100%</div>
                <div class="text-gray-300"><?php echo __('home.stat_free', 'Kostenlos'); ?></div>
            </div>
            
        </div>
    </div>
</section>

