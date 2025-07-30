/**
 * VapeX Live Search Component
 * 
 * @version 1.0.0
 * @author VapeX Development Team
 * @created 2025-07-29
 * 
 * Provides live search functionality for:
 * - Aromas overview page (card filtering)
 * - Recipes overview page (card filtering)  
 * - Calculator autocomplete dropdowns
 */

class VapeXLiveSearch {
    constructor(options = {}) {
        this.options = {
            searchInputSelector: '.search-input',
            resultsContainerSelector: '.search-results',
            cardSelector: '.search-card',
            dropdownSelector: '.search-dropdown',
            noResultsSelector: '.no-results',
            loadingSelector: '.search-loading',
            minLength: 3,
            showDropdown: true,
            showHighlight: true,
            animationDuration: 300,
            ...options
        };
        
        this.searchEngine = null;
        this.activeInput = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    /**
     * Initialize live search
     */
    async init() {
        try {
            // Initialize search engine
            this.searchEngine = new VapeXSearchEngine({
                minLength: this.options.minLength
            });
            
            // Wait for search data to load
            await this.waitForSearchData();
            
            // Setup search inputs
            this.setupSearchInputs();
            
            // Setup event listeners
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('VapeX Live Search initialized');
            
        } catch (error) {
            console.error('Error initializing live search:', error);
        }
    }
    
    /**
     * Wait for search data to be loaded
     */
    async waitForSearchData() {
        return new Promise((resolve) => {
            const checkData = () => {
                if (this.searchEngine.searchData.length > 0) {
                    resolve();
                } else {
                    setTimeout(checkData, 100);
                }
            };
            checkData();
        });
    }
    
    /**
     * Setup search inputs
     */
    setupSearchInputs() {
        const searchInputs = document.querySelectorAll(this.options.searchInputSelector);
        
        searchInputs.forEach(input => {
            this.initializeSearchInput(input);
        });
    }
    
    /**
     * Initialize individual search input
     * @param {HTMLElement} input - Search input element
     */
    initializeSearchInput(input) {
        // Add search attributes
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('spellcheck', 'false');
        
        // Create dropdown container if needed
        if (this.options.showDropdown) {
            this.createDropdownContainer(input);
        }
        
        // Add event listeners
        input.addEventListener('input', (e) => this.handleInput(e));
        input.addEventListener('focus', (e) => this.handleFocus(e));
        input.addEventListener('blur', (e) => this.handleBlur(e));
        input.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Store reference
        input.searchInstance = this;
    }
    
    /**
     * Create dropdown container for autocomplete
     * @param {HTMLElement} input - Search input element
     */
    createDropdownContainer(input) {
        const container = input.closest('.search-container') || input.parentElement;
        
        if (!container.querySelector('.search-dropdown')) {
            const dropdown = document.createElement('div');
            dropdown.className = 'search-dropdown hidden';
            dropdown.innerHTML = `
                <div class="search-dropdown-content">
                    <div class="search-loading hidden">
                        <div class="flex items-center justify-center p-4">
                            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            <span class="ml-2 text-gray-600">Searching...</span>
                        </div>
                    </div>
                    <div class="search-suggestions"></div>
                    <div class="no-results hidden">
                        <div class="p-4 text-center text-gray-500">
                            <i class="material-icons text-4xl mb-2">search_off</i>
                            <p>No results found</p>
                        </div>
                    </div>
                </div>
            `;
            
            container.appendChild(dropdown);
            container.style.position = 'relative';
        }
    }
    
    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideAllDropdowns();
            }
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAllDropdowns();
            }
        });
    }
    
    /**
     * Handle input events
     * @param {Event} e - Input event
     */
    handleInput(e) {
        const input = e.target;
        const query = input.value.trim();
        
        this.activeInput = input;
        
        // Clear previous timeout
        if (input.searchTimeout) {
            clearTimeout(input.searchTimeout);
        }
        
        // Show loading state
        this.showLoading(input);
        
        // Debounced search
        input.searchTimeout = setTimeout(() => {
            this.performSearch(input, query);
        }, 300);
    }
    
    /**
     * Handle focus events
     * @param {Event} e - Focus event
     */
    handleFocus(e) {
        const input = e.target;
        this.activeInput = input;
        
        // Show dropdown if there's a query
        if (input.value.trim().length >= this.options.minLength) {
            this.showDropdown(input);
        }
    }
    
    /**
     * Handle blur events
     * @param {Event} e - Blur event
     */
    handleBlur(e) {
        const input = e.target;
        
        // Delay hiding to allow for dropdown clicks
        setTimeout(() => {
            if (document.activeElement !== input) {
                this.hideDropdown(input);
            }
        }, 150);
    }
    
    /**
     * Handle keydown events
     * @param {Event} e - Keydown event
     */
    handleKeydown(e) {
        const input = e.target;
        const dropdown = this.getDropdown(input);
        
        if (!dropdown || dropdown.classList.contains('hidden')) {
            return;
        }
        
        const suggestions = dropdown.querySelectorAll('.suggestion-item');
        let currentIndex = Array.from(suggestions).findIndex(item => 
            item.classList.contains('highlighted')
        );
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                currentIndex = Math.min(currentIndex + 1, suggestions.length - 1);
                this.highlightSuggestion(suggestions, currentIndex);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                currentIndex = Math.max(currentIndex - 1, 0);
                this.highlightSuggestion(suggestions, currentIndex);
                break;
                
            case 'Enter':
                e.preventDefault();
                if (currentIndex >= 0 && suggestions[currentIndex]) {
                    this.selectSuggestion(input, suggestions[currentIndex]);
                }
                break;
                
            case 'Tab':
                if (currentIndex >= 0 && suggestions[currentIndex]) {
                    e.preventDefault();
                    this.selectSuggestion(input, suggestions[currentIndex]);
                }
                break;
        }
    }
    
    /**
     * Perform search
     * @param {HTMLElement} input - Search input
     * @param {string} query - Search query
     */
    performSearch(input, query) {
        this.hideLoading(input);
        
        if (query.length < this.options.minLength) {
            this.hideDropdown(input);
            this.showAllCards();
            return;
        }
        
        // Perform search
        const results = this.searchEngine.search(query);
        
        // Update UI based on search context
        const searchContext = this.getSearchContext(input);
        
        switch (searchContext) {
            case 'overview':
                this.filterCards(input, results, query);
                break;
                
            case 'calculator':
                this.showAutocomplete(input, results, query);
                break;
                
            default:
                this.showSearchResults(input, results, query);
        }
    }
    
    /**
     * Get search context based on input location
     * @param {HTMLElement} input - Search input
     * @returns {string} Search context
     */
    getSearchContext(input) {
        if (input.closest('.calculator-page')) {
            return 'calculator';
        } else if (input.closest('.aromas-page, .recipes-page')) {
            return 'overview';
        }
        return 'general';
    }
    
    /**
     * Filter cards on overview pages
     * @param {HTMLElement} input - Search input
     * @param {Array} results - Search results
     * @param {string} query - Search query
     */
    filterCards(input, results, query) {
        const cards = document.querySelectorAll(this.options.cardSelector);
        const resultIds = new Set(results.map(r => r.id));
        
        let visibleCount = 0;
        
        cards.forEach(card => {
            const cardId = card.dataset.id;
            const shouldShow = resultIds.has(cardId);
            
            if (shouldShow) {
                this.showCard(card, query);
                visibleCount++;
            } else {
                this.hideCard(card);
            }
        });
        
        // Update results count
        this.updateResultsCount(visibleCount, query);
        
        // Show no results message if needed
        this.toggleNoResults(visibleCount === 0);
    }
    
    /**
     * Show autocomplete dropdown for calculator
     * @param {HTMLElement} input - Search input
     * @param {Array} results - Search results
     * @param {string} query - Search query
     */
    showAutocomplete(input, results, query) {
        const dropdown = this.getDropdown(input);
        if (!dropdown) return;
        
        const suggestionsContainer = dropdown.querySelector('.search-suggestions');
        
        // Filter results for aromas only (for calculator)
        const aromaResults = results.filter(r => r.type === 'aroma');
        
        if (aromaResults.length === 0) {
            this.showNoResults(input);
            return;
        }
        
        // Build suggestions HTML
        const suggestionsHTML = aromaResults.slice(0, 10).map((aroma, index) => `
            <div class="suggestion-item p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 ${index === 0 ? 'highlighted' : ''}" 
                 data-value="${aroma.name}" 
                 data-id="${aroma.id}">
                <div class="flex items-center">
                    <i class="material-icons text-green-500 mr-3">local_florist</i>
                    <div class="flex-1">
                        <div class="font-medium">${this.highlightQuery(aroma.name, query)}</div>
                        <div class="text-sm text-gray-600">
                            ${aroma.brand} • ${aroma.category} • ${aroma.percentage}
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="flex items-center text-yellow-500">
                            <i class="material-icons text-sm">star</i>
                            <span class="text-sm ml-1">${aroma.rating}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        suggestionsContainer.innerHTML = suggestionsHTML;
        
        // Add click listeners
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectSuggestion(input, item);
            });
        });
        
        this.showDropdown(input);
    }
    
    /**
     * Select a suggestion
     * @param {HTMLElement} input - Search input
     * @param {HTMLElement} suggestion - Suggestion element
     */
    selectSuggestion(input, suggestion) {
        const value = suggestion.dataset.value;
        const id = suggestion.dataset.id;
        
        input.value = value;
        input.dataset.selectedId = id;
        
        // Trigger change event
        input.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Hide dropdown
        this.hideDropdown(input);
        
        // Focus next input if in calculator
        if (this.getSearchContext(input) === 'calculator') {
            this.focusNextInput(input);
        }
    }
    
    /**
     * Focus next input in calculator
     * @param {HTMLElement} currentInput - Current input
     */
    focusNextInput(currentInput) {
        const form = currentInput.closest('form');
        if (!form) return;
        
        const inputs = form.querySelectorAll('input, select');
        const currentIndex = Array.from(inputs).indexOf(currentInput);
        
        if (currentIndex >= 0 && currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        }
    }
    
    /**
     * Highlight suggestion in dropdown
     * @param {NodeList} suggestions - Suggestion elements
     * @param {number} index - Index to highlight
     */
    highlightSuggestion(suggestions, index) {
        suggestions.forEach((item, i) => {
            if (i === index) {
                item.classList.add('highlighted', 'bg-blue-100');
            } else {
                item.classList.remove('highlighted', 'bg-blue-100');
            }
        });
    }
    
    /**
     * Show card with animation
     * @param {HTMLElement} card - Card element
     * @param {string} query - Search query for highlighting
     */
    showCard(card, query) {
        card.style.display = 'block';
        
        // Highlight search terms in card
        if (this.options.showHighlight && query) {
            this.highlightInCard(card, query);
        }
        
        // Animate in
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, 10);
    }
    
    /**
     * Hide card with animation
     * @param {HTMLElement} card - Card element
     */
    hideCard(card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            card.style.display = 'none';
        }, this.options.animationDuration);
    }
    
    /**
     * Show all cards
     */
    showAllCards() {
        const cards = document.querySelectorAll(this.options.cardSelector);
        
        cards.forEach(card => {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            
            // Remove highlights
            this.removeHighlights(card);
        });
        
        this.updateResultsCount(cards.length, '');
        this.toggleNoResults(false);
    }
    
    /**
     * Highlight search terms in card
     * @param {HTMLElement} card - Card element
     * @param {string} query - Search query
     */
    highlightInCard(card, query) {
        const textElements = card.querySelectorAll('h3, .card-title, .card-description');
        
        textElements.forEach(element => {
            const originalText = element.textContent;
            const highlightedText = this.highlightQuery(originalText, query);
            element.innerHTML = highlightedText;
        });
    }
    
    /**
     * Remove highlights from card
     * @param {HTMLElement} card - Card element
     */
    removeHighlights(card) {
        const highlightedElements = card.querySelectorAll('.search-highlight');
        
        highlightedElements.forEach(element => {
            element.outerHTML = element.textContent;
        });
    }
    
    /**
     * Highlight query in text
     * @param {string} text - Text to highlight
     * @param {string} query - Query to highlight
     * @returns {string} Highlighted text
     */
    highlightQuery(text, query) {
        if (!query || query.length < this.options.minLength) {
            return text;
        }
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="search-highlight bg-yellow-200 px-1 rounded">$1</span>');
    }
    
    /**
     * Update results count display
     * @param {number} count - Number of results
     * @param {string} query - Search query
     */
    updateResultsCount(count, query) {
        const countElement = document.querySelector('.search-results-count');
        if (!countElement) return;
        
        if (query) {
            countElement.textContent = `${count} results for "${query}"`;
            countElement.classList.remove('hidden');
        } else {
            countElement.classList.add('hidden');
        }
    }
    
    /**
     * Toggle no results message
     * @param {boolean} show - Whether to show no results
     */
    toggleNoResults(show) {
        const noResultsElement = document.querySelector(this.options.noResultsSelector);
        if (!noResultsElement) return;
        
        if (show) {
            noResultsElement.classList.remove('hidden');
        } else {
            noResultsElement.classList.add('hidden');
        }
    }
    
    /**
     * Show loading state
     * @param {HTMLElement} input - Search input
     */
    showLoading(input) {
        const dropdown = this.getDropdown(input);
        if (!dropdown) return;
        
        const loading = dropdown.querySelector('.search-loading');
        const suggestions = dropdown.querySelector('.search-suggestions');
        const noResults = dropdown.querySelector('.no-results');
        
        if (loading) loading.classList.remove('hidden');
        if (suggestions) suggestions.innerHTML = '';
        if (noResults) noResults.classList.add('hidden');
        
        this.showDropdown(input);
    }
    
    /**
     * Hide loading state
     * @param {HTMLElement} input - Search input
     */
    hideLoading(input) {
        const dropdown = this.getDropdown(input);
        if (!dropdown) return;
        
        const loading = dropdown.querySelector('.search-loading');
        if (loading) loading.classList.add('hidden');
    }
    
    /**
     * Show no results state
     * @param {HTMLElement} input - Search input
     */
    showNoResults(input) {
        const dropdown = this.getDropdown(input);
        if (!dropdown) return;
        
        const suggestions = dropdown.querySelector('.search-suggestions');
        const noResults = dropdown.querySelector('.no-results');
        
        if (suggestions) suggestions.innerHTML = '';
        if (noResults) noResults.classList.remove('hidden');
        
        this.showDropdown(input);
    }
    
    /**
     * Show dropdown
     * @param {HTMLElement} input - Search input
     */
    showDropdown(input) {
        const dropdown = this.getDropdown(input);
        if (!dropdown) return;
        
        dropdown.classList.remove('hidden');
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            dropdown.style.opacity = '1';
            dropdown.style.transform = 'translateY(0)';
        }, 10);
    }
    
    /**
     * Hide dropdown
     * @param {HTMLElement} input - Search input
     */
    hideDropdown(input) {
        const dropdown = this.getDropdown(input);
        if (!dropdown) return;
        
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            dropdown.classList.add('hidden');
        }, 150);
    }
    
    /**
     * Hide all dropdowns
     */
    hideAllDropdowns() {
        const dropdowns = document.querySelectorAll('.search-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.classList.add('hidden');
        });
    }
    
    /**
     * Get dropdown for input
     * @param {HTMLElement} input - Search input
     * @returns {HTMLElement} Dropdown element
     */
    getDropdown(input) {
        const container = input.closest('.search-container') || input.parentElement;
        return container.querySelector('.search-dropdown');
    }
    
    /**
     * Add search functionality to new elements
     * @param {HTMLElement} container - Container with search inputs
     */
    addToContainer(container) {
        const searchInputs = container.querySelectorAll(this.options.searchInputSelector);
        searchInputs.forEach(input => {
            this.initializeSearchInput(input);
        });
    }
    
    /**
     * Destroy search functionality
     */
    destroy() {
        const searchInputs = document.querySelectorAll(this.options.searchInputSelector);
        
        searchInputs.forEach(input => {
            // Remove event listeners
            input.removeEventListener('input', this.handleInput);
            input.removeEventListener('focus', this.handleFocus);
            input.removeEventListener('blur', this.handleBlur);
            input.removeEventListener('keydown', this.handleKeydown);
            
            // Clear timeouts
            if (input.searchTimeout) {
                clearTimeout(input.searchTimeout);
            }
            
            // Remove references
            delete input.searchInstance;
        });
        
        // Remove dropdowns
        const dropdowns = document.querySelectorAll('.search-dropdown');
        dropdowns.forEach(dropdown => dropdown.remove());
        
        this.isInitialized = false;
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.vapeXLiveSearch = new VapeXLiveSearch();
});

// Export for manual initialization
window.VapeXLiveSearch = VapeXLiveSearch;

