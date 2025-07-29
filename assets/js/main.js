/**
 * VapeX E-Liquid Calculator - Main JavaScript
 * 
 * @version 1.0.0
 * @author VapeX Development Team
 * @created 2025-07-29
 */

// =====================================================
// GLOBAL CONFIGURATION
// =====================================================

// Ensure VapeX global object exists
window.VapeX = window.VapeX || {};

// Extend configuration
VapeX.config = Object.assign({
    debug: false,
    animationDuration: 300,
    apiTimeout: 10000,
    retryAttempts: 3
}, VapeX.config || {});

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

VapeX.utils = {
    
    /**
     * Log messages if debug mode is enabled
     */
    log: function(message, type = 'info') {
        if (VapeX.config.debug) {
            console[type]('[VapeX]', message);
        }
    },
    
    /**
     * Show notification to user
     */
    notify: function(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `alert-vape alert-${type} animate-fade-in`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
            box-shadow: var(--shadow-xl);
        `;
        
        const icon = {
            'success': 'check_circle',
            'error': 'error',
            'warning': 'warning',
            'info': 'info'
        }[type] || 'info';
        
        notification.innerHTML = `
            <span class="material-icons">${icon}</span>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="margin-left: auto; background: none; border: none; font-size: 1.2em; cursor: pointer;">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, duration);
        }
    },
    
    /**
     * Format number according to current language
     */
    formatNumber: function(number, decimals = 2) {
        const lang = VapeX.config.language || 'en';
        const formats = {
            'de': { decimal: ',', thousands: '.' },
            'en': { decimal: '.', thousands: ',' },
            'fr': { decimal: ',', thousands: ' ' },
            'it': { decimal: ',', thousands: '.' },
            'nl': { decimal: ',', thousands: '.' },
            'ru': { decimal: ',', thousands: ' ' },
            'es': { decimal: ',', thousands: '.' }
        };
        
        const format = formats[lang] || formats['en'];
        return number.toFixed(decimals)
            .replace('.', format.decimal)
            .replace(/\B(?=(\d{3})+(?!\d))/g, format.thousands);
    },
    
    /**
     * Debounce function calls
     */
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Make API requests with error handling
     */
    apiRequest: async function(url, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Language': VapeX.config.language
            },
            timeout: VapeX.config.apiTimeout
        };
        
        const config = Object.assign(defaultOptions, options);
        
        try {
            VapeX.utils.log(`API Request: ${config.method} ${url}`);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), config.timeout);
            
            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            VapeX.utils.log('API Response received', 'info');
            
            return data;
            
        } catch (error) {
            VapeX.utils.log(`API Error: ${error.message}`, 'error');
            throw error;
        }
    }
};

// =====================================================
// LANGUAGE MANAGEMENT
// =====================================================

VapeX.language = {
    
    /**
     * Change application language
     */
    change: function(langCode) {
        if (!langCode) return;
        
        VapeX.utils.log(`Changing language to: ${langCode}`);
        
        // Update URL with language parameter
        const url = new URL(window.location);
        url.searchParams.set('lang', langCode);
        
        // Reload page with new language
        window.location.href = url.toString();
    },
    
    /**
     * Initialize language selector
     */
    initSelector: function() {
        const selector = document.getElementById('languageSelector');
        if (selector) {
            selector.addEventListener('change', function() {
                VapeX.language.change(this.value);
            });
        }
    }
};

// =====================================================
// NAVIGATION MANAGEMENT
// =====================================================

VapeX.navigation = {
    
    /**
     * Initialize mobile navigation
     */
    initMobile: function() {
        const menuButton = document.querySelector('[data-mobile-menu-button]');
        const mobileMenu = document.querySelector('[data-mobile-menu]');
        const overlay = document.querySelector('[data-mobile-overlay]');
        
        if (menuButton && mobileMenu) {
            menuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                if (overlay) overlay.classList.toggle('active');
            });
            
            if (overlay) {
                overlay.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    overlay.classList.remove('active');
                });
            }
        }
    },
    
    /**
     * Highlight active navigation item
     */
    highlightActive: function() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '/' && href === '/')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
};

// =====================================================
// FORM ENHANCEMENTS
// =====================================================

