<?php
/**
 * VapeX E-Liquid Calculator - Recipes Page Template
 */
?>

<!-- Page Header -->
<section class="bg-gradient-to-r from-vape-orange to-vape-red text-white py-12">
    <div class="container mx-auto px-4">
        <div class="text-center">
            <h1 class="text-4xl font-bold mb-4">
                <?php echo __('navigation.recipes'); ?>
            </h1>
            <p class="text-xl opacity-90 max-w-2xl mx-auto">
                <?php echo __('recipes.description', 'Entdecken Sie bewährte Rezepte der Community oder teilen Sie Ihre eigenen Kreationen'); ?>
            </p>
        </div>
    </div>
</section>

<!-- Search and Filter -->
<section class="py-8 bg-white border-b border-gray-200">
    <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
            <div class="flex flex-col md:flex-row gap-4 mb-6">
                
                <!-- Search Bar -->
                <div class="flex-1">
                    <div class="relative">
                        <span class="material-icons absolute left-3 top-3 text-gray-400">search</span>
                        <input type="text" 
                               class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vape-orange focus:border-transparent"
                               placeholder="<?php echo __('common.search'); ?> <?php echo __('navigation.recipes'); ?>...">
                    </div>
                </div>
                
                <!-- Category Filter -->
                <div class="md:w-48">
                    <select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vape-orange focus:border-transparent">
                        <option><?php echo __('common.all'); ?> <?php echo __('forms.category', 'Kategorien'); ?></option>
                        <option><?php echo __('recipes.categories.fruit', 'Frucht'); ?></option>
                        <option><?php echo __('recipes.categories.dessert', 'Dessert'); ?></option>
                        <option><?php echo __('recipes.categories.tobacco', 'Tabak'); ?></option>
                        <option><?php echo __('recipes.categories.menthol', 'Menthol'); ?></option>
                        <option><?php echo __('recipes.categories.beverage', 'Getränk'); ?></option>
                    </select>
                </div>
                
                <!-- Difficulty Filter -->
                <div class="md:w-48">
                    <select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vape-orange focus:border-transparent">
                        <option><?php echo __('common.all'); ?> <?php echo __('recipes.difficulty', 'Schwierigkeit'); ?></option>
                        <option><?php echo __('recipes.difficulty.easy', 'Einfach'); ?></option>
                        <option><?php echo __('recipes.difficulty.medium', 'Mittel'); ?></option>
                        <option><?php echo __('recipes.difficulty.hard', 'Schwer'); ?></option>
                    </select>
                </div>
                
            </div>
            
            <!-- Quick Filters -->
            <div class="flex flex-wrap gap-2">
                <button class="px-4 py-2 bg-vape-orange text-white rounded-full text-sm font-medium">
                    <?php echo __('common.popular'); ?>
                </button>
                <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                    <?php echo __('common.new'); ?>
                </button>
                <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                    <?php echo __('common.featured'); ?>
                </button>
                <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                    <?php echo __('recipes.single_flavor', 'Single Flavor'); ?>
                </button>
                <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                    <?php echo __('recipes.complex', 'Komplex'); ?>
                </button>
            </div>
        </div>
    </div>
</section>

