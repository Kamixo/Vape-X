<?php
/**
 * VapeX E-Liquid Calculator - 404 Error Page Template
 */
?>

<section class="min-h-screen flex items-center justify-center bg-gray-50 py-12">
    <div class="max-w-md mx-auto text-center px-4">
        
        <!-- 404 Icon -->
        <div class="mb-8">
            <div class="w-24 h-24 bg-vape-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="material-icons text-white text-4xl">error_outline</span>
            </div>
            <h1 class="text-6xl font-bold text-gray-900 mb-2">404</h1>
        </div>
        
        <!-- Error Message -->
        <div class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">
                <?php echo __('messages.not_found', 'Seite nicht gefunden'); ?>
            </h2>
            <p class="text-gray-600 mb-6">
                <?php echo __('404.description', 'Die angeforderte Seite konnte nicht gefunden werden. Möglicherweise wurde sie verschoben oder gelöscht.'); ?>
            </p>
        </div>
        
        <!-- Action Buttons -->
        <div class="space-y-4">
            <a href="/" class="block w-full bg-vape-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                <span class="material-icons mr-2 text-sm">home</span>
                <?php echo __('navigation.home'); ?>
            </a>
            
            <div class="flex gap-3">
                <a href="/calculator" class="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center">
                    <?php echo __('navigation.calculator'); ?>
                </a>
                <a href="/aromas" class="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center">
                    <?php echo __('navigation.aromas'); ?>
                </a>
            </div>
            
            <button onclick="history.back()" class="w-full text-gray-500 hover:text-gray-700 transition-colors py-2">
                <span class="material-icons mr-1 text-sm">arrow_back</span>
                <?php echo __('common.back'); ?>
            </button>
        </div>
        
        <!-- Language Info -->
        <div class="mt-8 pt-8 border-t border-gray-200">
            <p class="text-sm text-gray-500">
                <?php echo __('language.current'); ?>: <?php echo I18n::getCurrentLanguageName(); ?>
            </p>
        </div>
        
    </div>
</section>

