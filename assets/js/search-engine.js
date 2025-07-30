/**
 * VapeX Search Engine - Core Search Module
 * 
 * @version 1.0.0
 * @author VapeX Development Team
 * @created 2025-07-29
 * 
 * Provides intelligent search functionality with:
 * - Live search with 3-character minimum
 * - Fuzzy matching for typo tolerance
 * - Multi-field search capabilities
 * - Debounced input for performance
 */

class VapeXSearchEngine {
    constructor(options = {}) {
        this.options = {
            minLength: 3,
            debounceDelay: 300,
            fuzzyThreshold: 0.6,
            maxResults: 50,
            highlightClass: 'search-highlight',
            ...options
        };
        
        this.searchData = [];
        this.searchCallbacks = [];
        this.debounceTimer = null;
        this.lastQuery = '';
        
        this.init();
    }
    
    /**
     * Initialize the search engine
     */
    init() {
        console.log('VapeX Search Engine initialized');
        this.loadSearchData();
    }
    
    /**
     * Load search data from various sources
     */
    async loadSearchData() {
        try {
            // Load aromas data
            const aromasData = await this.loadAromas();
            
            // Load recipes data  
            const recipesData = await this.loadRecipes();
            
            // Combine all search data
            this.searchData = [
                ...aromasData,
                ...recipesData
            ];
            
            console.log(`Search data loaded: ${this.searchData.length} items`);
        } catch (error) {
            console.error('Error loading search data:', error);
        }
    }
    
    /**
     * Load aromas data for search
     */
    async loadAromas() {
        // Sample aromas data - in production this would come from API/database
        return [
            {
                id: 'aroma_1',
                type: 'aroma',
                name: 'Strawberry',
                brand: 'Capella',
                category: 'Fruit',
                percentage: '8-12%',
                rating: 4.5,
                searchTerms: ['strawberry', 'fruit', 'capella', 'sweet', 'berry']
            },
            {
                id: 'aroma_2', 
                type: 'aroma',
                name: 'Vanilla Custard',
                brand: 'Capella',
                category: 'Dessert',
                percentage: '5-10%',
                rating: 4.8,
                searchTerms: ['vanilla', 'custard', 'dessert', 'capella', 'cream', 'sweet']
            },
            {
                id: 'aroma_3',
                type: 'aroma', 
                name: 'Bavarian Cream',
                brand: 'TPA',
                category: 'Dessert',
                percentage: '3-8%',
                rating: 4.6,
                searchTerms: ['bavarian', 'cream', 'dessert', 'tpa', 'vanilla', 'smooth']
            },
            {
                id: 'aroma_4',
                type: 'aroma',
                name: 'Blueberry',
                brand: 'TPA',
                category: 'Fruit', 
                percentage: '6-10%',
                rating: 4.3,
                searchTerms: ['blueberry', 'fruit', 'tpa', 'berry', 'sweet']
            },
            {
                id: 'aroma_5',
                type: 'aroma',
                name: 'Graham Cracker',
                brand: 'TPA',
                category: 'Dessert',
                percentage: '4-8%',
                rating: 4.7,
                searchTerms: ['graham', 'cracker', 'dessert', 'tpa', 'biscuit', 'crunchy']
            },
            {
                id: 'aroma_6',
                type: 'aroma',
                name: 'Menthol',
                brand: 'TPA',
                category: 'Menthol',
                percentage: '1-3%',
                rating: 4.2,
                searchTerms: ['menthol', 'cool', 'mint', 'tpa', 'fresh', 'cooling']
            },
            {
                id: 'aroma_7',
                type: 'aroma',
                name: 'Caramel',
                brand: 'Flavorah',
                category: 'Dessert',
                percentage: '2-5%',
                rating: 4.9,
                searchTerms: ['caramel', 'dessert', 'flavorah', 'sweet', 'butter', 'rich']
            },
            {
                id: 'aroma_8',
                type: 'aroma',
                name: 'Apple',
                brand: 'Inawera',
                category: 'Fruit',
                percentage: '3-6%',
                rating: 4.4,
                searchTerms: ['apple', 'fruit', 'inawera', 'fresh', 'crisp']
            }
        ];
    }
    
