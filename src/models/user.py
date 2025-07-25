from src.extensions import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_premium = db.Column(db.Boolean, default=False)
    premium_expires = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Beziehungen
    ingredients = db.relationship('Ingredient', backref='user', lazy=True, cascade='all, delete-orphan')
    recipes = db.relationship('Recipe', backref='user', lazy=True, cascade='all, delete-orphan')
    votes = db.relationship('Vote', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Passwort hashen und speichern"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Passwort überprüfen"""
        return check_password_hash(self.password_hash, password)
    
    def get_ingredient_count(self):
        """Anzahl der Zutaten des Benutzers"""
        return len(self.ingredients)
    
    def get_recipe_count(self):
        """Anzahl der Rezepte des Benutzers"""
        return len(self.recipes)
    
    def can_add_ingredient(self):
        """Prüfen ob Benutzer weitere Zutaten hinzufügen kann"""
        if self.is_premium:
            return True
        return self.get_ingredient_count() < 5
    
    def can_add_recipe(self):
        """Prüfen ob Benutzer weitere Rezepte hinzufügen kann"""
        if self.is_premium:
            return True
        return self.get_recipe_count() < 3
    
    def to_dict(self):
        """User-Objekt als Dictionary"""
        return {
            'id': self.id,
            'email': self.email,
            'is_premium': self.is_premium,
            'premium_expires': self.premium_expires.isoformat() if self.premium_expires else None,
            'ingredient_count': self.get_ingredient_count(),
            'recipe_count': self.get_recipe_count(),
            'can_add_ingredient': self.can_add_ingredient(),
            'can_add_recipe': self.can_add_recipe(),
            'created_at': self.created_at.isoformat()
        }

