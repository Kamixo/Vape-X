from flask import Blueprint, request, jsonify
from src.extensions import db, token_required
from src.models.user import User
from src.models.recipe import Recipe, RecipeIngredient
from src.models.ingredient import Ingredient

recipe_bp = Blueprint('recipe', __name__)

@recipe_bp.route('/recipes', methods=['GET'])
@token_required
def get_recipes():
    """Alle Rezepte des Benutzers abrufen"""
    try:
        user_id = request.current_user['user_id']
        
        recipes = Recipe.query.filter_by(user_id=user_id).order_by(Recipe.created_at.desc()).all()
        
        return jsonify({
            'recipes': [recipe.to_dict() for recipe in recipes]
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Rezepte konnten nicht geladen werden: {str(e)}'}), 500

@recipe_bp.route('/recipes', methods=['POST'])
@token_required
def create_recipe():
    """Neues Rezept erstellen"""
    try:
        user_id = request.current_user['user_id']
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Benutzer nicht gefunden'}), 404
        
        # Limit prüfen
        if not user.can_add_recipe():
            return jsonify({
                'error': 'Limit erreicht',
                'message': 'Kostenlose Accounts können maximal 3 Rezepte speichern. Upgrade zu Premium für unbegrenzte Rezepte.',
                'upgrade_required': True
            }), 403
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Keine Daten empfangen'}), 400
        
        # Validierung
        required_fields = ['target_volume', 'nicotine_base_strength', 'target_nicotine_strength', 'ingredients']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} ist erforderlich'}), 400
        
        ingredients = data['ingredients']
        if not ingredients or not isinstance(ingredients, list):
            return jsonify({'error': 'Mindestens eine Zutat ist erforderlich'}), 400
        
        # Name generieren falls nicht vorhanden
        name = data.get('name')
        if not name or name.strip() == '':
            name = Recipe.generate_name_from_ingredients(ingredients)
        
        # Prüfen ob Name bereits existiert
        existing_recipe = Recipe.query.filter_by(user_id=user_id, name=name).first()
        if existing_recipe:
            # Nummer anhängen
            counter = 2
            original_name = name
            while existing_recipe:
                name = f"{original_name} ({counter})"
                existing_recipe = Recipe.query.filter_by(user_id=user_id, name=name).first()
                counter += 1
        
        # Öffentlich/Privat Status
        # Kostenlose Benutzer: automatisch öffentlich
        # Premium Benutzer: können wählen
        if user.is_premium:
            is_public = data.get('is_public', True)
        else:
            is_public = True  # Kostenlose Benutzer = immer öffentlich
        
        # Neues Rezept erstellen
        recipe = Recipe(
            user_id=user_id,
            name=name,
            description=data.get('description', ''),
            is_public=is_public,
            target_volume=data['target_volume'],
            nicotine_base_strength=data['nicotine_base_strength'],
            target_nicotine_strength=data['target_nicotine_strength']
        )
        
        # Berechnete Mengen speichern
        if 'calculated_amounts' in data:
            recipe.set_calculated_amounts(data['calculated_amounts'])
        
        db.session.add(recipe)
        db.session.flush()  # Um recipe.id zu bekommen
        
        # Zutaten hinzufügen
        for ing_data in ingredients:
            recipe_ingredient = RecipeIngredient(
                recipe_id=recipe.id,
                category=ing_data.get('category', 'aroma'),
                name=ing_data['name'],
                percentage=ing_data.get('percentage'),
                ingredient_id=ing_data.get('ingredient_id')
            )
            db.session.add(recipe_ingredient)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Rezept erfolgreich erstellt',
            'recipe': recipe.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Rezept konnte nicht erstellt werden: {str(e)}'}), 500

@recipe_bp.route('/recipes/<int:recipe_id>', methods=['PUT'])
@token_required
def update_recipe(recipe_id):
    """Rezept aktualisieren"""
    try:
        user_id = request.current_user['user_id']
        
        recipe = Recipe.query.filter_by(id=recipe_id, user_id=user_id).first()
        if not recipe:
            return jsonify({'error': 'Rezept nicht gefunden'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Keine Daten empfangen'}), 400
        
        # Felder aktualisieren
        if 'name' in data:
            recipe.name = data['name']
        if 'description' in data:
            recipe.description = data['description']
        if 'target_volume' in data:
            recipe.target_volume = data['target_volume']
        if 'nicotine_base_strength' in data:
            recipe.nicotine_base_strength = data['nicotine_base_strength']
        if 'target_nicotine_strength' in data:
            recipe.target_nicotine_strength = data['target_nicotine_strength']
        if 'calculated_amounts' in data:
            recipe.set_calculated_amounts(data['calculated_amounts'])
        
        # Öffentlich/Privat Status (nur für Premium-Benutzer)
        user = User.query.get(user_id)
        if user and user.is_premium and 'is_public' in data:
            recipe.is_public = data['is_public']
        
        # Zutaten aktualisieren
        if 'ingredients' in data:
            # Alte Zutaten löschen
            RecipeIngredient.query.filter_by(recipe_id=recipe.id).delete()
            
            # Neue Zutaten hinzufügen
            for ing_data in data['ingredients']:
                recipe_ingredient = RecipeIngredient(
                    recipe_id=recipe.id,
                    category=ing_data.get('category', 'aroma'),
                    name=ing_data['name'],
                    percentage=ing_data.get('percentage'),
                    ingredient_id=ing_data.get('ingredient_id')
                )
                db.session.add(recipe_ingredient)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Rezept erfolgreich aktualisiert',
            'recipe': recipe.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Rezept konnte nicht aktualisiert werden: {str(e)}'}), 500

@recipe_bp.route('/recipes/<int:recipe_id>', methods=['DELETE'])
@token_required
def delete_recipe(recipe_id):
    """Rezept löschen"""
    try:
        user_id = request.current_user['user_id']
        
        recipe = Recipe.query.filter_by(id=recipe_id, user_id=user_id).first()
        if not recipe:
            return jsonify({'error': 'Rezept nicht gefunden'}), 404
        
        db.session.delete(recipe)
        db.session.commit()
        
        return jsonify({
            'message': 'Rezept erfolgreich gelöscht'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Rezept konnte nicht gelöscht werden: {str(e)}'}), 500

@recipe_bp.route('/recipes/<int:recipe_id>/duplicate', methods=['POST'])
@token_required
def duplicate_recipe(recipe_id):
    """Rezept duplizieren"""
    try:
        user_id = request.current_user['user_id']
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Benutzer nicht gefunden'}), 404
        
        # Limit prüfen
        if not user.can_add_recipe():
            return jsonify({
                'error': 'Limit erreicht',
                'message': 'Kostenlose Accounts können maximal 3 Rezepte speichern. Upgrade zu Premium für unbegrenzte Rezepte.',
                'upgrade_required': True
            }), 403
        
        # Original-Rezept finden (kann auch von anderen Benutzern sein, wenn öffentlich)
        original = Recipe.query.get(recipe_id)
        if not original:
            return jsonify({'error': 'Rezept nicht gefunden'}), 404
        
        # Zugriff prüfen
        if not original.is_public and original.user_id != user_id:
            return jsonify({'error': 'Zugriff verweigert'}), 403
        
        data = request.get_json() or {}
        new_name = data.get('name', f"{original.name} (Kopie)")
        
        # Prüfen ob Name bereits existiert
        existing_recipe = Recipe.query.filter_by(user_id=user_id, name=new_name).first()
        if existing_recipe:
            counter = 2
            original_name = new_name
            while existing_recipe:
                new_name = f"{original_name} ({counter})"
                existing_recipe = Recipe.query.filter_by(user_id=user_id, name=new_name).first()
                counter += 1
        
        # Neues Rezept erstellen
        new_recipe = Recipe(
            user_id=user_id,
            name=new_name,
            description=original.description,
            is_public=True if not user.is_premium else data.get('is_public', True),
            target_volume=original.target_volume,
            nicotine_base_strength=original.nicotine_base_strength,
            target_nicotine_strength=original.target_nicotine_strength
        )
        
        new_recipe.set_calculated_amounts(original.get_calculated_amounts())
        
        db.session.add(new_recipe)
        db.session.flush()
        
        # Zutaten kopieren
        for ing in original.ingredients:
            new_ingredient = RecipeIngredient(
                recipe_id=new_recipe.id,
                category=ing.category,
                name=ing.name,
                percentage=ing.percentage,
                ingredient_id=ing.ingredient_id
            )
            db.session.add(new_ingredient)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Rezept erfolgreich dupliziert',
            'recipe': new_recipe.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Rezept konnte nicht dupliziert werden: {str(e)}'}), 500

@recipe_bp.route('/recipes/public', methods=['GET'])
def get_public_recipes():
    """Öffentliche Rezepte abrufen (ohne Authentifizierung)"""
    try:
        # Suchparameter
        query = request.args.get('q', '').strip()
        ingredient_filter = request.args.get('ingredient')
        sort_by = request.args.get('sort', 'created_at')  # created_at, likes, views, rating
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        # Öffentliche Rezepte suchen
        recipes = Recipe.search_public(query, ingredient_filter, sort_by)
        
        # Paginierung
        start = (page - 1) * per_page
        end = start + per_page
        paginated_recipes = recipes[start:end]
        
        return jsonify({
            'recipes': [recipe.to_dict(include_user=True) for recipe in paginated_recipes],
            'total': len(recipes),
            'page': page,
            'per_page': per_page,
            'has_next': end < len(recipes),
            'has_prev': page > 1
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Öffentliche Rezepte konnten nicht geladen werden: {str(e)}'}), 500

@recipe_bp.route('/recipes/<int:recipe_id>/view', methods=['POST'])
def increment_recipe_views(recipe_id):
    """View-Counter für Rezept erhöhen"""
    try:
        recipe = Recipe.query.get(recipe_id)
        if not recipe or not recipe.is_public:
            return jsonify({'error': 'Rezept nicht gefunden'}), 404
        
        recipe.views += 1
        db.session.commit()
        
        return jsonify({
            'message': 'View registriert',
            'views': recipe.views
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'View konnte nicht registriert werden: {str(e)}'}), 500

