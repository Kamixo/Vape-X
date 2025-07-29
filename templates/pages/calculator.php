<?php
/**
 * VapeX E-Liquid Calculator - Calculator Page Template
 */
?>

<!-- Page Header -->
<section class="bg-gradient-to-r from-vape-blue to-vape-purple text-white py-12">
    <div class="container mx-auto px-4">
        <div class="text-center">
            <h1 class="text-4xl font-bold mb-4">
                <?php echo __('calculator.title'); ?>
            </h1>
            <p class="text-xl opacity-90 max-w-2xl mx-auto">
                <?php echo __('calculator.subtitle'); ?>
            </p>
        </div>
    </div>
</section>

<!-- Calculator Interface -->
<section class="py-12 bg-gray-50">
    <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
            
            <!-- Tab Navigation -->
            <div class="bg-white rounded-lg shadow-lg mb-8">
                <div class="border-b border-gray-200">
                    <nav class="flex">
                        <button class="px-6 py-4 text-vape-blue border-b-2 border-vape-blue font-medium">
                            <?php echo __('calculator.tabs.simple'); ?>
                        </button>
                        <button class="px-6 py-4 text-gray-500 hover:text-gray-700 font-medium">
                            <?php echo __('calculator.tabs.advanced'); ?>
                        </button>
                        <button class="px-6 py-4 text-gray-500 hover:text-gray-700 font-medium">
                            <?php echo __('calculator.tabs.batch'); ?>
                        </button>
                        <button class="px-6 py-4 text-gray-500 hover:text-gray-700 font-medium">
                            <?php echo __('calculator.tabs.converter'); ?>
                        </button>
                    </nav>
                </div>
                
                <!-- Simple Calculator Content -->
                <div class="p-8">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        <!-- Input Form -->
                        <div>
                            <h3 class="text-xl font-semibold mb-6 text-gray-900">
                                <?php echo __('calculator.inputs.title', 'Eingaben'); ?>
                            </h3>
                            
                            <div class="space-y-6">
                                
                                <!-- Target Volume -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <?php echo __('calculator.inputs.target_volume'); ?>
                                    </label>
                                    <div class="relative">
                                        <input type="number" 
                                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vape-blue focus:border-transparent"
                                               placeholder="<?php echo __('calculator.placeholders.enter_volume'); ?>"
                                               value="10">
                                        <span class="absolute right-3 top-3 text-gray-500 text-sm">ml</span>
                                    </div>
                                </div>
                                
                                <!-- Target Nicotine -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <?php echo __('calculator.inputs.target_nicotine'); ?>
                                    </label>
                                    <div class="relative">
                                        <input type="number" 
                                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vape-blue focus:border-transparent"
                                               placeholder="<?php echo __('calculator.placeholders.enter_nicotine'); ?>"
                                               value="3">
                                        <span class="absolute right-3 top-3 text-gray-500 text-sm">mg/ml</span>
                                    </div>
                                </div>
                                
                                <!-- VG/PG Ratio -->
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            <?php echo __('calculator.inputs.vg_ratio'); ?>
                                        </label>
                                        <div class="relative">
                                            <input type="number" 
                                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vape-blue focus:border-transparent"
                                                   value="70">
                                            <span class="absolute right-3 top-3 text-gray-500 text-sm">%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            <?php echo __('calculator.inputs.pg_ratio'); ?>
                                        </label>
                                        <div class="relative">
                                            <input type="number" 
                                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vape-blue focus:border-transparent"
                                                   value="30">
                                            <span class="absolute right-3 top-3 text-gray-500 text-sm">%</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Base Nicotine -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <?php echo __('calculator.inputs.base_nicotine'); ?>
                                    </label>
                                    <div class="relative">
                                        <input type="number" 
                                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vape-blue focus:border-transparent"
                                               value="20">
                                        <span class="absolute right-3 top-3 text-gray-500 text-sm">mg/ml</span>
                                    </div>
                                </div>
                                
                                <!-- Total Aroma -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <?php echo __('calculator.inputs.total_aroma'); ?>
                                    </label>
                                    <div class="relative">
                                        <input type="number" 
                                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vape-blue focus:border-transparent"
                                               value="10">
                                        <span class="absolute right-3 top-3 text-gray-500 text-sm">%</span>
                                    </div>
                                </div>
                                
                                <!-- Calculate Button -->
                                <button class="w-full bg-vape-blue text-white py-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center">
                                    <span class="material-icons mr-2">calculate</span>
                                    <?php echo __('calculator.buttons.calculate'); ?>
                                </button>
                                
                            </div>
                        </div>
                        
                        <!-- Results -->
                        <div>
                            <h3 class="text-xl font-semibold mb-6 text-gray-900">
                                <?php echo __('calculator.results.title'); ?>
                            </h3>
                            
                            <div class="bg-gray-50 rounded-lg p-6 mb-6">
                                <h4 class="font-medium text-gray-900 mb-4">
                                    <?php echo __('calculator.results.summary'); ?>
                                </h4>
                                <div class="space-y-3 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600"><?php echo __('calculator.results.total_volume'); ?>:</span>
                                        <span class="font-medium">10.00 ml</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600"><?php echo __('calculator.results.final_nicotine'); ?>:</span>
                                        <span class="font-medium">3.00 mg/ml</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600"><?php echo __('calculator.results.final_vg_pg'); ?>:</span>
                                        <span class="font-medium">70/30</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="bg-white border border-gray-200 rounded-lg p-6">
                                <h4 class="font-medium text-gray-900 mb-4">
                                    <?php echo __('calculator.results.ingredients'); ?>
                                </h4>
                                <div class="space-y-3">
                                    <div class="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span class="text-gray-700"><?php echo __('calculator.ingredients.nicotine_base'); ?></span>
                                        <span class="font-medium text-vape-blue">1.50 ml</span>
                                    </div>
                                    <div class="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span class="text-gray-700"><?php echo __('calculator.ingredients.vg_base'); ?></span>
                                        <span class="font-medium text-vape-green">5.50 ml</span>
                                    </div>
                                    <div class="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span class="text-gray-700"><?php echo __('calculator.ingredients.pg_base'); ?></span>
                                        <span class="font-medium text-vape-orange">2.00 ml</span>
                                    </div>
                                    <div class="flex justify-between items-center py-2">
                                        <span class="text-gray-700"><?php echo __('calculator.ingredients.aroma_total'); ?></span>
                                        <span class="font-medium text-vape-purple">1.00 ml</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Action Buttons -->
                            <div class="flex gap-3 mt-6">
                                <button class="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
                                    <span class="material-icons mr-2 text-sm">save</span>
                                    <?php echo __('calculator.buttons.save_recipe'); ?>
                                </button>
                                <button class="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
                                    <span class="material-icons mr-2 text-sm">print</span>
                                    <?php echo __('calculator.buttons.print'); ?>
                                </button>
                                <button class="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
                                    <span class="material-icons mr-2 text-sm">share</span>
                                    <?php echo __('calculator.buttons.share'); ?>
                                </button>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            
            <!-- Tips Section -->
            <div class="bg-white rounded-lg shadow-lg p-8">
                <h3 class="text-xl font-semibold mb-6 text-gray-900">
                    <?php echo __('calculator.tips.title'); ?>
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <div class="p-4 bg-blue-50 rounded-lg">
                        <div class="flex items-center mb-3">
                            <span class="material-icons text-vape-blue mr-2">lightbulb</span>
                            <h4 class="font-medium text-gray-900"><?php echo __('calculator.tips.beginner'); ?></h4>
                        </div>
                        <p class="text-sm text-gray-600">
                            <?php echo __('calculator.tips.beginner_text', 'Beginnen Sie mit einfachen Mischungen und niedrigen Aroma-Anteilen.'); ?>
                        </p>
                    </div>
                    
                    <div class="p-4 bg-green-50 rounded-lg">
                        <div class="flex items-center mb-3">
                            <span class="material-icons text-vape-green mr-2">security</span>
                            <h4 class="font-medium text-gray-900"><?php echo __('calculator.tips.safety'); ?></h4>
                        </div>
                        <p class="text-sm text-gray-600">
                            <?php echo __('calculator.tips.safety_text', 'Tragen Sie Handschuhe beim Umgang mit Nikotin-Basis.'); ?>
                        </p>
                    </div>
                    
                    <div class="p-4 bg-orange-50 rounded-lg">
                        <div class="flex items-center mb-3">
                            <span class="material-icons text-vape-orange mr-2">schedule</span>
                            <h4 class="font-medium text-gray-900"><?php echo __('calculator.tips.storage'); ?></h4>
                        </div>
                        <p class="text-sm text-gray-600">
                            <?php echo __('calculator.tips.storage_text', 'Lassen Sie Ihr E-Liquid mindestens 24h reifen.'); ?>
                        </p>
                    </div>
                    
                </div>
            </div>
            
        </div>
    </div>
</section>

