/**
 * VapeX Live Search - UI Search Component
 * 
 * @version 1.0.0
 * @author VapeX Development Team
 * @created 2025-07-29
 * 
 * Provides live search UI functionality:
 * - Real-time filtering of aroma cards
 * - 3-character minimum trigger
 * - Keyboard navigation support
 * - Responsive search results
 */

class LiveSearch {
    constructor(searchEngine) {
        this.searchEngine = searchEngine;
        this.searchInputs = [];
        this.currentQuery = '';
        this.isActive = false;
        
        console.log('LiveSearch initialized');
    }
    
    /**
     * Initialize live search functionality
     */
    init() {
        this.bindSearchInputs();
        this.setupKeyboardNavigation();
        console.log('LiveSearch ready');
    }
    
    /**
     * Bind all search inputs on the page
     */
    bindSearchInputs() {
        // Find all search inputs
        const searchInputs = document.querySelectorAll('input[data-search-context]');
        
        for (const input of searchInputs) {
            this.bindSearchInput(input);
        }
        
        console.log(`Bound ${searchInputs.length} search inputs`);
    }
    
    /**
     * Bind a single search input
     * @param {HTMLElement} input - Search input element
     */
    bindSearchInput(input) {
        const context = input.getAttribute('data-search-context');
        
        // Input event for live search
        input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            this.handleSearch(query, context);
        });
        
        // Focus events
        input.addEventListener('focus', (e) => {
            this.isActive = true;
            const query = e.target.value.trim();
            if (query.length >= this.searchEngine.options.minLength) {
                this.handleSearch(query, context);
            }
        });
        
        input.addEventListener('blur', (e) => {
            // Delay to allow clicking on results
            setTimeout(() => {
                this.isActive = false;
            }, 200);
        });
        
        // Clear button functionality
        const clearButton = input.parentElement.querySelector('.clear-search');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                input.value = '';
                this.handleSearch('', context);
                input.focus();
            });
        }
        
        this.searchInputs.push({
            element: input,
            context: context
        });
    }
    
    /**
     * Handle search query
     * @param {string} query - Search query
     * @param {string} context - Search context (aromas, recipes, etc.)
     */
    handleSearch(query, context) {
        this.currentQuery = query;
        
        if (query.length === 0) {
            this.showAllItems(context);
            this.updateResultsCount(null, context);
            return;
        }
        
        if (query.length < this.searchEngine.options.minLength) {
            return;
        }
        
        // Perform search
        const results = this.searchEngine.search(query, {
            context: context
        });
        
        // Filter items based on results
        this.filterItems(results, context);
        
        // Update results count
        this.updateResultsCount(results, context);
        
        console.log(`Search "${query}" returned ${results.length} results`);
    }
    
    /**
     * Filter items based on search results
     * @param {Array} results - Search results
     * @param {string} context - Search context
     */
    filterItems(results, context) {
        if (context === 'aromas') {
            this.filterAromaCards(results);
        } else if (context === 'recipes') {
            this.filterRecipeCards(results);
        }
    }
    
    /**
     * Filter aroma cards based on search results
     * @param {Array} results - Search results
     */
    filterAromaCards(results) {
        const aromaCards = document.querySelectorAll('.aroma-card');
        
        // Create a set of matching aroma names from search results
        const matchingNames = new Set();
        results.forEach(result => {
            matchingNames.add(result.name.toLowerCase());
        });
        
        console.log('Filtering cards, matching names:', Array.from(matchingNames));
        
        for (const card of aromaCards) {
            const aromaName = card.getAttribute('data-name');
            
            if (aromaName) {
                const normalizedName = aromaName.toLowerCase();
                const shouldShow = matchingNames.has(normalizedName);
                
                console.log(`Card "${aromaName}": ${shouldShow ? 'SHOW' : 'HIDE'}`);
                
                // Show/hide card with animation
                if (shouldShow) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        if (card.style.opacity === '0') {
                            card.style.display = 'none';
                        }
                    }, 200);
                }
            }
        }
    }
    
    /**
     * Filter recipe cards based on search results
     * @param {Array} results - Search results
     */
    filterRecipeCards(results) {
        const recipeCards = document.querySelectorAll('.recipe-card');
        const resultNames = new Set(results.map(r => r.name.toLowerCase()));
        
        for (const card of recipeCards) {
            const recipeName = card.getAttribute('data-name');
            
            if (recipeName && resultNames.has(recipeName.toLowerCase())) {
                card.style.display = 'block';
                card.style.opacity = '1';
            } else {
                card.style.opacity = '0';
                setTimeout(() => {
                    if (card.style.opacity === '0') {
                        card.style.display = 'none';
                    }
                }, 200);
            }
        }
    }
    
    /**
     * Show all items (clear filter)
     * @param {string} context - Search context
     */
    showAllItems(context) {
        let selector = '';
        
        if (context === 'aromas') {
            selector = '.aroma-card';
        } else if (context === 'recipes') {
            selector = '.recipe-card';
        }
        
        if (selector) {
            const cards = document.querySelectorAll(selector);
            for (const card of cards) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }
        }
    }
    
    /**
     * Update results count display
     * @param {Array} results - Search results (null to show all)
     * @param {string} context - Search context
     */
    updateResultsCount(results, context) {
        const resultsInfo = document.getElementById('results-info');
        if (!resultsInfo) return;
        
        let totalItems = 0;
        let visibleItems = 0;
        
        if (context === 'aromas') {
            const aromaCards = document.querySelectorAll('.aroma-card');
            totalItems = aromaCards.length;
            visibleItems = results ? results.length : totalItems;
        }
        
        // Update text
        if (results && results.length > 0) {
            resultsInfo.textContent = `Showing ${visibleItems} of ${totalItems} ${context}`;
        } else if (results && results.length === 0) {
            resultsInfo.textContent = `No ${context} found for "${this.currentQuery}"`;
        } else {
            resultsInfo.textContent = `Showing ${totalItems} of ${totalItems} ${context}`;
        }
    }
    
    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isActive) return;
            
            switch (e.key) {
                case 'Escape':
                    this.clearSearch();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.navigateResults('down');
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.navigateResults('up');
                    break;
                case 'Enter':
                    e.preventDefault();
                    this.selectCurrentResult();
                    break;
            }
        });
    }
    
    /**
     * Clear all search inputs
     */
    clearSearch() {
        for (const searchInput of this.searchInputs) {
            searchInput.element.value = '';
            this.handleSearch('', searchInput.context);
        }
    }
    
    /**
     * Navigate through search results
     * @param {string} direction - 'up' or 'down'
     */
    navigateResults(direction) {
        // This would be implemented for dropdown results
        // For now, just focus management
        const activeInput = document.activeElement;
        if (activeInput && activeInput.matches('input[data-search-context]')) {
            // Keep focus on input for now
        }
    }
    
    /**
     * Select current highlighted result
     */
    selectCurrentResult() {
        // This would be implemented for dropdown results
        // For now, just trigger search
        const activeInput = document.activeElement;
        if (activeInput && activeInput.matches('input[data-search-context]')) {
            const query = activeInput.value.trim();
            const context = activeInput.getAttribute('data-search-context');
            this.handleSearch(query, context);
        }
    }
    
    /**
     * Highlight search terms in text
     * @param {string} text - Text to highlight
     * @param {string} query - Search query
     * @returns {string} Highlighted text
     */
    highlightText(text, query) {
        return this.searchEngine.highlightText(text, query);
    }
}

// Make LiveSearch available globally
window.LiveSearch = LiveSearch;

