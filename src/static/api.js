// API-Integration für Backend-Kommunikation
class APIManager {
    constructor() {
        this.apiBase = '';
    }

    // Generische API-Anfrage
    async apiRequest(endpoint, options = {}) {
        const url = `${this.apiBase}${endpoint}`;
        const config = {
            headers: authManager.getAuthHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (response.ok) {
                return { success: true, data };
            } else {
                // Token abgelaufen
                if (response.status === 401) {
                    authManager.logout();
                    showNotification('Sitzung abgelaufen. Bitte melde dich erneut an.', 'warning');
                }
                return { success: false, error: data.error || 'Unbekannter Fehler' };
            }
        } catch (error) {
            return { success: false, error: 'Netzwerkfehler: ' + error.message };
        }
    }

    // === ZUTATEN-API ===

    // Alle Zutaten abrufen
    async getIngredients(category = null, search = null) {
        let endpoint = '/api/ingredients';
        const params = new URLSearchParams();
        
        if (category) params.append('category', category);
        if (search) params.append('search', search);
        
        if (params.toString()) {
            endpoint += '?' + params.toString();
        }

        return await this.apiRequest(endpoint);
    }

    // Neue Zutat erstellen
    async createIngredient(ingredientData) {
        return await this.apiRequest('/api/ingredients', {
            method: 'POST',
            body: JSON.stringify(ingredientData)
        });
    }

    // Zutat aktualisieren
    async updateIngredient(id, ingredientData) {
        return await this.apiRequest(`/api/ingredients/${id}`, {
            method: 'PUT',
            body: JSON.stringify(ingredientData)
        });
    }

    // Zutat löschen
    async deleteIngredient(id) {
        return await this.apiRequest(`/api/ingredients/${id}`, {
            method: 'DELETE'
        });
    }

    // Autocomplete-Vorschläge für Zutaten
    async getIngredientSuggestions(query, category = null) {
        let endpoint = `/api/ingredients/suggestions?q=${encodeURIComponent(query)}`;
        if (category) endpoint += `&category=${category}`;

        return await this.apiRequest(endpoint);
    }

    // === REZEPTE-API ===

    // Alle eigenen Rezepte abrufen
    async getRecipes() {
        return await this.apiRequest('/api/recipes');
    }

    // Neues Rezept erstellen
    async createRecipe(recipeData) {
        return await this.apiRequest('/api/recipes', {
            method: 'POST',
            body: JSON.stringify(recipeData)
        });
    }

