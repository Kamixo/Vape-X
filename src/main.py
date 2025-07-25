from flask import Flask, send_from_directory, jsonify
from src.extensions import db, cors
from src.models.user import User
from src.models.ingredient import Ingredient
from src.models.recipe import Recipe, RecipeIngredient
from src.models.vote import Vote
from src.routes.user import user_bp
from src.routes.ingredient import ingredient_bp
from src.routes.recipe import recipe_bp
from src.routes.vote import vote_bp
import os

def create_app():
    """Flask-Anwendung erstellen und konfigurieren"""
    app = Flask(__name__, static_folder='static')
    
    # Konfiguration
    app.config['SECRET_KEY'] = 'vape-x-secret-key-2025-secure'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://XDampfer2Go:fjx0feox4w25jb97qWj56@r12.hallo.cloud:3306/vapex'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }
    
    # Extensions initialisieren
    db.init_app(app)
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Blueprints registrieren
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(ingredient_bp, url_prefix='/api')
    app.register_blueprint(recipe_bp, url_prefix='/api')
    app.register_blueprint(vote_bp, url_prefix='/api')
    
    # Datenbank-Tabellen erstellen
    with app.app_context():
        try:
            db.create_all()
            print("✅ Datenbank-Tabellen erfolgreich erstellt/aktualisiert")
        except Exception as e:
            print(f"❌ Fehler beim Erstellen der Datenbank-Tabellen: {e}")
    
    return app

# Flask-App erstellen
app = create_app()

# Statische Dateien (Frontend) servieren
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    """Frontend-Dateien servieren"""
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return jsonify({'error': 'Static folder not configured'}), 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return jsonify({'error': 'Frontend not found'}), 404

# API-Test-Endpunkt
@app.route('/api/test')
def api_test():
    """API-Test-Endpunkt"""
    return jsonify({
        'message': 'Vape-X Backend API funktioniert!',
        'version': '1.0.0',
        'status': 'online',
        'endpoints': {
            'user': '/api/user/*',
            'ingredients': '/api/ingredients/*',
            'recipes': '/api/recipes/*',
            'votes': '/api/recipes/*/like, /api/recipes/*/rating'
        }
    }), 200

# Gesundheitscheck
@app.route('/api/health')
def health_check():
    """Gesundheitscheck für die Anwendung"""
    try:
        # Datenbankverbindung testen
        db.session.execute('SELECT 1')
        db_status = 'healthy'
    except Exception as e:
        db_status = f'error: {str(e)}'
    
    return jsonify({
        'status': 'healthy' if db_status == 'healthy' else 'unhealthy',
        'database': db_status,
        'timestamp': '2025-07-25T12:00:00Z'
    }), 200 if db_status == 'healthy' else 503

# Fehlerbehandlung
@app.errorhandler(404)
def not_found(error):
    """404-Fehlerbehandlung"""
    return jsonify({'error': 'Endpoint nicht gefunden'}), 404

@app.errorhandler(500)
def internal_error(error):
    """500-Fehlerbehandlung"""
    db.session.rollback()
    return jsonify({'error': 'Interner Serverfehler'}), 500

if __name__ == '__main__':
    print("🚀 Vape-X Backend startet...")
    print("📱 Frontend: http://127.0.0.1:5000")
    print("🔧 API-Test: http://127.0.0.1:5000/api/test")
    print("💚 Health-Check: http://127.0.0.1:5000/api/health")
    print("📚 API-Dokumentation:")
    print("   - User: /api/user/register, /api/user/login, /api/user/profile")
    print("   - Ingredients: /api/ingredients (GET, POST, PUT, DELETE)")
    print("   - Recipes: /api/recipes (GET, POST, PUT, DELETE)")
    print("   - Public Recipes: /api/recipes/public")
    print("   - Voting: /api/recipes/{id}/like, /api/recipes/{id}/rating")
    
    app.run(debug=True, host='127.0.0.1', port=5000)

