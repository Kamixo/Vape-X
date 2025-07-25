from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app

# Flask-Erweiterungen
db = SQLAlchemy()
cors = CORS()

def create_token(user_id, is_premium=False):
    """JWT Token erstellen"""
    payload = {
        'user_id': user_id,
        'is_premium': is_premium,
        'exp': datetime.utcnow() + timedelta(days=30)
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

def verify_token(token):
    """JWT Token verifizieren"""
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    """Decorator für geschützte Routen"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token fehlt'}), 401
        
        if token.startswith('Bearer '):
            token = token[7:]
        
        payload = verify_token(token)
        if not payload:
            return jsonify({'message': 'Token ungültig'}), 401
        
        request.current_user = payload
        return f(*args, **kwargs)
    return decorated

def premium_required(f):
    """Decorator für Premium-Features"""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not hasattr(request, 'current_user') or not request.current_user.get('is_premium'):
            return jsonify({'message': 'Premium-Account erforderlich'}), 403
        return f(*args, **kwargs)
    return decorated

