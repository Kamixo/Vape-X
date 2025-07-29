<?php
/**
 * VapeX E-Liquid Calculator - Aromas Page Template
 */
?>

<!-- Page Header -->
<section class="bg-gradient-to-r from-vape-green to-vape-blue text-white py-12">
    <div class="container mx-auto px-4">
        <div class="text-center">
            <h1 class="text-4xl font-bold mb-4">
                <?php echo __('navigation.aromas'); ?>
            </h1>
            <p class="text-xl opacity-90 max-w-2xl mx-auto">
                <?php echo __('aromas.description', 'Entdecken Sie unsere umfangreiche Aromen-Datenbank mit detaillierten Informationen'); ?>
            </p>
        </div>
    </div>
</section>

<!-- Search and Filter -->
<section class="py-8 bg-white border-b border-gray-200">
    <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
            <div class="flex flex-col md:flex-row gap-4">
                
                <!-- Search Bar -->
                <div class="flex-1">
                    <div class="relative">
                        <span class="material-icons absolute left-3 top-3 text-gray-400">search</span>
                        <input type="text" 
                               class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vape-green focus:border-transparent"
                               placeholder="<?php echo __('common.search'); ?> <?php echo __('navigation.aromas'); ?>...">
                    </div>
                </div>
                
                <!-- Category Filter -->
                <div class="md:w-48">
                    <select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vape-green focus:border-transparent">
                        <option><?php echo __('common.all'); ?> <?php echo __('forms.category', 'Kategorien'); ?></option>
                        <option><?php echo __('aromas.categories.fruit', 'Frucht'); ?></option>
                        <option><?php echo __('aromas.categories.dessert', 'Dessert'); ?></option>
                        <option><?php echo __('aromas.categories.tobacco', 'Tabak'); ?></option>
                        <option><?php echo __('aromas.categories.menthol', 'Menthol'); ?></option>
                        <option><?php echo __('aromas.categories.beverage', 'Getränk'); ?></option>
                    </select>
                </div>
                
                <!-- Brand Filter -->
                <div class="md:w-48">
                    <select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vape-green focus:border-transparent">
                        <option><?php echo __('common.all'); ?> <?php echo __('aromas.brands', 'Marken'); ?></option>
                        <option>Capella</option>
                        <option>TPA/TFA</option>
                        <option>Flavorah</option>
                        <option>Inawera</option>
                        <option>FlavourArt</option>
                    </select>
                </div>
                
            </div>
        </div>
    </div>
</section>

