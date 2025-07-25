// Authentifizierungs-Management
class AuthManager {
    constructor() {
        this.token = localStorage.getItem('vapeXToken');
        this.user = JSON.parse(localStorage.getItem('vapeXUser')) || null;
        this.apiBase = '';
    }

    // Benutzer registrieren
    async register(email, password) {
        try {
            const response = await fetch(`${this.apiBase}/api/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.setAuthData(data.token, data.user);
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            return { success: false, error: 'Netzwerkfehler: ' + error.message };
        }
    }

    // Benutzer anmelden
    async login(email, password) {
        try {
            console.log('Login attempt:', email); // Debug
            
            const response = await fetch(`${this.apiBase}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            console.log('Response status:', response.status); // Debug
            console.log('Response headers:', response.headers.get('content-type')); // Debug

            // Prüfen ob Response JSON ist
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Non-JSON response:', text);
                return { success: false, error: 'Server-Fehler: Ungültige Antwort' };
            }

            const data = await response.json();

            if (response.ok) {
                this.setAuthData(data.token, data.user);
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error || 'Login fehlgeschlagen' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Netzwerkfehler: ' + error.message };
        }
    }

    // Benutzerprofil abrufen
    async getProfile() {
        if (!this.token) return { success: false, error: 'Nicht angemeldet' };

        try {
            const response = await fetch(`${this.apiBase}/api/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                this.user = data.user;
                localStorage.setItem('vapeXUser', JSON.stringify(data.user));
                return { success: true, user: data.user };
            } else {
                if (response.status === 401) {
                    this.logout();
                }
                return { success: false, error: data.error };
            }
        } catch (error) {
            return { success: false, error: 'Netzwerkfehler: ' + error.message };
        }
    }

    // Benutzerstatistiken abrufen
    async getUserStats() {
        if (!this.token) return { success: false, error: 'Nicht angemeldet' };

        try {
            const response = await fetch(`${this.apiBase}/api/user/stats`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, stats: data };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            return { success: false, error: 'Netzwerkfehler: ' + error.message };
        }
    }

    // Premium-Upgrade
    async upgradeToPremium(paymentId) {
        if (!this.token) return { success: false, error: 'Nicht angemeldet' };

        try {
            const response = await fetch(`${this.apiBase}/api/user/upgrade`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ payment_id: paymentId })
            });

            const data = await response.json();

            if (response.ok) {
                this.setAuthData(data.token, data.user);
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            return { success: false, error: 'Netzwerkfehler: ' + error.message };
        }
    }

    // Authentifizierungsdaten setzen
    setAuthData(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('vapeXToken', token);
        localStorage.setItem('vapeXUser', JSON.stringify(user));
        
        // UI aktualisieren
        this.updateUI();
    }

    // Abmelden
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('vapeXToken');
        localStorage.removeItem('vapeXUser');
        
        // UI aktualisieren
        this.updateUI();
    }

    // Prüfen ob angemeldet
    isLoggedIn() {
        return !!this.token && !!this.user;
    }

    // Prüfen ob Premium
    isPremium() {
        return this.user && this.user.is_premium;
    }

    // Authorization Header für API-Calls
    getAuthHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    // UI aktualisieren basierend auf Auth-Status
    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const userInfo = document.getElementById('userInfo');
        const premiumBadge = document.getElementById('premiumBadge');
        
        if (this.isLoggedIn()) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (userInfo) {
                userInfo.style.display = 'block';
                userInfo.innerHTML = `
                    <div class="user-info">
                        <span class="user-email">${this.user.email}</span>
                        ${this.isPremium() ? '<span class="premium-badge">Premium</span>' : '<span class="free-badge">Kostenlos</span>'}
                        <button class="logout-btn" onclick="authManager.logout()">Abmelden</button>
                    </div>
                `;
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (userInfo) userInfo.style.display = 'none';
        }

        // Limits anzeigen
        this.updateLimitsDisplay();
    }

    // Limits-Anzeige aktualisieren
    updateLimitsDisplay() {
        const limitsDisplay = document.getElementById('limitsDisplay');
        if (!limitsDisplay) return;

        if (this.isLoggedIn() && this.user) {
            const ingredientCount = this.user.ingredient_count || 0;
            const recipeCount = this.user.recipe_count || 0;
            const canAddIngredient = this.user.can_add_ingredient;
            const canAddRecipe = this.user.can_add_recipe;

            limitsDisplay.innerHTML = `
                <div class="limits-info">
                    <div class="limit-item ${!canAddIngredient ? 'limit-reached' : ''}">
                        <span>Zutaten: ${ingredientCount}${this.isPremium() ? '' : '/5'}</span>
                        ${!canAddIngredient ? '<span class="limit-warning">Limit erreicht</span>' : ''}
                    </div>
                    <div class="limit-item ${!canAddRecipe ? 'limit-reached' : ''}">
                        <span>Rezepte: ${recipeCount}${this.isPremium() ? '' : '/3'}</span>
                        ${!canAddRecipe ? '<span class="limit-warning">Limit erreicht</span>' : ''}
                    </div>
                    ${!this.isPremium() && (!canAddIngredient || !canAddRecipe) ? 
                        '<button class="upgrade-btn" onclick="showPayPalModal()">Upgrade zu Premium</button>' : ''}
                </div>
            `;
        } else {
            limitsDisplay.innerHTML = '<div class="login-prompt">Melde dich an, um deine Rezepte und Zutaten zu speichern!</div>';
        }
    }

    // Automatische Token-Validierung beim Laden
    async validateToken() {
        if (this.token) {
            const result = await this.getProfile();
            if (!result.success) {
                this.logout();
            }
        }
    }
}

// Globale Auth-Manager-Instanz
const authManager = new AuthManager();

// Login/Registrierung Modal-Management
function showLoginModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'block';
        document.getElementById('authForm').reset();
        document.getElementById('authError').textContent = '';
    }
}

function hideLoginModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function switchAuthMode(mode) {
    const title = document.getElementById('authTitle');
    const submitBtn = document.getElementById('authSubmitBtn');
    const switchText = document.getElementById('authSwitchText');
    const authMode = document.getElementById('authMode');

    if (mode === 'login') {
        title.textContent = 'Anmelden';
        submitBtn.textContent = 'Anmelden';
        switchText.innerHTML = 'Noch kein Konto? <a href="#" onclick="switchAuthMode(\'register\')">Registrieren</a>';
        authMode.value = 'login';
    } else {
        title.textContent = 'Registrieren';
        submitBtn.textContent = 'Registrieren';
        switchText.innerHTML = 'Bereits ein Konto? <a href="#" onclick="switchAuthMode(\'login\')">Anmelden</a>';
        authMode.value = 'register';
    }
}

// Auth-Form Handler
async function handleAuthSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const mode = formData.get('mode');
    
    const errorDiv = document.getElementById('authError');
    const submitBtn = document.getElementById('authSubmitBtn');
    
    // Loading-Zustand
    submitBtn.disabled = true;
    submitBtn.textContent = mode === 'login' ? 'Anmelden...' : 'Registrieren...';
    errorDiv.textContent = '';
    
    try {
        let result;
        if (mode === 'login') {
            result = await authManager.login(email, password);
        } else {
            result = await authManager.register(email, password);
        }
        
        if (result.success) {
            hideLoginModal();
            showNotification(mode === 'login' ? 'Erfolgreich angemeldet!' : 'Registrierung erfolgreich!', 'success');
            
            // Daten neu laden
            await loadUserData();
        } else {
            errorDiv.textContent = result.error;
        }
    } catch (error) {
        errorDiv.textContent = 'Ein unerwarteter Fehler ist aufgetreten';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = mode === 'login' ? 'Anmelden' : 'Registrieren';
    }
}

// Benutzerdaten laden
async function loadUserData() {
    if (authManager.isLoggedIn()) {
        // Profil aktualisieren
        await authManager.getProfile();
        
        // Zutaten und Rezepte vom Server laden
        await loadIngredientsFromServer();
        await loadRecipesFromServer();
    }
}

// Notification-System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', async function() {
    await authManager.validateToken();
    authManager.updateUI();
    await loadUserData();
});