    /**
     * Load recipes data for search
     */
    async loadRecipes() {
        // Sample recipes data - in production this would come from API/database
        return [
            {
                id: 'recipe_1',
                type: 'recipe',
                name: 'Strawberry Cream',
                author: 'VapeChef',
                category: 'Dessert',
                difficulty: 'Easy',
                rating: 4.8,
                aromas: ['Strawberry', 'Vanilla Custard', 'Bavarian Cream'],
                searchTerms: ['strawberry', 'cream', 'dessert', 'easy', 'vanilla', 'custard']
            },
            {
                id: 'recipe_2',
                type: 'recipe', 
                name: 'Vanilla Custard Delight',
                author: 'MixMaster',
                category: 'Dessert',
                difficulty: 'Medium',
                rating: 4.9,
                aromas: ['Vanilla Custard', 'Bavarian Cream', 'Graham Cracker', 'Caramel'],
                searchTerms: ['vanilla', 'custard', 'delight', 'dessert', 'medium', 'cream', 'graham']
            },
            {
                id: 'recipe_3',
                type: 'recipe',
                name: 'Tropical Paradise',
                author: 'FlavorGuru',
                category: 'Fruit',
                difficulty: 'Hard',
                rating: 4.7,
                aromas: ['Mango', 'Pineapple', 'Coconut', 'Lime', 'Passion Fruit', 'Kiwi'],
                searchTerms: ['tropical', 'paradise', 'fruit', 'hard', 'mango', 'pineapple', 'coconut']
            },
            {
                id: 'recipe_4',
                type: 'recipe',
                name: 'Chocolate Mint',
                author: 'SweetVaper',
                category: 'Dessert',
                difficulty: 'Medium',
                rating: 4.6,
                aromas: ['Chocolate', 'Mint', 'Vanilla'],
                searchTerms: ['chocolate', 'mint', 'dessert', 'medium', 'vanilla', 'sweet']
            },
            {
                id: 'recipe_5',
                type: 'recipe',
                name: 'Apple Pie',
                author: 'BakingVapes',
                category: 'Dessert',
                difficulty: 'Hard',
                rating: 4.8,
                aromas: ['Apple', 'Cinnamon', 'Graham Cracker', 'Vanilla', 'Caramel'],
                searchTerms: ['apple', 'pie', 'dessert', 'hard', 'cinnamon', 'graham', 'vanilla']
            },
            {
                id: 'recipe_6',
                type: 'recipe',
                name: 'Fresh Menthol',
                author: 'CoolBreeze',
                category: 'Menthol',
                difficulty: 'Easy',
                rating: 4.5,
                aromas: ['Menthol', 'Mint'],
                searchTerms: ['fresh', 'menthol', 'mint', 'easy', 'cool', 'cooling']
            }
        ];
    }
    
    /**
     * Perform search with query
     * @param {string} query - Search query
     * @param {Object} options - Search options
     * @returns {Array} Search results
     */
    search(query, options = {}) {
        if (!query || query.length < this.options.minLength) {
            return [];
        }
        
        const searchOptions = { ...this.options, ...options };
        const normalizedQuery = this.normalizeString(query);
        
        let results = [];
        
        // Search through all data
        for (const item of this.searchData) {
            const score = this.calculateRelevanceScore(item, normalizedQuery);
            
            if (score > 0) {
                results.push({
                    ...item,
                    score: score,
                    matchedTerms: this.getMatchedTerms(item, normalizedQuery)
                });
            }
        }
        
        // Sort by relevance score (highest first)
        results.sort((a, b) => b.score - a.score);
        
        // Limit results
        if (searchOptions.maxResults) {
            results = results.slice(0, searchOptions.maxResults);
        }
        
        return results;
    }
    
    /**
     * Calculate relevance score for an item
     * @param {Object} item - Item to score
     * @param {string} query - Normalized query
     * @returns {number} Relevance score
     */
    calculateRelevanceScore(item, query) {
        let score = 0;
        
        // Exact name match gets highest score
        if (this.normalizeString(item.name).includes(query)) {
            score += 100;
        }
        
        // Brand match
        if (item.brand && this.normalizeString(item.brand).includes(query)) {
            score += 80;
        }
        
        // Category match
        if (item.category && this.normalizeString(item.category).includes(query)) {
            score += 60;
        }
        
        // Search terms match
        if (item.searchTerms) {
            for (const term of item.searchTerms) {
                const normalizedTerm = this.normalizeString(term);
                
                // Exact term match
                if (normalizedTerm === query) {
                    score += 90;
                } 
                // Term starts with query
                else if (normalizedTerm.startsWith(query)) {
                    score += 70;
                }
                // Term contains query
                else if (normalizedTerm.includes(query)) {
                    score += 50;
                }
                // Fuzzy match
                else if (this.fuzzyMatch(normalizedTerm, query)) {
                    score += 30;
                }
            }
        }
        
        // Author match (for recipes)
        if (item.author && this.normalizeString(item.author).includes(query)) {
            score += 40;
        }
        
        // Aromas match (for recipes)
        if (item.aromas) {
            for (const aroma of item.aromas) {
                if (this.normalizeString(aroma).includes(query)) {
                    score += 45;
                }
            }
        }
        
        return score;
    }
    
