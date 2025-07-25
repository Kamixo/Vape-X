from flask import Blueprint, request, jsonify
from src.extensions import db, token_required
from src.models.vote import Vote
from src.models.recipe import Recipe

vote_bp = Blueprint('vote', __name__)

@vote_bp.route('/recipes/<int:recipe_id>/like', methods=['POST'])
@token_required
def toggle_like(recipe_id):
    """Like/Unlike für ein Rezept"""
    try:
        user_id = request.current_user['user_id']
        
        # Rezept prüfen
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return jsonify({'error': 'Rezept nicht gefunden'}), 404
        
        if not recipe.is_public and recipe.user_id != user_id:
            return jsonify({'error': 'Zugriff verweigert'}), 403
        
        # Like toggle
        vote = Vote.toggle_like(user_id, recipe_id)
        
        # Aktualisierte Daten zurückgeben
        recipe = Recipe.query.get(recipe_id)  # Neu laden für aktuelle Likes
        
        return jsonify({
            'message': 'Like-Status aktualisiert',
            'is_liked': vote.is_like,
            'total_likes': recipe.likes,
            'vote': vote.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Like konnte nicht verarbeitet werden: {str(e)}'}), 500

@vote_bp.route('/recipes/<int:recipe_id>/rating', methods=['POST'])
@token_required
def set_rating(recipe_id):
    """Bewertung für ein Rezept setzen"""
    try:
        user_id = request.current_user['user_id']
        
        # Rezept prüfen
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return jsonify({'error': 'Rezept nicht gefunden'}), 404
        
        if not recipe.is_public and recipe.user_id != user_id:
            return jsonify({'error': 'Zugriff verweigert'}), 403
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Keine Daten empfangen'}), 400
        
        rating = data.get('rating')
        comment = data.get('comment', '').strip()
        
        if not rating or not isinstance(rating, int) or rating < 1 or rating > 5:
            return jsonify({'error': 'Rating muss eine Zahl zwischen 1 und 5 sein'}), 400
        
        # Bewertung setzen
        vote = Vote.set_rating(user_id, recipe_id, rating, comment if comment else None)
        
        # Aktualisierte Daten zurückgeben
        recipe = Recipe.query.get(recipe_id)  # Neu laden
        
        return jsonify({
            'message': 'Bewertung erfolgreich gespeichert',
            'vote': vote.to_dict(),
            'average_rating': recipe.get_average_rating()
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Bewertung konnte nicht gespeichert werden: {str(e)}'}), 500

@vote_bp.route('/recipes/<int:recipe_id>/votes', methods=['GET'])
def get_recipe_votes(recipe_id):
    """Alle Bewertungen für ein Rezept abrufen"""
    try:
        # Rezept prüfen
        recipe = Recipe.query.get(recipe_id)
        if not recipe or not recipe.is_public:
            return jsonify({'error': 'Rezept nicht gefunden'}), 404
        
        # Nur Bewertungen mit Kommentaren oder Ratings
        votes = Vote.query.filter_by(recipe_id=recipe_id).filter(
            (Vote.rating.isnot(None)) | (Vote.comment.isnot(None))
        ).order_by(Vote.created_at.desc()).all()
        
        return jsonify({
            'votes': [vote.to_dict() for vote in votes],
            'total_votes': len(votes),
            'average_rating': recipe.get_average_rating(),
            'total_likes': recipe.likes
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Bewertungen konnten nicht geladen werden: {str(e)}'}), 500

@vote_bp.route('/recipes/<int:recipe_id>/my-vote', methods=['GET'])
@token_required
def get_my_vote(recipe_id):
    """Eigene Bewertung für ein Rezept abrufen"""
    try:
        user_id = request.current_user['user_id']
        
        # Rezept prüfen
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return jsonify({'error': 'Rezept nicht gefunden'}), 404
        
        if not recipe.is_public and recipe.user_id != user_id:
            return jsonify({'error': 'Zugriff verweigert'}), 403
        
        vote = Vote.get_user_vote(user_id, recipe_id)
        
        if vote:
            return jsonify({
                'vote': vote.to_dict()
            }), 200
        else:
            return jsonify({
                'vote': None
            }), 200
        
    except Exception as e:
        return jsonify({'error': f'Bewertung konnte nicht geladen werden: {str(e)}'}), 500

@vote_bp.route('/votes/<int:vote_id>', methods=['DELETE'])
@token_required
def delete_vote(vote_id):
    """Eigene Bewertung löschen"""
    try:
        user_id = request.current_user['user_id']
        
        vote = Vote.query.filter_by(id=vote_id, user_id=user_id).first()
        if not vote:
            return jsonify({'error': 'Bewertung nicht gefunden'}), 404
        
        recipe_id = vote.recipe_id
        
        db.session.delete(vote)
        db.session.commit()
        
        # Likes im Recipe-Model aktualisieren
        recipe = Recipe.query.get(recipe_id)
        if recipe:
            recipe.likes = Vote.query.filter_by(recipe_id=recipe_id, is_like=True).count()
            db.session.commit()
        
        return jsonify({
            'message': 'Bewertung erfolgreich gelöscht'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Bewertung konnte nicht gelöscht werden: {str(e)}'}), 500