<!-- Recipes Grid -->
<section class="py-12 bg-gray-50">
    <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
            
            <!-- Results Info -->
            <div class="flex justify-between items-center mb-8">
                <p class="text-gray-600">
                    <?php echo __('recipes.showing_results', 'Zeige {count} von {total} Rezepten', ['count' => '18', 'total' => '18']); ?>
                </p>
                <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2">
                        <span class="text-sm text-gray-500"><?php echo __('common.sort'); ?>:</span>
                        <select class="border border-gray-300 rounded px-3 py-1 text-sm">
                            <option><?php echo __('common.popular'); ?></option>
                            <option><?php echo __('common.recent'); ?></option>
                            <option><?php echo __('common.rating'); ?></option>
                            <option><?php echo __('forms.name'); ?></option>
                        </select>
                    </div>
                    <button class="bg-vape-orange text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                        <span class="material-icons text-sm mr-1">add</span>
                        <?php echo __('recipes.create_new', 'Neues Rezept'); ?>
                    </button>
                </div>
            </div>
            
            <!-- Recipes Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <!-- Sample Recipe Cards -->
                <?php 
                $sampleRecipes = [
                    ['name' => 'Strawberry Cream', 'author' => 'VapeChef', 'rating' => 4.8, 'reviews' => 156, 'difficulty' => 'easy', 'aromas' => 3, 'color' => 'red'],
                    ['name' => 'Vanilla Custard Delight', 'author' => 'MixMaster', 'rating' => 4.9, 'reviews' => 203, 'difficulty' => 'medium', 'aromas' => 4, 'color' => 'yellow'],
                    ['name' => 'Tropical Paradise', 'author' => 'FlavorGuru', 'rating' => 4.7, 'reviews' => 89, 'difficulty' => 'hard', 'aromas' => 6, 'color' => 'green'],
                    ['name' => 'Chocolate Mint', 'author' => 'SweetVaper', 'rating' => 4.6, 'reviews' => 134, 'difficulty' => 'medium', 'aromas' => 3, 'color' => 'purple'],
                    ['name' => 'Apple Pie', 'author' => 'BakingVapes', 'rating' => 4.8, 'reviews' => 178, 'difficulty' => 'hard', 'aromas' => 5, 'color' => 'orange'],
                    ['name' => 'Fresh Menthol', 'author' => 'CoolBreeze', 'rating' => 4.5, 'reviews' => 67, 'difficulty' => 'easy', 'aromas' => 2, 'color' => 'blue']
                ];
                
                foreach ($sampleRecipes as $recipe): 
                ?>
                <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                    
                    <!-- Recipe Image/Icon -->
                    <div class="h-40 bg-gradient-to-br from-<?php echo $recipe['color']; ?>-400 to-<?php echo $recipe['color']; ?>-600 flex items-center justify-center relative">
                        <span class="material-icons text-white text-4xl">menu_book</span>
                        
                        <!-- Difficulty Badge -->
                        <div class="absolute top-3 right-3">
                            <?php
                            $difficultyColors = [
                                'easy' => 'bg-green-500',
                                'medium' => 'bg-yellow-500', 
                                'hard' => 'bg-red-500'
                            ];
                            $difficultyColor = $difficultyColors[$recipe['difficulty']] ?? 'bg-gray-500';
                            ?>
                            <span class="<?php echo $difficultyColor; ?> text-white text-xs px-2 py-1 rounded-full">
                                <?php echo __('recipes.difficulty.' . $recipe['difficulty']); ?>
                            </span>
                        </div>
                        
                        <!-- Favorite Button -->
                        <button class="absolute top-3 left-3 text-white hover:text-red-300 transition-colors">
                            <span class="material-icons">favorite_border</span>
                        </button>
                    </div>
                    
                    <!-- Recipe Info -->
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-900 text-lg mb-1"><?php echo $recipe['name']; ?></h3>
                        <p class="text-sm text-gray-600 mb-3"><?php echo __('common.by', 'von'); ?> <?php echo $recipe['author']; ?></p>
                        
                        <!-- Rating -->
                        <div class="flex items-center mb-3">
                            <div class="flex items-center mr-2">
                                <?php for ($i = 1; $i <= 5; $i++): ?>
                                    <span class="material-icons text-xs <?php echo $i <= floor($recipe['rating']) ? 'text-yellow-400' : 'text-gray-300'; ?>">star</span>
                                <?php endfor; ?>
                            </div>
                            <span class="text-sm text-gray-600"><?php echo $recipe['rating']; ?> (<?php echo $recipe['reviews']; ?>)</span>
                        </div>
                        
                        <!-- Recipe Stats -->
                        <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div class="flex items-center">
                                <span class="material-icons text-xs mr-1">local_florist</span>
                                <span><?php echo $recipe['aromas']; ?> <?php echo __('navigation.aromas'); ?></span>
                            </div>
                            <div class="flex items-center">
                                <span class="material-icons text-xs mr-1">schedule</span>
                                <span><?php echo __('recipes.steeping', 'Reifezeit'); ?>: 3-7d</span>
                            </div>
                        </div>
                        
                        <!-- Action Buttons -->
                        <div class="flex gap-2">
                            <button class="flex-1 bg-vape-orange text-white py-2 px-3 rounded text-sm font-medium hover:bg-orange-600 transition-colors">
                                <span class="material-icons text-xs mr-1">visibility</span>
                                <?php echo __('common.view'); ?>
                            </button>
                            <button class="px-3 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                                <span class="material-icons text-xs">calculate</span>
                            </button>
                            <button class="px-3 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                                <span class="material-icons text-xs">share</span>
                            </button>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
                
            </div>
            
            <!-- Load More Button -->
            <div class="text-center mt-12">
                <button class="bg-white text-vape-orange border-2 border-vape-orange px-8 py-3 rounded-lg font-semibold hover:bg-vape-orange hover:text-white transition-colors">
                    <?php echo __('common.more', 'Mehr laden'); ?>
                </button>
            </div>
            
        </div>
    </div>
</section>

<!-- Featured Section -->
<section class="py-12 bg-white">
    <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">
                    <?php echo __('recipes.featured_recipes', 'Empfohlene Rezepte'); ?>
                </h2>
                <p class="text-gray-600">
                    <?php echo __('recipes.featured_description', 'Von unserer Community besonders empfohlene Rezepte'); ?>
                </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <!-- Featured Recipe 1 -->
                <div class="bg-gradient-to-r from-vape-orange to-vape-red text-white rounded-lg p-6">
                    <div class="flex items-center mb-4">
                        <span class="material-icons text-2xl mr-3">star</span>
                        <div>
                            <h3 class="text-xl font-semibold">Recipe of the Month</h3>
                            <p class="opacity-90">Strawberry Cheesecake Supreme</p>
                        </div>
                    </div>
                    <p class="text-sm opacity-90 mb-4">
                        Ein komplexes aber lohnendes Rezept mit 6 verschiedenen Aromen für den ultimativen Cheesecake-Geschmack.
                    </p>
                    <button class="bg-white text-vape-orange px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors">
                        <?php echo __('common.view'); ?> →
                    </button>
                </div>
                
                <!-- Featured Recipe 2 -->
                <div class="bg-gradient-to-r from-vape-green to-vape-blue text-white rounded-lg p-6">
                    <div class="flex items-center mb-4">
                        <span class="material-icons text-2xl mr-3">trending_up</span>
                        <div>
                            <h3 class="text-xl font-semibold">Trending Now</h3>
                            <p class="opacity-90">Tropical Mango Blast</p>
                        </div>
                    </div>
                    <p class="text-sm opacity-90 mb-4">
                        Der derzeit beliebteste Frucht-Mix der Community mit perfekt abgestimmten tropischen Aromen.
                    </p>
                    <button class="bg-white text-vape-green px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors">
                        <?php echo __('common.view'); ?> →
                    </button>
                </div>
                
            </div>
        </div>
    </div>
</section>