<!-- Aromas Grid -->
<section class="py-12 bg-gray-50">
    <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
            
            <!-- Results Info -->
            <div class="flex justify-between items-center mb-8">
                <p class="text-gray-600">
                    <?php echo __('aromas.showing_results', 'Zeige {count} von {total} Aromen', ['count' => '25', 'total' => '25']); ?>
                </p>
                <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-500"><?php echo __('common.sort'); ?>:</span>
                    <select class="border border-gray-300 rounded px-3 py-1 text-sm">
                        <option><?php echo __('forms.name'); ?></option>
                        <option><?php echo __('aromas.brand', 'Marke'); ?></option>
                        <option><?php echo __('forms.category'); ?></option>
                        <option><?php echo __('common.popular'); ?></option>
                    </select>
                </div>
            </div>
            
            <!-- Aromas Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                
                <!-- Sample Aroma Cards -->
                <?php 
                $sampleAromas = [
                    ['name' => 'Strawberry', 'brand' => 'Capella', 'category' => 'Fruit', 'percentage' => '8-12%', 'color' => 'red'],
                    ['name' => 'Vanilla Custard', 'brand' => 'Capella', 'category' => 'Dessert', 'percentage' => '5-10%', 'color' => 'yellow'],
                    ['name' => 'Bavarian Cream', 'brand' => 'TPA', 'category' => 'Dessert', 'percentage' => '3-8%', 'color' => 'orange'],
                    ['name' => 'Blueberry', 'brand' => 'TPA', 'category' => 'Fruit', 'percentage' => '6-10%', 'color' => 'blue'],
                    ['name' => 'Graham Cracker', 'brand' => 'TPA', 'category' => 'Dessert', 'percentage' => '4-8%', 'color' => 'yellow'],
                    ['name' => 'Menthol', 'brand' => 'TPA', 'category' => 'Menthol', 'percentage' => '1-3%', 'color' => 'green'],
                    ['name' => 'Caramel', 'brand' => 'Flavorah', 'category' => 'Dessert', 'percentage' => '2-5%', 'color' => 'orange'],
                    ['name' => 'Apple', 'brand' => 'Inawera', 'category' => 'Fruit', 'percentage' => '3-6%', 'color' => 'green']
                ];
                
                foreach ($sampleAromas as $aroma): 
                ?>
                <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                    
                    <!-- Aroma Image/Icon -->
                    <div class="h-32 bg-gradient-to-br from-<?php echo $aroma['color']; ?>-400 to-<?php echo $aroma['color']; ?>-600 flex items-center justify-center">
                        <span class="material-icons text-white text-3xl">local_florist</span>
                    </div>
                    
                    <!-- Aroma Info -->
                    <div class="p-4">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-semibold text-gray-900 text-lg"><?php echo $aroma['name']; ?></h3>
                            <button class="text-gray-400 hover:text-red-500 transition-colors">
                                <span class="material-icons text-sm">favorite_border</span>
                            </button>
                        </div>
                        
                        <p class="text-sm text-gray-600 mb-1"><?php echo $aroma['brand']; ?></p>
                        <p class="text-xs text-gray-500 mb-3"><?php echo $aroma['category']; ?></p>
                        
                        <div class="flex items-center justify-between mb-4">
                            <span class="text-sm font-medium text-vape-green"><?php echo $aroma['percentage']; ?></span>
                            <div class="flex items-center text-xs text-gray-500">
                                <span class="material-icons text-xs mr-1">star</span>
                                <span>4.5 (23)</span>
                            </div>
                        </div>
                        
                        <div class="flex gap-2">
                            <button class="flex-1 bg-vape-green text-white py-2 px-3 rounded text-sm font-medium hover:bg-green-600 transition-colors">
                                <span class="material-icons text-xs mr-1">add</span>
                                <?php echo __('calculator.buttons.add_aroma', 'Hinzufügen'); ?>
                            </button>
                            <button class="px-3 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                                <span class="material-icons text-xs">info</span>
                            </button>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
                
            </div>
            
            <!-- Load More Button -->
            <div class="text-center mt-12">
                <button class="bg-white text-vape-green border-2 border-vape-green px-8 py-3 rounded-lg font-semibold hover:bg-vape-green hover:text-white transition-colors">
                    <?php echo __('common.more', 'Mehr laden'); ?>
                </button>
            </div>
            
        </div>
    </div>
</section>

<!-- Quick Actions -->
<section class="py-12 bg-white">
    <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-8">
                <?php echo __('aromas.quick_actions', 'Schnellaktionen'); ?>
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div class="p-6 border border-gray-200 rounded-lg hover:border-vape-green transition-colors">
                    <span class="material-icons text-vape-green text-3xl mb-4">calculate</span>
                    <h3 class="font-semibold mb-2"><?php echo __('aromas.to_calculator', 'Zum Rechner'); ?></h3>
                    <p class="text-sm text-gray-600 mb-4">
                        <?php echo __('aromas.to_calculator_desc', 'Ausgewählte Aromen direkt im Rechner verwenden'); ?>
                    </p>
                    <button class="text-vape-green font-medium text-sm">
                        <?php echo __('common.select'); ?> →
                    </button>
                </div>
                
                <div class="p-6 border border-gray-200 rounded-lg hover:border-vape-green transition-colors">
                    <span class="material-icons text-vape-green text-3xl mb-4">favorite</span>
                    <h3 class="font-semibold mb-2"><?php echo __('navigation.favorites'); ?></h3>
                    <p class="text-sm text-gray-600 mb-4">
                        <?php echo __('aromas.favorites_desc', 'Ihre Lieblings-Aromen verwalten und organisieren'); ?>
                    </p>
                    <button class="text-vape-green font-medium text-sm">
                        <?php echo __('common.view'); ?> →
                    </button>
                </div>
                
                <div class="p-6 border border-gray-200 rounded-lg hover:border-vape-green transition-colors">
                    <span class="material-icons text-vape-green text-3xl mb-4">menu_book</span>
                    <h3 class="font-semibold mb-2"><?php echo __('navigation.recipes'); ?></h3>
                    <p class="text-sm text-gray-600 mb-4">
                        <?php echo __('aromas.recipes_desc', 'Rezepte mit diesen Aromen entdecken'); ?>
                    </p>
                    <button class="text-vape-green font-medium text-sm">
                        <?php echo __('common.search'); ?> →
                    </button>
                </div>
                
            </div>
        </div>
    </div>
</section>

