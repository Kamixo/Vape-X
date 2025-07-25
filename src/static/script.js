// Globale Variablen
let flavorCounter = 1;
let currentUnit = 'ml';
let ingredients = JSON.parse(localStorage.getItem('liquidCalculatorIngredients')) || [];
let recipes = JSON.parse(localStorage.getItem('liquidCalculatorRecipes')) || [];
let currentEditingIngredient = null;
let currentEditingRecipe = null;

// Dichtewerte für Gewichtsberechnung (g/ml)
const DENSITIES = {
    base: 1.036,    // PG-Basis
    nicotine: 1.01, // Nikotin
    flavor: 1.0     // Aromen (Durchschnitt)
};

// Premium-Limits
const FREE_LIMIT = 10;
let isPremiumUser = JSON.parse(localStorage.getItem('liquidCalculatorPremium')) || false;

// DOM Elements
const liquidForm = document.getElementById('liquidForm');
const resultsDiv = document.getElementById('results');
const errorDiv = document.getElementById('error');
const flavorsContainer = document.getElementById('flavorsContainer');
const addFlavorBtn = document.getElementById('addFlavorBtn');
const mlToggle = document.getElementById('mlToggle');
const gramToggle = document.getElementById('gramToggle');
const recipeManagement = document.getElementById('recipeManagement');
const newFlavorNotification = document.getElementById('newFlavorNotification');

// Navigation Elements
const burgerMenu = document.getElementById('burgerMenu');
const burgerDropdown = document.getElementById('burgerDropdown');
const dynamicHeadline = document.getElementById('dynamicHeadline');
const calculatorSection = document.getElementById('calculatorSection');
const ingredientsSection = document.getElementById('ingredientsSection');

// Modal Elements
const recipeModal = document.getElementById('recipeModal');
const ingredientModal = document.getElementById('ingredientModal');
const paypalModal = document.getElementById('paypalModal');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateIngredientsDisplay();
});

function initializeApp() {
    // Burger-Menü Setup
    setupBurgerMenu();
    
    // Initial flavor setup
    updateFlavorSuggestions();
    
    // Show calculator by default
    showSection('calculator');
}

function setupEventListeners() {
    // Form submission
    liquidForm.addEventListener('submit', calculateLiquid);
    
    // Add flavor button
    addFlavorBtn.addEventListener('click', addFlavor);
    
    // Unit toggle
    mlToggle.addEventListener('click', () => switchUnit('ml'));
    gramToggle.addEventListener('click', () => switchUnit('gram'));
    
    // Recipe management
    document.getElementById('saveRecipeBtn').addEventListener('click', showSaveRecipeModal);
    document.getElementById('loadRecipeBtn').addEventListener('click', showRecipeManagementModal);
    
    // Ingredient management
    document.getElementById('addIngredientBtn').addEventListener('click', showAddIngredientModal);
    document.getElementById('ingredientForm').addEventListener('submit', saveIngredient);
    
    // Modal close buttons
    document.getElementById('closeModal').addEventListener('click', hideRecipeModal);
    document.getElementById('closeIngredientModal').addEventListener('click', hideIngredientModal);
    document.getElementById('closePaypalModal').addEventListener('click', hidePaypalModal);
    
    // Ingredient filters
    document.getElementById('categoryFilter').addEventListener('change', updateIngredientsDisplay);
    document.getElementById('searchIngredients').addEventListener('input', updateIngredientsDisplay);
    
    // New flavor notification
    document.getElementById('saveNewFlavorsBtn').addEventListener('click', saveNewFlavors);
    document.getElementById('dismissNotificationBtn').addEventListener('click', hideNewFlavorNotification);
    
    // PayPal button (Visualisierung)
    document.getElementById('paypalButton').addEventListener('click', handlePayPalPayment);
    document.getElementById('deleteOldEntriesBtn').addEventListener('click', showDeleteEntriesOptions);
    
    // Click outside modals to close
    window.addEventListener('click', function(event) {
        if (event.target === recipeModal) hideRecipeModal();
        if (event.target === ingredientModal) hideIngredientModal();
        if (event.target === paypalModal) hidePaypalModal();
    });
}

function setupBurgerMenu() {
    burgerMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleBurgerMenu();
    });
    
    // Navigation items
    document.getElementById('burgerCalculator').addEventListener('click', () => {
        showSection('calculator');
        closeBurgerMenu();
    });
    
    document.getElementById('burgerIngredients').addEventListener('click', () => {
        showSection('ingredients');
        closeBurgerMenu();
    });
    
    document.getElementById('burgerAddIngredient').addEventListener('click', () => {
        showAddIngredientModal();
        closeBurgerMenu();
    });
    
    document.getElementById('burgerRecipes').addEventListener('click', () => {
        showRecipeManagementModal();
        closeBurgerMenu();
    });
    
    // Close burger menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!burgerMenu.contains(event.target) && !burgerDropdown.contains(event.target)) {
            closeBurgerMenu();
        }
    });
}

function toggleBurgerMenu() {
    burgerMenu.classList.toggle('active');
    burgerDropdown.classList.toggle('active');
}

function closeBurgerMenu() {
    burgerMenu.classList.remove('active');
    burgerDropdown.classList.remove('active');
}