    /**
     * Get matched terms for highlighting
     * @param {Object} item - Item
     * @param {string} query - Query
     * @returns {Array} Matched terms
     */
    getMatchedTerms(item, query) {
        const matches = [];
        
        // Check name
        if (this.normalizeString(item.name).includes(query)) {
            matches.push(item.name);
        }
        
        // Check search terms
        if (item.searchTerms) {
            for (const term of item.searchTerms) {
                if (this.normalizeString(term).includes(query)) {
                    matches.push(term);
                }
            }
        }
        
        return [...new Set(matches)]; // Remove duplicates
    }
    
    /**
     * Fuzzy string matching
     * @param {string} str1 - First string
     * @param {string} str2 - Second string
     * @returns {boolean} Whether strings match fuzzily
     */
    fuzzyMatch(str1, str2) {
        const similarity = this.calculateSimilarity(str1, str2);
        return similarity >= this.options.fuzzyThreshold;
    }
    
    /**
     * Calculate string similarity using Levenshtein distance
     * @param {string} str1 - First string
     * @param {string} str2 - Second string
     * @returns {number} Similarity score (0-1)
     */
    calculateSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) {
            return 1.0;
        }
        
        const distance = this.levenshteinDistance(longer, shorter);
        return (longer.length - distance) / longer.length;
    }
    
    /**
     * Calculate Levenshtein distance between two strings
     * @param {string} str1 - First string
     * @param {string} str2 - Second string
     * @returns {number} Edit distance
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }
    
    /**
     * Normalize string for search
     * @param {string} str - String to normalize
     * @returns {string} Normalized string
     */
    normalizeString(str) {
        return str.toLowerCase()
                  .trim()
                  .replace(/[^\w\s]/g, '') // Remove special characters
                  .replace(/\s+/g, ' '); // Normalize whitespace
    }
    
    /**
     * Debounced search
     * @param {string} query - Search query
     * @param {Function} callback - Callback function
     * @param {Object} options - Search options
     */
    debouncedSearch(query, callback, options = {}) {
        clearTimeout(this.debounceTimer);
        
        this.debounceTimer = setTimeout(() => {
            const results = this.search(query, options);
            callback(results, query);
        }, this.options.debounceDelay);
    }
    
    /**
     * Register search callback
     * @param {Function} callback - Callback function
     */
    onSearch(callback) {
        this.searchCallbacks.push(callback);
    }
    
    /**
     * Trigger search callbacks
     * @param {Array} results - Search results
     * @param {string} query - Search query
     */
    triggerCallbacks(results, query) {
        for (const callback of this.searchCallbacks) {
            callback(results, query);
        }
    }
    
    /**
     * Highlight search terms in text
     * @param {string} text - Text to highlight
     * @param {string} query - Search query
     * @returns {string} Highlighted text
     */
    highlightText(text, query) {
        if (!query || query.length < this.options.minLength) {
            return text;
        }
        
        const normalizedQuery = this.normalizeString(query);
        const regex = new RegExp(`(${normalizedQuery})`, 'gi');
        
        return text.replace(regex, `<span class="${this.options.highlightClass}">$1</span>`);
    }
    
    /**
     * Get search suggestions based on partial input
     * @param {string} partial - Partial input
     * @param {number} limit - Maximum suggestions
     * @returns {Array} Suggestions
     */
    getSuggestions(partial, limit = 10) {
        if (!partial || partial.length < 2) {
            return [];
        }
        
        const normalizedPartial = this.normalizeString(partial);
        const suggestions = new Set();
        
        // Get suggestions from search terms
        for (const item of this.searchData) {
            if (item.searchTerms) {
                for (const term of item.searchTerms) {
                    const normalizedTerm = this.normalizeString(term);
                    if (normalizedTerm.startsWith(normalizedPartial)) {
                        suggestions.add(term);
                    }
                }
            }
            
            // Add item names
            const normalizedName = this.normalizeString(item.name);
            if (normalizedName.startsWith(normalizedPartial)) {
                suggestions.add(item.name);
            }
        }
        
        return Array.from(suggestions).slice(0, limit);
    }
}

// Export for use in other modules
window.VapeXSearchEngine = VapeXSearchEngine;