VapeX.forms = {
    
    /**
     * Initialize form validation
     */
    initValidation: function() {
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                if (!VapeX.forms.validateForm(this)) {
                    e.preventDefault();
                }
            });
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    VapeX.forms.validateField(this);
                });
            });
        });
    },
    
    /**
     * Validate entire form
     */
    validateForm: function(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!VapeX.forms.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    },
    
    /**
     * Validate individual field
     */
    validateField: function(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let errorMessage = '';
        
        // Required field check
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = VapeX.i18n.field_required || 'This field is required';
        }
        
        // Type-specific validation
        if (value && isValid) {
            switch (type) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        errorMessage = VapeX.i18n.invalid_email || 'Invalid email address';
                    }
                    break;
                    
                case 'number':
                    if (isNaN(value)) {
                        isValid = false;
                        errorMessage = VapeX.i18n.invalid_number || 'Invalid number';
                    }
                    break;
                    
                case 'url':
                    try {
                        new URL(value);
                    } catch {
                        isValid = false;
                        errorMessage = VapeX.i18n.invalid_url || 'Invalid URL';
                    }
                    break;
            }
        }
        
        // Update field appearance
        if (isValid) {
            field.classList.remove('error');
            VapeX.forms.removeFieldError(field);
        } else {
            field.classList.add('error');
            VapeX.forms.showFieldError(field, errorMessage);
        }
        
        return isValid;
    },
    
    /**
     * Show field error message
     */
    showFieldError: function(field, message) {
        VapeX.forms.removeFieldError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error text-vape-red text-sm mt-1';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    },
    
    /**
     * Remove field error message
     */
    removeFieldError: function(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
};

// =====================================================
// CALCULATOR FUNCTIONALITY
// =====================================================

VapeX.calculator = {
    
    /**
     * Initialize calculator interface
     */
    init: function() {
        const calculatorForm = document.querySelector('[data-calculator-form]');
        if (calculatorForm) {
            this.bindEvents(calculatorForm);
            this.loadPresets();
        }
    },
    
    /**
     * Bind calculator events
     */
    bindEvents: function(form) {
        const calculateButton = form.querySelector('[data-calculate]');
        const resetButton = form.querySelector('[data-reset]');
        const inputs = form.querySelectorAll('input[type="number"]');
        
        if (calculateButton) {
            calculateButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.calculate(form);
            });
        }
        
        if (resetButton) {
            resetButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.reset(form);
            });
        }
        
        // Auto-calculate on input change
        inputs.forEach(input => {
            input.addEventListener('input', VapeX.utils.debounce(() => {
                this.calculate(form);
            }, 500));
        });
    },
    
    /**
     * Perform calculation
     */
    calculate: function(form) {
        try {
            const data = new FormData(form);
            const values = Object.fromEntries(data.entries());
            
            // Convert to numbers
            const targetVolume = parseFloat(values.target_volume) || 0;
            const targetNicotine = parseFloat(values.target_nicotine) || 0;
            const vgRatio = parseFloat(values.vg_ratio) || 70;
            const pgRatio = parseFloat(values.pg_ratio) || 30;
            const baseNicotine = parseFloat(values.base_nicotine) || 20;
            const totalAroma = parseFloat(values.total_aroma) || 10;
            
            // Validation
            if (targetVolume <= 0) {
                throw new Error(VapeX.i18n.invalid_volume || 'Invalid volume');
            }
            
            if (vgRatio + pgRatio !== 100) {
                throw new Error('VG/PG ratio must equal 100%');
            }
            
            // Calculate nicotine base needed
            const nicotineBase = (targetVolume * targetNicotine) / baseNicotine;
            
            // Calculate aroma amount
            const aromaAmount = (targetVolume * totalAroma) / 100;
            
            // Calculate remaining liquid needed
            const remainingVolume = targetVolume - nicotineBase - aromaAmount;
            
            // Calculate VG and PG amounts
            const vgAmount = (remainingVolume * vgRatio) / 100;
            const pgAmount = (remainingVolume * pgRatio) / 100;
            
            // Update results
            this.updateResults({
                totalVolume: targetVolume,
                nicotineBase: nicotineBase,
                vgAmount: vgAmount,
                pgAmount: pgAmount,
                aromaAmount: aromaAmount,
                finalNicotine: targetNicotine,
                finalRatio: `${vgRatio}/${pgRatio}`
            });
            
            VapeX.utils.log('Calculation completed successfully');
            
        } catch (error) {
            VapeX.utils.log(`Calculation error: ${error.message}`, 'error');
            VapeX.utils.notify(error.message, 'error');
        }
    },
    
    /**
     * Update calculation results
     */
    updateResults: function(results) {
        const resultElements = {
            totalVolume: document.querySelector('[data-result="total-volume"]'),
            nicotineBase: document.querySelector('[data-result="nicotine-base"]'),
            vgAmount: document.querySelector('[data-result="vg-amount"]'),
            pgAmount: document.querySelector('[data-result="pg-amount"]'),
            aromaAmount: document.querySelector('[data-result="aroma-amount"]'),
            finalNicotine: document.querySelector('[data-result="final-nicotine"]'),
            finalRatio: document.querySelector('[data-result="final-ratio"]')
        };
        
        Object.keys(results).forEach(key => {
            const element = resultElements[key];
            if (element) {
                const value = typeof results[key] === 'number' 
                    ? VapeX.utils.formatNumber(results[key])
                    : results[key];
                element.textContent = value;
            }
        });
        
        // Show results section
        const resultsSection = document.querySelector('[data-results-section]');
        if (resultsSection) {
            resultsSection.classList.add('animate-fade-in');
            resultsSection.style.display = 'block';
        }
    },
    
    /**
     * Reset calculator form
     */
    reset: function(form) {
        form.reset();
        
        // Hide results
        const resultsSection = document.querySelector('[data-results-section]');
        if (resultsSection) {
            resultsSection.style.display = 'none';
        }
        
        VapeX.utils.notify(VapeX.i18n.form_reset || 'Form reset', 'info');
    },
    
    /**
     * Load saved presets
     */
    loadPresets: function() {
        // This would load presets from localStorage or API
        VapeX.utils.log('Loading calculator presets');
    }
};