function showSection(section) {
    // Hide all sections
    calculatorSection.classList.remove('active');
    ingredientsSection.classList.remove('active');
    
    // Show selected section
    if (section === 'calculator') {
        calculatorSection.classList.add('active');
        dynamicHeadline.textContent = 'E-Liquid Rechner';
    } else if (section === 'ingredients') {
        ingredientsSection.classList.add('active');
        dynamicHeadline.textContent = 'Zutaten verwalten';
        updateIngredientsDisplay();
    }
}

function addFlavor() {
    flavorCounter++;
    const flavorGroup = document.createElement('div');
    flavorGroup.className = 'flavor-group';
    flavorGroup.setAttribute('data-flavor-id', flavorCounter);
    
    flavorGroup.innerHTML = `
        <div class="flavor-inputs">
            <div class="flavor-name-container">
                <input type="text" class="flavor-name" placeholder="Aroma Name (z.B. Erdbeere)" value="Aroma ${flavorCounter}">
                <div class="flavor-suggestions" style="display: none;"></div>
            </div>
            <div class="flavor-percentage-group">
                <input type="number" class="flavor-percentage" min="0" max="30" value="5" step="0.1" required>
                <span class="percentage-symbol">%</span>
            </div>
            <button type="button" class="remove-flavor-btn" title="Aroma entfernen">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
            </button>
        </div>
    `;
    
    flavorsContainer.appendChild(flavorGroup);
    
    // Add event listeners for the new flavor
    const nameInput = flavorGroup.querySelector('.flavor-name');
    const removeBtn = flavorGroup.querySelector('.remove-flavor-btn');
    
    nameInput.addEventListener('input', function() {
        updateFlavorSuggestions(this);
    });
    
    nameInput.addEventListener('focus', function() {
        updateFlavorSuggestions(this);
    });
    
    nameInput.addEventListener('blur', function() {
        setTimeout(() => {
            const suggestionsDiv = this.parentNode.querySelector('.flavor-suggestions');
            suggestionsDiv.style.display = 'none';
        }, 200);
    });
    
    removeBtn.addEventListener('click', function() {
        flavorGroup.remove();
    });
}

function updateFlavorSuggestions(input) {
    if (!input) {
        // Update all flavor inputs
        const flavorInputs = document.querySelectorAll('.flavor-name');
        flavorInputs.forEach(input => {
            input.addEventListener('input', function() {
                updateFlavorSuggestions(this);
            });
            
            input.addEventListener('focus', function() {
                updateFlavorSuggestions(this);
            });
            
            input.addEventListener('blur', function() {
                setTimeout(() => {
                    const suggestionsDiv = this.parentNode.querySelector('.flavor-suggestions');
                    suggestionsDiv.style.display = 'none';
                }, 200);
            });
        });
        return;
    }
    
    const query = input.value.toLowerCase();
    const suggestionsDiv = input.parentNode.querySelector('.flavor-suggestions');
    
    if (query.length < 2) {
        suggestionsDiv.style.display = 'none';
        return;
    }
    
    const matchingIngredients = ingredients.filter(ingredient => 
        ingredient.category === 'aroma' && 
        (ingredient.name.toLowerCase().includes(query) || 
         (ingredient.brand && ingredient.brand.toLowerCase().includes(query)))
    );
    
    if (matchingIngredients.length === 0) {
        suggestionsDiv.style.display = 'none';
        return;
    }
    
    suggestionsDiv.innerHTML = '';
    matchingIngredients.forEach(ingredient => {
        const suggestion = document.createElement('div');
        suggestion.className = 'flavor-suggestion';
        suggestion.innerHTML = `
            <div class="suggestion-name">${ingredient.name}</div>
            ${ingredient.brand ? `<div class="suggestion-brand">${ingredient.brand}</div>` : ''}
            ${ingredient.optimalPercentage ? `<div class="suggestion-percentage">Empfohlen: ${ingredient.optimalPercentage}%</div>` : ''}
        `;
        
        suggestion.addEventListener('click', function() {
            input.value = ingredient.name;
            if (ingredient.optimalPercentage) {
                const percentageInput = input.closest('.flavor-group').querySelector('.flavor-percentage');
                percentageInput.value = ingredient.optimalPercentage;
            }
            suggestionsDiv.style.display = 'none';
        });
        
        suggestionsDiv.appendChild(suggestion);
    });
    
    suggestionsDiv.style.display = 'block';
}

