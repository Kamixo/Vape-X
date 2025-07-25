// Test-Daten für die Anwendung

// Test-Benutzer erstellen
function createTestUsers() {
    const testUsers = [
        {
            id: 1,
            email: 'test@example.com',
            password: 'test123',
            isPremium: false,
            created: new Date().toISOString()
        },
        {
            id: 2,
            email: 'premium@example.com',
            password: 'premium123',
            isPremium: true,
            created: new Date().toISOString()
        },
        {
            id: 3,
            email: 'demo@vape-x.com',
            password: 'demo123',
            isPremium: false,
            created: new Date().toISOString()
        }
    ];
    
    localStorage.setItem('testUsers', JSON.stringify(testUsers));
    console.log('✅ Test-Benutzer erstellt:');
    testUsers.forEach(user => {
        console.log(`📧 ${user.email} | 🔑 ${user.password} | ${user.isPremium ? '💎 Premium' : '🆓 Kostenlos'}`);
    });
}

// Test-Zutaten erstellen
function createTestIngredients() {
    const testIngredients = [
        {
            id: 1,
            name: 'Erdbeere',
            brand: 'Capella',
            category: 'Frucht',
            price: 4.99,
            amount: 10,
            optimalPercentage: 8.0,
            pg: 100,
            vg: 0,
            other: 0,
            nicotineStrength: 0,
            notes: 'Süße, reife Erdbeere mit natürlichem Geschmack'
        },
        {
            id: 2,
            name: 'Vanille',
            brand: 'The Flavor Apprentice',
            category: 'Süß',
            price: 5.49,
            amount: 10,
            optimalPercentage: 3.0,
            pg: 100,
            vg: 0,
            other: 0,
            nicotineStrength: 0,
            notes: 'Cremige Vanille, perfekt für Dessert-Mischungen'
        },
        {
            id: 3,
            name: 'Menthol',
            brand: 'Flavorah',
            category: 'Menthol',
            price: 6.99,
            amount: 10,
            optimalPercentage: 1.5,
            pg: 100,
            vg: 0,
            other: 0,
            nicotineStrength: 0,
            notes: 'Starkes, kühlendes Menthol'
        },
        {
            id: 4,
            name: 'Ananas',
            brand: 'Inawera',
            category: 'Frucht',
            price: 7.99,
            amount: 10,
            optimalPercentage: 6.0,
            pg: 100,
            vg: 0,
            other: 0,
            nicotineStrength: 0,
            notes: 'Tropische, süße Ananas'
        },
        {
            id: 5,
            name: 'Schokolade',
            brand: 'Flavour Art',
            category: 'Süß',
            price: 5.99,
            amount: 10,
            optimalPercentage: 4.0,
            pg: 100,
            vg: 0,
            other: 0,
            nicotineStrength: 0,
            notes: 'Dunkle Schokolade mit reichem Geschmack'
        }
    ];
    
    localStorage.setItem('liquidCalculatorIngredients', JSON.stringify(testIngredients));
    console.log('✅ Test-Zutaten erstellt:', testIngredients.length, 'Zutaten');
}

// Test-Rezepte erstellen
function createTestRecipes() {
    const testRecipes = [
        {
            id: 1,
            name: 'Erdbeere-Vanille Traum',
            targetVolume: 50,
            targetNicotine: 6,
            baseNicotine: 48,
            flavors: [
                { name: 'Erdbeere', percentage: 8.0 },
                { name: 'Vanille', percentage: 3.0 }
            ],
            isPublic: true,
            author: 'test@example.com',
            created: new Date().toISOString(),
            likes: 15,
            views: 89,
            rating: 4.2
        },
        {
            id: 2,
            name: 'Menthol Fresh',
            targetVolume: 30,
            targetNicotine: 3,
            baseNicotine: 48,
            flavors: [
                { name: 'Menthol', percentage: 1.5 }
            ],
            isPublic: true,
            author: 'premium@example.com',
            created: new Date().toISOString(),
            likes: 23,
            views: 156,
            rating: 4.7
        },
        {
            id: 3,
            name: 'Tropical Paradise',
            targetVolume: 100,
            targetNicotine: 12,
            baseNicotine: 48,
            flavors: [
                { name: 'Ananas', percentage: 6.0 },
                { name: 'Vanille', percentage: 2.0 }
            ],
            isPublic: false,
            author: 'premium@example.com',
            created: new Date().toISOString(),
            likes: 31,
            views: 203,
            rating: 4.5
        }
    ];
    
    localStorage.setItem('liquidCalculatorRecipes', JSON.stringify(testRecipes));
    console.log('✅ Test-Rezepte erstellt:', testRecipes.length, 'Rezepte');
}

// Alle Test-Daten erstellen
function initializeTestData() {
    console.log('🔧 Erstelle Test-Daten...');
    
    createTestUsers();
    createTestIngredients();
    createTestRecipes();
    
    console.log('🎉 Alle Test-Daten erfolgreich erstellt!');
    console.log('');
    console.log('📋 ZUGANGSDATEN:');
    console.log('1. Kostenloser Account:');
    console.log('   📧 E-Mail: test@example.com');
    console.log('   🔑 Passwort: test123');
    console.log('');
    console.log('2. Premium Account:');
    console.log('   📧 E-Mail: premium@example.com');
    console.log('   🔑 Passwort: premium123');
    console.log('');
    console.log('3. Demo Account:');
    console.log('   📧 E-Mail: demo@vape-x.com');
    console.log('   🔑 Passwort: demo123');
    console.log('');
    console.log('💡 Tipp: Öffne die Browser-Konsole (F12) um diese Daten zu sehen!');
}

// Test-Daten beim Laden der Seite erstellen
document.addEventListener('DOMContentLoaded', function() {
    // Nur erstellen, wenn noch keine Test-Daten vorhanden sind
    if (!localStorage.getItem('testUsers')) {
        initializeTestData();
    }
});

// Globale Funktion zum manuellen Erstellen der Test-Daten
window.createTestData = initializeTestData;

// Test-Login-Funktion
window.testLogin = function(email = 'test@example.com', password = 'test123') {
    const testUsers = JSON.parse(localStorage.getItem('testUsers')) || [];
    const user = testUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log('✅ Test-Login erfolgreich:', user.email);
        
        // Update UI
        if (window.updateAuthUI) {
            window.updateAuthUI();
        }
        
        // Show notification
        if (window.showNotification) {
            window.showNotification(`Willkommen zurück, ${user.email}!`, 'success');
        }
        
        return true;
    } else {
        console.log('❌ Test-Login fehlgeschlagen');
        return false;
    }
};

// Test-Logout-Funktion
window.testLogout = function() {
    localStorage.removeItem('currentUser');
    console.log('✅ Test-Logout erfolgreich');
    
    // Update UI
    if (window.updateAuthUI) {
        window.updateAuthUI();
    }
    
    // Show notification
    if (window.showNotification) {
        window.showNotification('Erfolgreich abgemeldet!', 'info');
    }
};

