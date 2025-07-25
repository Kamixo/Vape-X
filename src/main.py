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
    app.config['SECRET_KEY'] = 'vape-x-secret-key-2025'
    
    # Datenbank-Konfiguration - SQLite für lokale Entwicklung
    db_path = os.path.join(os.path.dirname(__file__), 'vape_x.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }
    
    # Extensions initialisieren
    db.init_app(app)
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5000", "http://127.0.0.1:5000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Blueprints registrieren
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(ingredient_bp, url_prefix='/api/ingredients')
    app.register_blueprint(recipe_bp, url_prefix='/api/recipes')
    app.register_blueprint(vote_bp, url_prefix='/api/recipes')
    
    # Datenbank-Tabellen erstellen
    with app.app_context():
        try:
            db.create_all()
            print("✅ Datenbank-Tabellen erfolgreich erstellt/aktualisiert")
            
            # Test-Daten erstellen falls Datenbank leer ist
            if User.query.count() == 0:
                create_test_data()
                print("✅ Test-Daten erfolgreich erstellt")
                
        except Exception as e:
            print(f"❌ Fehler beim Erstellen der Datenbank-Tabellen: {e}")
    
    return app

def create_test_data():
    """Test-Daten für die Datenbank erstellen"""
    try:
        # Test-Benutzer erstellen
        test_users = [
            User(email='test@example.com', password='test123', is_premium=False),
            User(email='premium@example.com', password='premium123', is_premium=True),
            User(email='demo@vape-x.com', password='demo123', is_premium=False)
        ]
        
        for user in test_users:
            user.set_password(user.password)  # Hash das Passwort
            db.session.add(user)
        
        db.session.commit()
        
        # Test-Zutaten erstellen
        test_ingredients = [
            Ingredient(
                name='Erdbeere',
                brand='Capella',
                category='Frucht',
                price=4.99,
                amount=10.0,
                optimal_percentage=8.0,
                pg_ratio=100.0,
                vg_ratio=0.0,
                other_ratio=0.0,
                nicotine_strength=0.0,
                notes='Süße, reife Erdbeere mit natürlichem Geschmack',
                user_id=1
            ),
            Ingredient(
                name='Vanille',
                brand='The Flavor Apprentice',
                category='Süß',
                price=5.49,
                amount=10.0,
                optimal_percentage=3.0,
                pg_ratio=100.0,
                vg_ratio=0.0,
                other_ratio=0.0,
                nicotine_strength=0.0,
                notes='Cremige Vanille, perfekt für Dessert-Mischungen',
                user_id=1
            ),
            Ingredient(
                name='Menthol',
                brand='Flavorah',
                category='Menthol',
                price=6.99,
                amount=10.0,
                optimal_percentage=1.5,
                pg_ratio=100.0,
                vg_ratio=0.0,
                other_ratio=0.0,
                nicotine_strength=0.0,
                notes='Starkes, kühlendes Menthol',
                user_id=2
            )
        ]
        
        for ingredient in test_ingredients:
            db.session.add(ingredient)
        
        db.session.commit()
        
        # Test-Rezepte erstellen
        recipe1 = Recipe(
            name='Erdbeere-Vanille Traum',
            target_volume=50.0,
            target_nicotine=6.0,
            base_nicotine=48.0,
            is_public=True,
            user_id=1
        )
        
        recipe2 = Recipe(
            name='Menthol Fresh',
            target_volume=30.0,
            target_nicotine=3.0,
            base_nicotine=48.0,
            is_public=True,
            user_id=2
        )
        
        db.session.add(recipe1)
        db.session.add(recipe2)
        db.session.commit()
        
        # Rezept-Zutaten hinzufügen
        recipe_ingredients = [
            RecipeIngredient(recipe_id=recipe1.id, ingredient_id=1, percentage=8.0),
            RecipeIngredient(recipe_id=recipe1.id, ingredient_id=2, percentage=3.0),
            RecipeIngredient(recipe_id=recipe2.id, ingredient_id=3, percentage=1.5)
        ]
        
        for ri in recipe_ingredients:
            db.session.add(ri)
        
        db.session.commit()
        
        print("📊 Test-Daten erstellt:")
        print(f"   👥 {len(test_users)} Benutzer")
        print(f"   🧪 {len(test_ingredients)} Zutaten")
        print(f"   📋 2 Rezepte")
        
    except Exception as e:
        print(f"❌ Fehler beim Erstellen der Test-Daten: {e}")
        db.session.rollback()

# Flask-App erstellen
app = create_app()

# Routes für statische Dateien
@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

# API-Test-Route
@app.route('/api/test')
def api_test():
    return jsonify({
        'message': 'Vape-X Backend API funktioniert!',
        'version': '1.0.0',
        'status': 'online',
        'database': 'SQLite (lokal)',
        'endpoints': {
            'user': '/api/user/*',
            'ingredients': '/api/ingredients/*',
            'recipes': '/api/recipes/*',
            'votes': '/api/recipes/*/like, /api/recipes/*/rating'
        }
    })

# Health-Check-Route
@app.route('/api/health')
def health_check():
    try:
        # Einfacher Datenbank-Test
        user_count = User.query.count()
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'users': user_count,
            'timestamp': '2025-07-25T12:00:00Z'
        })
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'database': f'error: {str(e)}',
            'timestamp': '2025-07-25T12:00:00Z'
        }), 503

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
    print("🗄️  Datenbank: SQLite (lokal)")
    print("🔑 Test-Zugangsdaten:")
    print("   - test@example.com / test123 (Kostenlos)")
    print("   - premium@example.com / premium123 (Premium)")
    print("   - demo@vape-x.com / demo123 (Demo)")
    
    app.run(debug=True, host='127.0.0.1', port=5000)