function calculateLiquid(e) {
    e.preventDefault();
    
    try {
        // Get form values
        const targetVolume = parseFloat(document.getElementById('targetVolume').value);
        const nicotineBaseStrength = parseFloat(document.getElementById('nicotineBaseStrength').value);
        const targetNicotineStrength = parseFloat(document.getElementById('targetNicotineStrength').value);
        
        // Validate inputs
        if (nicotineBaseStrength <= targetNicotineStrength) {
            throw new Error('Die Nikotinstärke der Basis muss höher sein als die gewünschte Zielstärke.');
        }
        
        // Get flavors
        const flavorGroups = document.querySelectorAll('.flavor-group');
        const flavors = [];
        let totalFlavorPercentage = 0;
        
        flavorGroups.forEach(group => {
            const name = group.querySelector('.flavor-name').value.trim();
            const percentage = parseFloat(group.querySelector('.flavor-percentage').value);
            
            if (name && percentage > 0) {
                flavors.push({ name, percentage });
                totalFlavorPercentage += percentage;
            }
        });
        
        if (totalFlavorPercentage > 50) {
            throw new Error('Der Gesamtaromenanteil sollte 50% nicht überschreiten.');
        }
        
        // Calculate volumes
        const nicotineVolume = (targetVolume * targetNicotineStrength) / nicotineBaseStrength;
        const flavorVolume = (targetVolume * totalFlavorPercentage) / 100;
        const baseVolume = targetVolume - nicotineVolume - flavorVolume;
        
        if (baseVolume < 0) {
            throw new Error('Die Berechnung ergibt ein negatives Basisvolumen. Bitte überprüfe deine Eingaben.');
        }
        
        // Calculate weights
        const baseWeight = baseVolume * DENSITIES.base;
        const nicotineWeight = nicotineVolume * DENSITIES.nicotine;
        
        // Display results
        displayResults({
            targetVolume,
            targetNicotineStrength,
            baseVolume,
            baseWeight,
            nicotineVolume,
            nicotineWeight,
            flavors,
            totalFlavorPercentage
        });
        
        // Show recipe management
        recipeManagement.style.display = 'block';
        
        // Check for new flavors
        checkForNewFlavors(flavors);
        
        // Hide error
        errorDiv.style.display = 'none';
        
    } catch (error) {
        showError(error.message);
        resultsDiv.style.display = 'none';
        recipeManagement.style.display = 'none';
    }
}

function displayResults(results) {
    const { targetVolume, targetNicotineStrength, baseVolume, baseWeight, nicotineVolume, nicotineWeight, flavors } = results;
    
    // Update basic results
    document.getElementById('baseVolume').textContent = `${baseVolume.toFixed(1)} ml`;
    document.getElementById('baseWeight').textContent = `${baseWeight.toFixed(1)} g`;
    document.getElementById('nicotineVolume').textContent = `${nicotineVolume.toFixed(1)} ml`;
    document.getElementById('nicotineWeight').textContent = `${nicotineWeight.toFixed(1)} g`;
    
    // Update flavors results
    const flavorsResults = document.getElementById('flavorsResults');
    if (flavors.length > 0) {
        flavorsResults.innerHTML = `
            <h4>🌿 Aromen</h4>
            <div class="flavor-results-grid">
                ${flavors.map(flavor => {
                    const flavorVolume = (targetVolume * flavor.percentage) / 100;
                    const flavorWeight = flavorVolume * DENSITIES.flavor;
                    return `
                        <div class="flavor-result-item">
                            <div class="flavor-result-icon">🌿</div>
                            <div class="flavor-result-content">
                                <span class="flavor-result-name">${flavor.name}</span>
                                <div class="flavor-result-value">${flavorVolume.toFixed(1)} ml</div>
                                <div class="flavor-result-value-gram" style="display: none;">${flavorWeight.toFixed(1)} g</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } else {
        flavorsResults.innerHTML = '';
    }
    
    // Update summary
    document.getElementById('summaryVolume').textContent = `${targetVolume} ml`;
    document.getElementById('summaryNicotine').textContent = `${targetNicotineStrength} mg/ml`;
    
    const summaryList = document.getElementById('summaryList');
    summaryList.innerHTML = `
        <li><strong>Basis:</strong> ${baseVolume.toFixed(1)} ml</li>
        <li><strong>Nikotin:</strong> ${nicotineVolume.toFixed(1)} ml</li>
        ${flavors.map(flavor => {
            const flavorVolume = (targetVolume * flavor.percentage) / 100;
            return `<li><strong>${flavor.name}:</strong> ${flavorVolume.toFixed(1)} ml</li>`;
        }).join('')}
    `;
    
    // Show results
    resultsDiv.style.display = 'block';
    
    // Apply current unit
    switchUnit(currentUnit);
}

function switchUnit(unit) {
    currentUnit = unit;
    
    // Update toggle buttons
    mlToggle.classList.toggle('active', unit === 'ml');
    gramToggle.classList.toggle('active', unit === 'gram');
    
    // Show/hide appropriate values
    const mlValues = document.querySelectorAll('.result-value');
    const gramValues = document.querySelectorAll('.result-value-gram');
    const flavorMlValues = document.querySelectorAll('.flavor-result-value');
    const flavorGramValues = document.querySelectorAll('.flavor-result-value-gram');
    
    if (unit === 'ml') {
        mlValues.forEach(el => el.style.display = 'block');
        gramValues.forEach(el => el.style.display = 'none');
        flavorMlValues.forEach(el => el.style.display = 'block');
        flavorGramValues.forEach(el => el.style.display = 'none');
    } else {
        mlValues.forEach(el => el.style.display = 'none');
        gramValues.forEach(el => el.style.display = 'block');
        flavorMlValues.forEach(el => el.style.display = 'none');
        flavorGramValues.forEach(el => el.style.display = 'block');
    }
}

function checkForNewFlavors(flavors) {
    const newFlavors = flavors.filter(flavor => 
        !ingredients.some(ingredient => 
            ingredient.category === 'aroma' && 
            ingredient.name.toLowerCase() === flavor.name.toLowerCase()
        )
    );
    
    if (newFlavors.length > 0) {
        const flavorNames = newFlavors.map(f => f.name).join(', ');
        document.getElementById('newFlavorText').textContent = 
            `Neue Aromen entdeckt: ${flavorNames}. Möchtest du sie in deiner Zutatenverwaltung speichern?`;
        newFlavorNotification.style.display = 'block';
        newFlavorNotification.dataset.newFlavors = JSON.stringify(newFlavors);
    }
}