// =====================================================
// SEARCH FUNCTIONALITY
// =====================================================

VapeX.search = {
    
    /**
     * Initialize search functionality
     */
    init: function() {
        const searchInputs = document.querySelectorAll('[data-search]');
        
        searchInputs.forEach(input => {
            input.addEventListener('input', VapeX.utils.debounce((e) => {
                this.performSearch(e.target.value, e.target.dataset.search);
            }, 300));
        });
    },
    
    /**
     * Perform search
     */
    performSearch: function(query, type) {
        if (query.length < 2) return;
        
        VapeX.utils.log(`Searching ${type}: ${query}`);
        
        // This would perform actual search via API
        // For now, just filter visible items
        this.filterItems(query, type);
    },
    
    /**
     * Filter visible items
     */
    filterItems: function(query, type) {
        const items = document.querySelectorAll(`[data-searchable="${type}"]`);
        const lowerQuery = query.toLowerCase();
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            const matches = text.includes(lowerQuery);
            
            item.style.display = matches ? '' : 'none';
            
            if (matches) {
                item.classList.add('animate-fade-in');
            }
        });
    }
};

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    VapeX.utils.log('VapeX application initializing...');
    
    // Initialize core modules
    VapeX.language.initSelector();
    VapeX.navigation.initMobile();
    VapeX.navigation.highlightActive();
    VapeX.forms.initValidation();
    VapeX.search.init();
    
    // Initialize page-specific modules
    if (document.querySelector('[data-calculator-form]')) {
        VapeX.calculator.init();
    }
    
    // Show welcome message in debug mode
    if (VapeX.config.debug) {
        VapeX.utils.notify('VapeX Debug Mode Enabled', 'info', 3000);
    }
    
    VapeX.utils.log('VapeX application initialized successfully');
});

// =====================================================
// GLOBAL ERROR HANDLING
// =====================================================

window.addEventListener('error', function(e) {
    VapeX.utils.log(`Global error: ${e.message}`, 'error');
    
    if (VapeX.config.debug) {
        VapeX.utils.notify(`Error: ${e.message}`, 'error');
    }
});

window.addEventListener('unhandledrejection', function(e) {
    VapeX.utils.log(`Unhandled promise rejection: ${e.reason}`, 'error');
    
    if (VapeX.config.debug) {
        VapeX.utils.notify(`Promise Error: ${e.reason}`, 'error');
    }
});

// Export VapeX for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VapeX;
}

