// Modal-Management und Bugfixes
document.addEventListener('DOMContentLoaded', function() {
    // Alle Modals standardmäßig verstecken
    const modals = ['authModal', 'recipeDetailsModal', 'ratingModal', 'recipeModal', 'ingredientModal', 'paypalModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    });
    
    // Rating-Modal Funktionen definieren
    window.hideRatingModal = function() {
        const modal = document.getElementById('ratingModal');
        if (modal) {
            modal.style.display = 'none';
        }
    };
    
    window.showRatingModal = function(recipeId) {
        const modal = document.getElementById('ratingModal');
        const recipeIdInput = document.getElementById('ratingRecipeId');
        if (modal && recipeIdInput) {
            recipeIdInput.value = recipeId;
            modal.style.display = 'block';
        }
    };
    
    // Rezept-Details Modal Funktionen
    window.hideRecipeDetailsModal = function() {
        const modal = document.getElementById('recipeDetailsModal');
        if (modal) {
            modal.style.display = 'none';
        }
    };
    
    // Rating-Form Handler (falls noch nicht definiert)
    window.handleRatingSubmit = function(event) {
        event.preventDefault();
        console.log('Rating form submitted');
        hideRatingModal();
        return false;
    };
    
    // Modal-Hintergrund-Klick zum Schließen
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // ESC-Taste zum Schließen von Modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            modals.forEach(modalId => {
                const modal = document.getElementById(modalId);
                if (modal && modal.style.display === 'block') {
                    modal.style.display = 'none';
                }
            });
        }
    });
    
    console.log('Modal-Fix loaded successfully');
});