function saveNewFlavors() {
    const newFlavors = JSON.parse(newFlavorNotification.dataset.newFlavors || '[]');
    
    newFlavors.forEach(flavor => {
        const ingredient = {
            id: Date.now() + Math.random(),
            category: 'aroma',
            name: flavor.name,
            brand: '',
            price: 0,
            amount: 10,
            optimalPercentage: flavor.percentage,
            pg: 100,
            vg: 0,
            other: 0,
            nicotineStrength: 0
        };
        ingredients.push(ingredient);
    });
    
    saveIngredients();
    hideNewFlavorNotification();
    updateIngredientsDisplay();
}

function hideNewFlavorNotification() {
    newFlavorNotification.style.display = 'none';
}

function showError(message) {
    document.getElementById('errorText').textContent = message;
    errorDiv.style.display = 'flex';
}

// Recipe Management Functions
function showSaveRecipeModal() {
    if (!checkPremiumLimit('recipes')) return;
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Rezept speichern';
    modalBody.innerHTML = `
        <div class="recipe-input-group">
            <label for="saveRecipeName">Rezeptname *</label>
            <input type="text" id="saveRecipeName" placeholder="Mein E-Liquid Rezept" required>
        </div>
        <div class="modal-buttons">
            <button type="button" class="modal-btn modal-btn-secondary" onclick="hideRecipeModal()">Abbrechen</button>
            <button type="button" class="modal-btn modal-btn-primary" onclick="saveCurrentRecipe()">Speichern</button>
        </div>
    `;
    
    // Pre-fill with current recipe name if available
    const currentRecipeName = document.getElementById('recipeName').value;
    setTimeout(() => {
        const nameInput = document.getElementById('saveRecipeName');
        if (currentRecipeName) {
            nameInput.value = currentRecipeName;
        }
        nameInput.focus();
    }, 100);
    
    recipeModal.style.display = 'flex';
}

