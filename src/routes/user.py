from flask import Blueprint, request, jsonify
from src.extensions import db, create_token, token_required
from src.models.user import User
from werkzeug.security import check_password_hash
import re

user_bp = Blueprint("user_bp", __name__)

def validate_email(email):
    """E-Mail-Adresse validieren"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@user_bp.route('/user/register', methods=['POST'])
def register():
    """Benutzer registrieren"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Keine Daten empfangen'}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        # Validierung
        if not email or not password:
            return jsonify({'error': 'E-Mail und Passwort sind erforderlich'}), 400
        
        if not validate_email(email):
            return jsonify({'error': 'Ungültige E-Mail-Adresse'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'Passwort muss mindestens 6 Zeichen lang sein'}), 400
        
        # Prüfen ob E-Mail bereits existiert
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'E-Mail-Adresse bereits registriert'}), 409
        
        # Neuen Benutzer erstellen
        user = User(email=email)
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Token erstellen
        token = create_token(user.id, user.is_premium)
        
        return jsonify({
            'message': 'Registrierung erfolgreich',
            'token': token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Registrierung fehlgeschlagen: {str(e)}'}), 500

@user_bp.route('/user/login', methods=['POST'])
def login():
    """Benutzer anmelden"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Keine Daten empfangen'}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'error': 'E-Mail und Passwort sind erforderlich'}), 400
        
        # Benutzer suchen
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Ungültige Anmeldedaten'}), 401
        
        # Token erstellen
        token = create_token(user.id, user.is_premium)
        
        return jsonify({
            'message': 'Anmeldung erfolgreich',
            'token': token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Anmeldung fehlgeschlagen: {str(e)}'}), 500

@user_bp.route('/user/profile', methods=['GET'])
@token_required
def get_profile():
    """Benutzerprofil abrufen"""
    try:
        user = User.query.get(request.current_user['user_id'])
        if not user:
            return jsonify({'error': 'Benutzer nicht gefunden'}), 404
        
        return jsonify({
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Profil konnte nicht geladen werden: {str(e)}'}), 500

@user_bp.route('/user/upgrade', methods=['POST'])
@token_required
def upgrade_to_premium():
    """Benutzer zu Premium upgraden (PayPal-Simulation)"""
    try:
        data = request.get_json()
        payment_id = data.get('payment_id')  # PayPal Payment ID
        
        if not payment_id:
            return jsonify({'error': 'Payment ID erforderlich'}), 400
        
        user = User.query.get(request.current_user['user_id'])
        if not user:
            return jsonify({'error': 'Benutzer nicht gefunden'}), 404
        
        # TODO: Hier würde die echte PayPal-Verifikation stattfinden
        # Für jetzt simulieren wir eine erfolgreiche Zahlung
        
        user.is_premium = True
        # user.premium_expires = datetime.utcnow() + timedelta(days=365)  # 1 Jahr
        
        db.session.commit()
        
        # Neuen Token mit Premium-Status erstellen
        token = create_token(user.id, user.is_premium)
        
        return jsonify({
            'message': 'Upgrade zu Premium erfolgreich',
            'token': token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Upgrade fehlgeschlagen: {str(e)}'}), 500

@user_bp.route('/user/stats', methods=['GET'])
@token_required
def get_user_stats():
    """Benutzerstatistiken abrufen"""
    try:
        user = User.query.get(request.current_user['user_id'])
        if not user:
            return jsonify({'error': 'Benutzer nicht gefunden'}), 404
        
        # Zusätzliche Statistiken
        public_recipes = len([r for r in user.recipes if r.is_public])
        private_recipes = len([r for r in user.recipes if not r.is_public])
        total_views = sum(r.views for r in user.recipes)
        total_likes = sum(r.likes for r in user.recipes)
        
        return jsonify({
            'ingredient_count': user.get_ingredient_count(),
            'recipe_count': user.get_recipe_count(),
            'public_recipes': public_recipes,
            'private_recipes': private_recipes,
            'total_views': total_views,
            'total_likes': total_likes,
            'can_add_ingredient': user.can_add_ingredient(),
            'can_add_recipe': user.can_add_recipe(),
            'is_premium': user.is_premium
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Statistiken konnten nicht geladen werden: {str(e)}'}), 500

