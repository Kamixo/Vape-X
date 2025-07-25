from flask import Blueprint, request, jsonify
from src.extensions import db, token_required
from src.models.user import User
from src.models.ingredient import Ingredient

ingredient_bp = Blueprint('ingredient', __name__)

@ingredient_bp.route('/ingredients', methods=['GET'])
@token_required
def get_ingredients():
    """Alle Zutaten des Benutzers abrufen"""
    try:
        user_id = request.current_user['user_id']
        
        # Filter-Parameter
        category = request.args.get('category')  # 'aroma', 'base', 'nikotin'
        search = request.args.get('search')
        
        # Query aufbauen
        query = Ingredient.query.filter_by(user_id=user_id)
        
        if category:
            query = query.filter_by(category=category)
        
        if search:
            query = query.filter(Ingredient.name.ilike(f'%{search}%'))
        
        ingredients = query.order_by(Ingredient.name).all()
        
        return jsonify({
            'ingredients': [ing.to_dict() for ing in ingredients]
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Zutaten konnten nicht geladen werden: {str(e)}'}), 500

@ingredient_bp.route('/ingredients', methods=['POST'])
@token_required
def create_ingredient():
    """Neue Zutat erstellen"""
    try:
        user_id = request.current_user['user_id']
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Benutzer nicht gefunden'}), 404
        
        # Limit prüfen
        if not user.can_add_ingredient():
            return jsonify({
                'error': 'Limit erreicht',
                'message': 'Kostenlose Accounts können maximal 5 Zutaten speichern. Upgrade zu Premium für unbegrenzte Zutaten.',
                'upgrade_required': True
            }), 403
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Keine Daten empfangen'}), 400
        
        # Validierung
        required_fields = ['category', 'name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} ist erforderlich'}), 400
        
        if data['category'] not in ['aroma', 'base', 'nikotin']:
            return jsonify({'error': 'Ungültige Kategorie'}), 400
        
        # Neue Zutat erstellen
        ingredient = Ingredient(
            user_id=user_id,
            category=data['category'],
            brand=data.get('brand'),
            name=data['name'],
            price=data.get('price'),
            quantity=data.get('quantity'),
            optimal_percentage=data.get('optimal_percentage'),
            pg_percentage=data.get('pg_percentage', 0.0),
            vg_percentage=data.get('vg_percentage', 0.0),
            other_percentage=data.get('other_percentage', 0.0),
            nicotine_strength=data.get('nicotine_strength')
        )
        
        db.session.add(ingredient)
        db.session.commit()
        
        return jsonify({
            'message': 'Zutat erfolgreich erstellt',
            'ingredient': ingredient.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Zutat konnte nicht erstellt werden: {str(e)}'}), 500

@ingredient_bp.route('/ingredients/<int:ingredient_id>', methods=['PUT'])
@token_required
def update_ingredient(ingredient_id):
    """Zutat aktualisieren"""
    try:
        user_id = request.current_user['user_id']
        
        ingredient = Ingredient.query.filter_by(id=ingredient_id, user_id=user_id).first()
        if not ingredient:
            return jsonify({'error': 'Zutat nicht gefunden'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Keine Daten empfangen'}), 400
        
        # Felder aktualisieren
        updateable_fields = [
            'brand', 'name', 'price', 'quantity', 'optimal_percentage',
            'pg_percentage', 'vg_percentage', 'other_percentage', 'nicotine_strength'
        ]
        
        for field in updateable_fields:
            if field in data:
                setattr(ingredient, field, data[field])
        
        # Kategorie separat behandeln (Validierung)
        if 'category' in data:
            if data['category'] not in ['aroma', 'base', 'nikotin']:
                return jsonify({'error': 'Ungültige Kategorie'}), 400
            ingredient.category = data['category']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Zutat erfolgreich aktualisiert',
            'ingredient': ingredient.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Zutat konnte nicht aktualisiert werden: {str(e)}'}), 500

@ingredient_bp.route('/ingredients/<int:ingredient_id>', methods=['DELETE'])
@token_required
def delete_ingredient(ingredient_id):
    """Zutat löschen"""
    try:
        user_id = request.current_user['user_id']
        
        ingredient = Ingredient.query.filter_by(id=ingredient_id, user_id=user_id).first()
        if not ingredient:
            return jsonify({'error': 'Zutat nicht gefunden'}), 404
        
        db.session.delete(ingredient)
        db.session.commit()
        
        return jsonify({
            'message': 'Zutat erfolgreich gelöscht'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Zutat konnte nicht gelöscht werden: {str(e)}'}), 500

@ingredient_bp.route('/ingredients/suggestions', methods=['GET'])
@token_required
def get_ingredient_suggestions():
    """Autocomplete-Vorschläge für Zutaten"""
    try:
        user_id = request.current_user['user_id']
        query = request.args.get('q', '').strip()
        category = request.args.get('category')
        
        if not query or len(query) < 2:
            return jsonify({'suggestions': []}), 200
        
        # Zuerst eigene Zutaten suchen
        user_ingredients = Ingredient.query.filter_by(user_id=user_id)
        if category:
            user_ingredients = user_ingredients.filter_by(category=category)
        user_ingredients = user_ingredients.filter(
            Ingredient.name.ilike(f'%{query}%')
        ).limit(5).all()
        
        suggestions = []
        for ing in user_ingredients:
            suggestions.append({
                'id': ing.id,
                'name': ing.name,
                'category': ing.category,
                'optimal_percentage': ing.optimal_percentage,
                'is_own': True
            })
        
        return jsonify({
            'suggestions': suggestions
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Vorschläge konnten nicht geladen werden: {str(e)}'}), 500

@ingredient_bp.route('/ingredients/search', methods=['GET'])
@token_required
def search_ingredients():
    """Erweiterte Suche nach Zutaten"""
    try:
        user_id = request.current_user['user_id']
        
        # Suchparameter
        query = request.args.get('q', '').strip()
        category = request.args.get('category')
        brand = request.args.get('brand')
        
        # Eigene Zutaten durchsuchen
        ingredients = Ingredient.search(query, category, brand)
        # Nur eigene Zutaten
        ingredients = [ing for ing in ingredients if ing.user_id == user_id]
        
        return jsonify({
            'ingredients': [ing.to_dict() for ing in ingredients]
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Suche fehlgeschlagen: {str(e)}'}), 500