function saveCurrentRecipe() {
    const recipeName = document.getElementById('saveRecipeName').value.trim();
    if (!recipeName) {
        alert('Bitte gib einen Rezeptnamen ein.');
        return;
    }
    
    // Get current form data
    const recipe = {
        id: currentEditingRecipe ? currentEditingRecipe.id : Date.now(),
        name: recipeName,
        targetVolume: parseFloat(document.getElementById('targetVolume').value),
        nicotineBaseStrength: parseFloat(document.getElementById('nicotineBaseStrength').value),
        targetNicotineStrength: parseFloat(document.getElementById('targetNicotineStrength').value),
        flavors: [],
        createdAt: currentEditingRecipe ? currentEditingRecipe.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Get flavors
    const flavorGroups = document.querySelectorAll('.flavor-group');
    flavorGroups.forEach(group => {
        const name = group.querySelector('.flavor-name').value.trim();
        const percentage = parseFloat(group.querySelector('.flavor-percentage').value);
        
        if (name && percentage > 0) {
            recipe.flavors.push({ name, percentage });
        }
    });
    
    // Save or update recipe
    if (currentEditingRecipe) {
        const index = recipes.findIndex(r => r.id === currentEditingRecipe.id);
        if (index !== -1) {
            recipes[index] = recipe;
        }
        currentEditingRecipe = null;
    } else {
        recipes.push(recipe);
    }
    
    saveRecipes();
    hideRecipeModal();
    
    // Update recipe name in form
    document.getElementById('recipeName').value = recipeName;
}

function showRecipeManagementModal() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Rezepte verwalten';
    
    if (recipes.length === 0) {
        modalBody.innerHTML = `
            <div class="no-ingredients">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                </svg>
                <h3>Keine Rezepte vorhanden</h3>
                <p>Du hast noch keine Rezepte gespeichert. Erstelle dein erstes Rezept im Rechner!</p>
            </div>
        `;
    } else {
        modalBody.innerHTML = `
            <div class="recipe-list">
                ${recipes.map(recipe => `
                    <div class="recipe-item">
                        <div class="recipe-info">
                            <h4>${recipe.name}</h4>
                            <p>${recipe.targetVolume}ml, ${recipe.targetNicotineStrength}mg/ml, ${recipe.flavors.length} Aromen</p>
                        </div>
                        <div class="recipe-actions">
                            <button class="recipe-action-btn load-recipe-btn" onclick="loadRecipe(${recipe.id})">Laden</button>
                            <button class="recipe-action-btn edit-recipe-btn" onclick="editRecipe(${recipe.id})">Bearbeiten</button>
                            <button class="recipe-action-btn duplicate-recipe-btn" onclick="duplicateRecipe(${recipe.id})">Duplizieren</button>
                            <button class="recipe-action-btn delete-recipe-btn" onclick="deleteRecipe(${recipe.id})">Löschen</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    recipeModal.style.display = 'flex';
}

function loadRecipe(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    // Load basic data
    document.getElementById('recipeName').value = recipe.name;
    document.getElementById('targetVolume').value = recipe.targetVolume;
    document.getElementById('nicotineBaseStrength').value = recipe.nicotineBaseStrength;
    document.getElementById('targetNicotineStrength').value = recipe.targetNicotineStrength;
    
    // Clear existing flavors
    flavorsContainer.innerHTML = '';
    flavorCounter = 0;
    
    // Load flavors
    recipe.flavors.forEach((flavor, index) => {
        if (index === 0) {
            // Use first flavor group
            flavorCounter = 1;
            const flavorGroup = document.createElement('div');
            flavorGroup.className = 'flavor-group';
            flavorGroup.setAttribute('data-flavor-id', 1);
            
            flavorGroup.innerHTML = `
                <div class="flavor-inputs">
                    <div class="flavor-name-container">
                        <input type="text" class="flavor-name" placeholder="Aroma Name (z.B. Erdbeere)" value="${flavor.name}">
                        <div class="flavor-suggestions" style="display: none;"></div>
                    </div>
                    <div class="flavor-percentage-group">
                        <input type="number" class="flavor-percentage" min="0" max="30" value="${flavor.percentage}" step="0.1" required>
                        <span class="percentage-symbol">%</span>
                    </div>
                    <button type="button" class="remove-flavor-btn" title="Aroma entfernen">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="15" y1="9" x2="9" y2="15"/>
                            <line x1="9" y1="9" x2="15" y2="15"/>
                        </svg>
                    </button>
                </div>
            `;
            
            flavorsContainer.appendChild(flavorGroup);
            
            // Add event listeners
            const nameInput = flavorGroup.querySelector('.flavor-name');
            const removeBtn = flavorGroup.querySelector('.remove-flavor-btn');
            
            nameInput.addEventListener('input', function() {
                updateFlavorSuggestions(this);
            });
            
            nameInput.addEventListener('focus', function() {
                updateFlavorSuggestions(this);
            });
            
            nameInput.addEventListener('blur', function() {
                setTimeout(() => {
                    const suggestionsDiv = this.parentNode.querySelector('.flavor-suggestions');
                    suggestionsDiv.style.display = 'none';
                }, 200);
            });
            
            removeBtn.addEventListener('click', function() {
                flavorGroup.remove();
            });
        } else {
            // Add additional flavors
            addFlavor();
            const lastFlavorGroup = flavorsContainer.lastElementChild;
            lastFlavorGroup.querySelector('.flavor-name').value = flavor.name;
            lastFlavorGroup.querySelector('.flavor-percentage').value = flavor.percentage;
        }
    });
    
    hideRecipeModal();
    showSection('calculator');
}

function editRecipe(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    currentEditingRecipe = recipe;
    loadRecipe(recipeId);
    hideRecipeModal();
}

function duplicateRecipe(recipeId) {
    if (!checkPremiumLimit('recipes')) return;
    
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    const newName = prompt('Name für das duplizierte Rezept:', `${recipe.name} (Kopie)`);
    if (!newName) return;
    
    const duplicatedRecipe = {
        ...recipe,
        id: Date.now(),
        name: newName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    recipes.push(duplicatedRecipe);
    saveRecipes();
    showRecipeManagementModal(); // Refresh the modal
}

function deleteRecipe(recipeId) {
    if (confirm('Möchtest du dieses Rezept wirklich löschen?')) {
        recipes = recipes.filter(r => r.id !== recipeId);
        saveRecipes();
        showRecipeManagementModal(); // Refresh the modal
    }
}

function hideRecipeModal() {
    recipeModal.style.display = 'none';
    currentEditingRecipe = null;
}

// Ingredient Management Functions
function showAddIngredientModal() {
    if (!checkPremiumLimit('ingredients')) return;
    
    currentEditingIngredient = null;
    document.getElementById('ingredientModalTitle').textContent = 'Neue Zutat hinzufügen';
    document.getElementById('ingredientForm').reset();
    ingredientModal.style.display = 'flex';
}

function editIngredient(ingredientId) {
    const ingredient = ingredients.find(i => i.id === ingredientId);
    if (!ingredient) return;
    
    currentEditingIngredient = ingredient;
    document.getElementById('ingredientModalTitle').textContent = 'Zutat bearbeiten';
    
    // Fill form with ingredient data
    document.getElementById('ingredientCategory').value = ingredient.category;
    document.getElementById('ingredientBrand').value = ingredient.brand || '';
    document.getElementById('ingredientName').value = ingredient.name;
    document.getElementById('ingredientPrice').value = ingredient.price || '';
    document.getElementById('ingredientAmount').value = ingredient.amount || '';
    document.getElementById('ingredientOptimalPercentage').value = ingredient.optimalPercentage || '';
    document.getElementById('ingredientPG').value = ingredient.pg || '';
    document.getElementById('ingredientVG').value = ingredient.vg || '';
    document.getElementById('ingredientOther').value = ingredient.other || '';
    document.getElementById('ingredientNicotineStrength').value = ingredient.nicotineStrength || '';
    
    ingredientModal.style.display = 'flex';
}

function saveIngredient(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const ingredient = {
        id: currentEditingIngredient ? currentEditingIngredient.id : Date.now(),
        category: formData.get('category'),
        brand: formData.get('brand') || '',
        name: formData.get('name'),
        price: parseFloat(formData.get('price')) || 0,
        amount: parseFloat(formData.get('amount')) || 0,
        optimalPercentage: parseFloat(formData.get('optimalPercentage')) || 0,
        pg: parseFloat(formData.get('pg')) || 0,
        vg: parseFloat(formData.get('vg')) || 0,
        other: parseFloat(formData.get('other')) || 0,
        nicotineStrength: parseFloat(formData.get('nicotineStrength')) || 0,
        createdAt: currentEditingIngredient ? currentEditingIngredient.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (currentEditingIngredient) {
        const index = ingredients.findIndex(i => i.id === currentEditingIngredient.id);
        if (index !== -1) {
            ingredients[index] = ingredient;
        }
    } else {
        ingredients.push(ingredient);
    }
    
    saveIngredients();
    hideIngredientModal();
    updateIngredientsDisplay();
}

function deleteIngredient(ingredientId) {
    if (confirm('Möchtest du diese Zutat wirklich löschen?')) {
        ingredients = ingredients.filter(i => i.id !== ingredientId);
        saveIngredients();
        updateIngredientsDisplay();
    }
}

function hideIngredientModal() {
    ingredientModal.style.display = 'none';
    currentEditingIngredient = null;
}

function updateIngredientsDisplay() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const searchQuery = document.getElementById('searchIngredients').value.toLowerCase();
    const ingredientsList = document.getElementById('ingredientsList');
    
    let filteredIngredients = ingredients;
    
    // Apply category filter
    if (categoryFilter !== 'all') {
        filteredIngredients = filteredIngredients.filter(i => i.category === categoryFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
        filteredIngredients = filteredIngredients.filter(i => 
            i.name.toLowerCase().includes(searchQuery) ||
            (i.brand && i.brand.toLowerCase().includes(searchQuery))
        );
    }
    
    if (filteredIngredients.length === 0) {
        ingredientsList.innerHTML = `
            <div class="no-ingredients">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
                    <line x1="16" y1="8" x2="2" y2="22"/>
                    <line x1="17.5" y1="15" x2="9" y2="15"/>
                </svg>
                <h3>Keine Zutaten gefunden</h3>
                <p>Füge deine erste Zutat hinzu oder ändere die Suchkriterien.</p>
            </div>
        `;
        return;
    }
    
    ingredientsList.innerHTML = filteredIngredients.map(ingredient => {
        const categoryIcon = {
            'aroma': '🌿',
            'base': '🧪',
            'nicotine': '💨'
        }[ingredient.category] || '📦';
        
        const details = [];
        if (ingredient.optimalPercentage) details.push(`${ingredient.optimalPercentage}%`);
        if (ingredient.price) details.push(`${ingredient.price}€`);
        if (ingredient.amount) details.push(`${ingredient.amount}ml`);
        if (ingredient.nicotineStrength) details.push(`${ingredient.nicotineStrength}mg/ml`);
        
        return `
            <div class="ingredient-item">
                <div class="ingredient-category ${ingredient.category}">
                    ${categoryIcon}
                </div>
                <div class="ingredient-info">
                    <div class="ingredient-name">${ingredient.name}</div>
                    ${ingredient.brand ? `<div class="ingredient-brand">${ingredient.brand}</div>` : ''}
                    <div class="ingredient-details">
                        ${details.map(detail => `<span class="ingredient-detail">${detail}</span>`).join('')}
                    </div>
                </div>
                <div class="ingredient-actions">
                    <button class="ingredient-action-btn edit-ingredient-btn" onclick="editIngredient(${ingredient.id})">
                        Bearbeiten
                    </button>
                    <button class="ingredient-action-btn delete-ingredient-btn" onclick="deleteIngredient(${ingredient.id})">
                        Löschen
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Premium/PayPal Functions
function checkPremiumLimit(type) {
    if (isPremiumUser) return true;
    
    const currentCount = type === 'ingredients' ? ingredients.length : recipes.length;
    
    if (currentCount >= FREE_LIMIT) {
        showPaypalModal(type);
        return false;
    }
    
    return true;
}

function showPaypalModal(type) {
    const typeText = type === 'ingredients' ? 'Zutaten' : 'Rezepte';
    paypalModal.style.display = 'flex';
}

function hidePaypalModal() {
    paypalModal.style.display = 'none';
}

function handlePayPalPayment() {
    // Visualisierung der PayPal-Zahlung
    alert('PayPal-Integration in Entwicklung!\n\nDies ist eine Visualisierung der geplanten Premium-Funktion. In der finalen Version würde hier die echte PayPal-Zahlung stattfinden.\n\nFür Testzwecke wird dein Account jetzt auf Premium umgestellt.');
    
    // Für Demo-Zwecke: Premium aktivieren
    isPremiumUser = true;
    localStorage.setItem('liquidCalculatorPremium', JSON.stringify(true));
    
    hidePaypalModal();
    
    // Zeige Erfolg
    alert('Premium-Account aktiviert! Du kannst jetzt unbegrenzt Zutaten und Rezepte speichern.');
}

function showDeleteEntriesOptions() {
    const totalEntries = ingredients.length + recipes.length;
    const message = `Du hast aktuell ${totalEntries} Einträge (${ingredients.length} Zutaten, ${recipes.length} Rezepte).\n\nWelche möchtest du löschen?`;
    
    if (confirm(message + '\n\nOK = Alte Zutaten löschen\nAbbrechen = Alte Rezepte löschen')) {
        // Lösche älteste Zutaten
        const toDelete = Math.max(0, ingredients.length - FREE_LIMIT + 1);
        if (toDelete > 0) {
            ingredients.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            ingredients.splice(0, toDelete);
            saveIngredients();
            updateIngredientsDisplay();
        }
    } else {
        // Lösche älteste Rezepte
        const toDelete = Math.max(0, recipes.length - FREE_LIMIT + 1);
        if (toDelete > 0) {
            recipes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            recipes.splice(0, toDelete);
            saveRecipes();
        }
    }
    
    hidePaypalModal();
}

// Storage Functions
function saveIngredients() {
    localStorage.setItem('liquidCalculatorIngredients', JSON.stringify(ingredients));
}

function saveRecipes() {
    localStorage.setItem('liquidCalculatorRecipes', JSON.stringify(recipes));
}

// Initialize flavor suggestions on page load
document.addEventListener('DOMContentLoaded', function() {
    updateFlavorSuggestions();
});


// === NAVIGATION FUNCTIONS ===
function setupBurgerMenu() {
    const burgerMenu = document.getElementById('burgerMenu');
    const burgerDropdown = document.getElementById('burgerDropdown');
    
    if (!burgerMenu || !burgerDropdown) {
        console.error('Burger menu elements not found');
        return;
    }
    
    // Burger menu items
    const menuItems = {
        'burgerCalculator': () => {
            showSection('calculatorSection');
            closeBurgerMenu();
        },
        'burgerIngredients': () => {
            showSection('ingredientsSection');
            closeBurgerMenu();
        },
        'burgerAddIngredient': () => {
            showAddIngredientModal();
            closeBurgerMenu();
        },
        'burgerRecipes': () => {
            showRecipeManagementModal();
            closeBurgerMenu();
        },
        'burgerPublicRecipes': () => {
            showSection('publicRecipesSection');
            loadPublicRecipes();
            closeBurgerMenu();
        },
        'burgerDashboard': () => {
            showSection('dashboardSection');
            loadDashboard();
            closeBurgerMenu();
        }
    };
    
    // Event Listeners für Menü-Items
    Object.keys(menuItems).forEach(itemId => {
        const element = document.getElementById(itemId);
        if (element) {
            element.addEventListener('click', menuItems[itemId]);
        } else {
            console.warn(`Menu item ${itemId} not found`);
        }
    });
    
    // Burger menu toggle
    burgerMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleBurgerMenu();
    });
    
    // Close burger menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!burgerMenu.contains(event.target) && !burgerDropdown.contains(event.target)) {
            closeBurgerMenu();
        }
    });
    
    console.log('✅ Burger menu setup complete');
}

function toggleBurgerMenu() {
    const burgerDropdown = document.getElementById('burgerDropdown');
    const burgerMenu = document.getElementById('burgerMenu');
    
    if (!burgerDropdown || !burgerMenu) return;
    
    const isOpen = burgerDropdown.classList.contains('show');
    
    if (isOpen) {
        closeBurgerMenu();
    } else {
        openBurgerMenu();
    }
}

function openBurgerMenu() {
    const burgerDropdown = document.getElementById('burgerDropdown');
    const burgerMenu = document.getElementById('burgerMenu');
    
    if (!burgerDropdown || !burgerMenu) return;
    
    burgerDropdown.classList.add('show');
    burgerDropdown.classList.add('active');
    burgerMenu.classList.add('active');
    
    console.log('🍔 Burger menu opened');
}

function closeBurgerMenu() {
    const burgerDropdown = document.getElementById('burgerDropdown');
    const burgerMenu = document.getElementById('burgerMenu');
    
    if (!burgerDropdown || !burgerMenu) return;
    
    burgerDropdown.classList.remove('show');
    burgerDropdown.classList.remove('active');
    burgerMenu.classList.remove('active');
    
    console.log('🍔 Burger menu closed');
}

function showSection(sectionId) {
    // Hide all sections
    const sections = ['calculatorSection', 'ingredientsSection', 'dashboardSection', 'publicRecipesSection'];
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.style.display = 'none';
        }
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Update headline
    updateHeadline(sectionId);
}

function updateHeadline(sectionId) {
    const headlines = {
        'calculatorSection': 'E-Liquid Rechner',
        'ingredientsSection': 'Zutaten verwalten',
        'dashboardSection': 'Mein Dashboard',
        'publicRecipesSection': 'Öffentliche Rezepte'
    };
    
    const headline = headlines[sectionId] || 'E-Liquid Rechner';
    document.getElementById('dynamicHeadline').textContent = headline;
}

// === DASHBOARD FUNCTIONS ===
function loadDashboard() {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showLoginPrompt('dashboardSection');
        return;
    }
    
    // Load user statistics
    loadUserStats();
    updateLimitsDisplay();
}

function loadUserStats() {
    const stats = {
        ingredients: ingredients.length,
        recipes: recipes.length,
        likes: Math.floor(Math.random() * 50), // Placeholder
        views: Math.floor(Math.random() * 200) // Placeholder
    };
    
    document.getElementById('statIngredients').textContent = stats.ingredients;
    document.getElementById('statRecipes').textContent = stats.recipes;
    document.getElementById('statLikes').textContent = stats.likes;
    document.getElementById('statViews').textContent = stats.views;
}

function updateLimitsDisplay() {
    const limitsDisplay = document.getElementById('limitsDisplay');
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        limitsDisplay.innerHTML = '<div class="login-prompt">Bitte melde dich an, um deine Limits zu sehen.</div>';
        return;
    }
    
    const isPremium = currentUser.isPremium || false;
    const ingredientCount = ingredients.length;
    const recipeCount = recipes.length;
    
    if (isPremium) {
        limitsDisplay.innerHTML = `
            <div class="limits-info">
                <div class="premium-badge">Premium</div>
                <div class="limit-item">🧪 Unbegrenzte Zutaten</div>
                <div class="limit-item">📋 Unbegrenzte Rezepte</div>
                <div class="limit-item">🔒 Private Rezepte möglich</div>
            </div>
        `;
    } else {
        const ingredientLimit = 5;
        const recipeLimit = 3;
        
        limitsDisplay.innerHTML = `
            <div class="limits-info">
                <div class="free-badge">Kostenlos</div>
                <div class="limit-item ${ingredientCount >= ingredientLimit ? 'limit-reached' : ''}">
                    🧪 Zutaten: ${ingredientCount}/${ingredientLimit}
                    ${ingredientCount >= ingredientLimit ? '<span class="limit-warning">Limit erreicht</span>' : ''}
                </div>
                <div class="limit-item ${recipeCount >= recipeLimit ? 'limit-reached' : ''}">
                    📋 Rezepte: ${recipeCount}/${recipeLimit}
                    ${recipeCount >= recipeLimit ? '<span class="limit-warning">Limit erreicht</span>' : ''}
                </div>
                <button class="upgrade-btn" onclick="showUpgradeModal()">Upgrade zu Premium</button>
            </div>
        `;
    }
}

// === PUBLIC RECIPES FUNCTIONS ===
function loadPublicRecipes() {
    const container = document.getElementById('publicRecipesContainer');
    
    // Sample public recipes
    const publicRecipes = [
        {
            id: 1,
            name: 'Erdbeere-Vanille Mix',
            author: 'TestUser1',
            ingredients: ['Erdbeere 8%', 'Vanille 3%'],
            likes: 15,
            views: 89,
            rating: 4.2,
            created: '2025-01-20'
        },
        {
            id: 2,
            name: 'Menthol Fresh',
            author: 'TestUser2',
            ingredients: ['Menthol 5%', 'Minze 2%'],
            likes: 23,
            views: 156,
            rating: 4.7,
            created: '2025-01-18'
        },
        {
            id: 3,
            name: 'Tropical Paradise',
            author: 'TestUser3',
            ingredients: ['Ananas 6%', 'Mango 4%', 'Kokosnuss 2%'],
            likes: 31,
            views: 203,
            rating: 4.5,
            created: '2025-01-15'
        }
    ];
    
    if (publicRecipes.length === 0) {
        container.innerHTML = '<div class="no-recipes">Noch keine öffentlichen Rezepte vorhanden.</div>';
        return;
    }
    
    container.innerHTML = publicRecipes.map(recipe => `
        <div class="recipe-card">
            <div class="recipe-header">
                <h3 class="recipe-name">${recipe.name}</h3>
                <div class="recipe-stats">
                    <span>❤️ ${recipe.likes}</span>
                    <span>👁 ${recipe.views}</span>
                    <span>⭐ ${recipe.rating}</span>
                </div>
            </div>
            <div class="recipe-details">
                <p><strong>Von:</strong> ${recipe.author}</p>
                <p><strong>Zutaten:</strong> ${recipe.ingredients.join(', ')}</p>
                <p><strong>Erstellt:</strong> ${new Date(recipe.created).toLocaleDateString('de-DE')}</p>
            </div>
            <div class="recipe-actions">
                <button class="btn-like" onclick="likeRecipe(${recipe.id})">
                    ❤️ Like (${recipe.likes})
                </button>
                <button class="btn-secondary" onclick="viewRecipeDetails(${recipe.id})">
                    📋 Details
                </button>
                <button class="btn-secondary" onclick="showRatingModal(${recipe.id})">
                    ⭐ Bewerten
                </button>
            </div>
        </div>
    `).join('');
}

function searchPublicRecipes() {
    const searchTerm = document.getElementById('publicRecipeSearch').value;
    const ingredientFilter = document.getElementById('publicRecipeIngredient').value;
    const sortBy = document.getElementById('publicRecipeSort').value;
    
    showNotification('Suche wird durchgeführt...', 'info');
    
    // Simulate search delay
    setTimeout(() => {
        loadPublicRecipes(); // Reload with filters applied
        showNotification('Suchergebnisse aktualisiert!', 'success');
    }, 500);
}

function likeRecipe(recipeId) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showNotification('Bitte melde dich an, um Rezepte zu liken.', 'warning');
        return;
    }
    
    showNotification('Rezept geliked! ❤️', 'success');
    // Update like count in UI
    loadPublicRecipes();
}

function viewRecipeDetails(recipeId) {
    showNotification('Rezept-Details werden geladen...', 'info');
    // Show recipe details modal
}

// === HELPER FUNCTIONS ===
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
}

function showLoginPrompt(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>Anmeldung erforderlich</h2>
                <p>Bitte melde dich an, um diese Funktion zu nutzen.</p>
                <button class="btn-primary" onclick="showLoginModal()">Jetzt anmelden</button>
            </div>
        `;
    }
}

function showUpgradeModal() {
    showNotification('Premium-Upgrade wird geladen...', 'info');
    // Show PayPal modal or upgrade process
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            container.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize sections on load
document.addEventListener('DOMContentLoaded', function() {
    // Show calculator section by default
    showSection('calculatorSection');
});

