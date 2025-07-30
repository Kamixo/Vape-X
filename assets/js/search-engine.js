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

class SearchEngine {
    constructor(providedSearchData = null) {
        this.options = {
            minLength: 3,
            debounceDelay: 300,
            fuzzyThreshold: 0.6,
            maxResults: 50,
            highlightClass: 'search-highlight'
        };
        
        this.searchData = [];
        this.searchCallbacks = [];
        this.debounceTimer = null;
        this.lastQuery = '';
        
        // Use provided search data or global searchData
        if (providedSearchData) {
            this.loadSearchData(providedSearchData);
        } else if (typeof window.searchData !== 'undefined') {
            this.loadSearchData(window.searchData);
        } else if (typeof searchData !== 'undefined') {
            this.loadSearchData(searchData);
        }
        
        console.log('SearchEngine initialized with', this.searchData.length, 'items');
    }
    
    /**
     * Load search data from provided data
     */
    loadSearchData(data) {
        this.searchData = [];
        
        // Load aromas
        if (data.aromas) {
            for (const aroma of data.aromas) {
                this.searchData.push({
                    id: `aroma_${aroma.id}`,
                    type: 'aroma',
                    name: aroma.name,
                    brand: aroma.brand,
                    category: aroma.category,
                    percentage: aroma.percentage,
                    rating: aroma.rating,
                    reviews: aroma.reviews,
                    description: aroma.description,
                    tags: aroma.tags || [],
                    searchTerms: [
                        aroma.name.toLowerCase(),
                        aroma.brand.toLowerCase(),
                        aroma.category.toLowerCase(),
                        ...aroma.searchTerms || [],
                        ...aroma.tags || []
                    ]
                });
            }
        }
        
        console.log(`Search data loaded: ${this.searchData.length} items`);
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
}

// Make SearchEngine available globally
window.SearchEngine = SearchEngine;