    // Rezept aktualisieren
    async updateRecipe(id, recipeData) {
        return await this.apiRequest(`/api/recipes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(recipeData)
        });
    }

    // Rezept löschen
    async deleteRecipe(id) {
        return await this.apiRequest(`/api/recipes/${id}`, {
            method: 'DELETE'
        });
    }

    // Rezept duplizieren
    async duplicateRecipe(id, newName = null) {
        const body = newName ? JSON.stringify({ name: newName }) : '{}';
        return await this.apiRequest(`/api/recipes/${id}/duplicate`, {
            method: 'POST',
            body
        });
    }

    // Öffentliche Rezepte abrufen
    async getPublicRecipes(query = null, ingredient = null, sort = 'created_at', page = 1) {
        let endpoint = '/api/recipes/public';
        const params = new URLSearchParams();
        
        if (query) params.append('q', query);
        if (ingredient) params.append('ingredient', ingredient);
        if (sort) params.append('sort', sort);
        params.append('page', page.toString());
        
        if (params.toString()) {
            endpoint += '?' + params.toString();
        }

        return await this.apiRequest(endpoint);
    }

    // Rezept-Views erhöhen
    async incrementRecipeViews(id) {
        return await this.apiRequest(`/api/recipes/${id}/view`, {
            method: 'POST'
        });
    }

    // === VOTING-API ===

    // Rezept liken/unliken
    async toggleRecipeLike(id) {
        return await this.apiRequest(`/api/recipes/${id}/like`, {
            method: 'POST'
        });
    }

    // Rezept bewerten
    async rateRecipe(id, rating, comment = null) {
        return await this.apiRequest(`/api/recipes/${id}/rating`, {
            method: 'POST',
            body: JSON.stringify({ rating, comment })
        });
    }

    // Eigene Bewertung abrufen
    async getMyVote(id) {
        return await this.apiRequest(`/api/recipes/${id}/my-vote`);
    }

    // Alle Bewertungen eines Rezepts abrufen
    async getRecipeVotes(id) {
        return await this.apiRequest(`/api/recipes/${id}/votes`);
    }
}

// Globale API-Manager-Instanz
const apiManager = new APIManager();

// === INTEGRATION MIT BESTEHENDEN FUNKTIONEN ===

// Zutaten vom Server laden
async function loadIngredientsFromServer() {
    if (!authManager.isLoggedIn()) return;

    const result = await apiManager.getIngredients();
    if (result.success) {
        // Server-Daten mit lokalen Daten synchronisieren
        ingredients = result.data.ingredients;
        localStorage.setItem('liquidCalculatorIngredients', JSON.stringify(ingredients));
        updateIngredientsDisplay();
    } else {
        console.error('Fehler beim Laden der Zutaten:', result.error);
    }
}

// Rezepte vom Server laden
async function loadRecipesFromServer() {
    if (!authManager.isLoggedIn()) return;

    const result = await apiManager.getRecipes();
    if (result.success) {
        // Server-Daten mit lokalen Daten synchronisieren
        recipes = result.data.recipes;
        localStorage.setItem('liquidCalculatorRecipes', JSON.stringify(recipes));
        updateRecipesDisplay();
    } else {
        console.error('Fehler beim Laden der Rezepte:', result.error);
    }
}

// Neue Zutat speichern (erweitert für Backend)
async function saveNewIngredient(ingredientData) {
    if (authManager.isLoggedIn()) {
        const result = await apiManager.createIngredient(ingredientData);
        if (result.success) {
            // Lokale Liste aktualisieren
            ingredients.push(result.data.ingredient);
            localStorage.setItem('liquidCalculatorIngredients', JSON.stringify(ingredients));
            updateIngredientsDisplay();
            showNotification('Zutat erfolgreich gespeichert!', 'success');
            return true;
        } else {
            if (result.error.includes('Limit erreicht')) {
                showPayPalModal();
            } else {
                showNotification('Fehler beim Speichern: ' + result.error, 'error');
            }
            return false;
        }
    } else {
        // Lokale Speicherung für nicht angemeldete Benutzer
        ingredients.push({
            id: Date.now(),
            ...ingredientData,
            created_at: new Date().toISOString()
        });
        localStorage.setItem('liquidCalculatorIngredients', JSON.stringify(ingredients));
        updateIngredientsDisplay();
        return true;
    }
}

// Rezept speichern (erweitert für Backend)
async function saveRecipe(recipeData) {
    if (authManager.isLoggedIn()) {
        const result = await apiManager.createRecipe(recipeData);
        if (result.success) {
            // Lokale Liste aktualisieren
            recipes.push(result.data.recipe);
            localStorage.setItem('liquidCalculatorRecipes', JSON.stringify(recipes));
            updateRecipesDisplay();
            showNotification('Rezept erfolgreich gespeichert!', 'success');
            return true;
        } else {
            if (result.error.includes('Limit erreicht')) {
                showPayPalModal();
            } else {
                showNotification('Fehler beim Speichern: ' + result.error, 'error');
            }
            return false;
        }
    } else {
        // Lokale Speicherung für nicht angemeldete Benutzer
        recipes.push({
            id: Date.now(),
            ...recipeData,
            created_at: new Date().toISOString()
        });
        localStorage.setItem('liquidCalculatorRecipes', JSON.stringify(recipes));
        updateRecipesDisplay();
        return true;
    }
}

// Autocomplete für Aromen mit Backend-Integration
async function setupFlavorAutocomplete(input) {
    let debounceTimer;
    
    input.addEventListener('input', async function() {
        const query = this.value.trim();
        const suggestionsDiv = this.parentElement.querySelector('.flavor-suggestions');
        
        clearTimeout(debounceTimer);
        
        if (query.length < 2) {
            suggestionsDiv.style.display = 'none';
            return;
        }
        
        debounceTimer = setTimeout(async () => {
            if (authManager.isLoggedIn()) {
                const result = await apiManager.getIngredientSuggestions(query, 'aroma');
                if (result.success) {
                    displayFlavorSuggestions(suggestionsDiv, result.data.suggestions, input);
                }
            } else {
                // Lokale Suche für nicht angemeldete Benutzer
                const localSuggestions = ingredients
                    .filter(ing => ing.category === 'aroma' && 
                           ing.name.toLowerCase().includes(query.toLowerCase()))
                    .slice(0, 5);
                displayFlavorSuggestions(suggestionsDiv, localSuggestions, input);
            }
        }, 300);
    });
}

// Vorschläge anzeigen
function displayFlavorSuggestions(suggestionsDiv, suggestions, input) {
    if (suggestions.length === 0) {
        suggestionsDiv.style.display = 'none';
        return;
    }
    
    suggestionsDiv.innerHTML = suggestions.map(suggestion => `
        <div class="suggestion-item" data-id="${suggestion.id}" data-percentage="${suggestion.optimal_percentage || ''}">
            <span class="suggestion-name">${suggestion.name}</span>
            ${suggestion.optimal_percentage ? `<span class="suggestion-percentage">${suggestion.optimal_percentage}%</span>` : ''}
            ${suggestion.is_own ? '<span class="suggestion-badge">Eigene</span>' : ''}
        </div>
    `).join('');
    
    // Event-Listener für Vorschläge
    suggestionsDiv.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            input.value = this.querySelector('.suggestion-name').textContent;
            const percentage = this.dataset.percentage;
            if (percentage) {
                const percentageInput = input.closest('.flavor-group').querySelector('.flavor-percentage');
                if (percentageInput) {
                    percentageInput.value = percentage;
                }
            }
            suggestionsDiv.style.display = 'none';
        });
    });
    
    suggestionsDiv.style.display = 'block';
}

// Öffentliche Rezepte laden und anzeigen
async function loadPublicRecipes(query = null, ingredient = null, sort = 'created_at') {
    const result = await apiManager.getPublicRecipes(query, ingredient, sort);
    if (result.success) {
        displayPublicRecipes(result.data.recipes);
        return result.data;
    } else {
        showNotification('Fehler beim Laden der öffentlichen Rezepte: ' + result.error, 'error');
        return null;
    }
}

// Öffentliche Rezepte anzeigen
function displayPublicRecipes(recipes) {
    const container = document.getElementById('publicRecipesContainer');
    if (!container) return;
    
    if (recipes.length === 0) {
        container.innerHTML = '<div class="no-recipes">Keine öffentlichen Rezepte gefunden.</div>';
        return;
    }
    
    container.innerHTML = recipes.map(recipe => `
        <div class="recipe-card" data-recipe-id="${recipe.id}">
            <div class="recipe-header">
                <h3 class="recipe-name">${recipe.name}</h3>
                <div class="recipe-stats">
                    <span class="recipe-views">👁 ${recipe.views}</span>
                    <span class="recipe-likes">❤️ ${recipe.likes}</span>
                    <span class="recipe-rating">⭐ ${recipe.average_rating || 0}</span>
                </div>
            </div>
            <div class="recipe-details">
                <p><strong>Volumen:</strong> ${recipe.target_volume}ml</p>
                <p><strong>Nikotin:</strong> ${recipe.target_nicotine_strength}mg/ml</p>
                <p><strong>Aromen:</strong> ${recipe.ingredients.filter(i => i.category === 'aroma').map(i => i.name).join(', ')}</p>
            </div>
            <div class="recipe-actions">
                <button class="btn-secondary" onclick="viewRecipeDetails(${recipe.id})">Details</button>
                <button class="btn-primary" onclick="duplicatePublicRecipe(${recipe.id})">Duplizieren</button>
                <button class="btn-like ${recipe.user_liked ? 'liked' : ''}" onclick="toggleRecipeLike(${recipe.id})">
                    ❤️ ${recipe.likes}
                </button>
            </div>
        </div>
    `).join('');
}

// Rezept-Details anzeigen
async function viewRecipeDetails(recipeId) {
    // Views erhöhen
    await apiManager.incrementRecipeViews(recipeId);
    
    // Hier würde ein Modal mit den vollständigen Rezept-Details geöffnet
    // Das implementieren wir in der nächsten Phase
    showNotification('Rezept-Details werden geladen...', 'info');
}

// Öffentliches Rezept duplizieren
async function duplicatePublicRecipe(recipeId) {
    if (!authManager.isLoggedIn()) {
        showLoginModal();
        return;
    }
    
    const result = await apiManager.duplicateRecipe(recipeId);
    if (result.success) {
        showNotification('Rezept erfolgreich dupliziert!', 'success');
        await loadRecipesFromServer();
    } else {
        if (result.error.includes('Limit erreicht')) {
            showPayPalModal();
        } else {
            showNotification('Fehler beim Duplizieren: ' + result.error, 'error');
        }
    }
}

// Rezept liken/unliken
async function toggleRecipeLike(recipeId) {
    if (!authManager.isLoggedIn()) {
        showLoginModal();
        return;
    }
    
    const result = await apiManager.toggleRecipeLike(recipeId);
    if (result.success) {
        // UI aktualisieren
        const likeBtn = document.querySelector(`[onclick="toggleRecipeLike(${recipeId})"]`);
        if (likeBtn) {
            likeBtn.innerHTML = `❤️ ${result.data.total_likes}`;
            likeBtn.classList.toggle('liked', result.data.is_liked);
        }
    } else {
        showNotification('Fehler beim Liken: ' + result.error, 'error');
    }
}

