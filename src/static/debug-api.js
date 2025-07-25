// Debug-Funktionen für API-Tests
window.debugAPI = {
    // Test API-Endpunkte
    async testEndpoints() {
        console.log('🔧 Teste API-Endpunkte...');
        
        const endpoints = [
            '/api/test',
            '/api/health',
            '/api/user/login'
        ];
        
        for (const endpoint of endpoints) {
            try {
                const response = await fetch(endpoint);
                const contentType = response.headers.get('content-type');
                
                console.log(`📍 ${endpoint}:`);
                console.log(`   Status: ${response.status}`);
                console.log(`   Content-Type: ${contentType}`);
                
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    console.log(`   Data:`, data);
                } else {
                    const text = await response.text();
                    console.log(`   Text (first 100 chars):`, text.substring(0, 100));
                }
                console.log('');
            } catch (error) {
                console.error(`❌ Fehler bei ${endpoint}:`, error);
            }
        }
    },
    
    // Test Login
    async testLogin(email = 'test@example.com', password = 'test123') {
        console.log('🔐 Teste Login...');
        
        try {
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', [...response.headers.entries()]);
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                console.log('✅ JSON Response:', data);
            } else {
                const text = await response.text();
                console.log('❌ Non-JSON Response:', text);
            }
        } catch (error) {
            console.error('❌ Login Test Fehler:', error);
        }
    },
    
    // Zeige alle verfügbaren Routen
    async showRoutes() {
        console.log('📋 Verfügbare Routen:');
        console.log('   GET  /api/test');
        console.log('   GET  /api/health');
        console.log('   POST /api/user/login');
        console.log('   POST /api/user/register');
        console.log('   GET  /api/user/profile');
        console.log('');
        console.log('💡 Verwende debugAPI.testEndpoints() um alle zu testen');
        console.log('💡 Verwende debugAPI.testLogin() um Login zu testen');
    }
};

// Automatisch beim Laden ausführen
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Debug-API geladen. Verwende debugAPI.showRoutes() für Hilfe.');
});

