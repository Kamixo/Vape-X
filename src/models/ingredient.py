from src.extensions import db
from datetime import datetime

class Ingredient(db.Model):
    __tablename__ = 'ingredients'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Grunddaten
    category = db.Column(db.String(50), nullable=False)  # 'aroma', 'base', 'nikotin'
    brand = db.Column(db.String(100), nullable=True)
    name = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=True)
    quantity = db.Column(db.Float, nullable=True)
    
    # Eigenschaften
    optimal_percentage = db.Column(db.Float, nullable=True)  # Optimaler Geschmacksanteil in %
    pg_percentage = db.Column(db.Float, default=0.0)  # PG-Anteil
    vg_percentage = db.Column(db.Float, default=0.0)  # VG-Anteil
    other_percentage = db.Column(db.Float, default=0.0)  # Sonstige Anteile
    nicotine_strength = db.Column(db.Float, nullable=True)  # Nikotinstärke
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Ingredient-Objekt als Dictionary"""
        return {
            'id': self.id,
            'category': self.category,
            'brand': self.brand,
            'name': self.name,
            'price': self.price,
            'quantity': self.quantity,
            'optimal_percentage': self.optimal_percentage,
            'pg_percentage': self.pg_percentage,
            'vg_percentage': self.vg_percentage,
            'other_percentage': self.other_percentage,
            'nicotine_strength': self.nicotine_strength,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    @staticmethod
    def get_suggestions(query, category=None):
        """Autocomplete-Vorschläge für Zutaten"""
        filters = [Ingredient.name.ilike(f'%{query}%')]
        if category:
            filters.append(Ingredient.category == category)
        
        return Ingredient.query.filter(*filters).limit(10).all()
    
    @staticmethod
    def search(query, category=None, brand=None):
        """Erweiterte Suche nach Zutaten"""
        filters = []
        
        if query:
            filters.append(Ingredient.name.ilike(f'%{query}%'))
        if category:
            filters.append(Ingredient.category == category)
        if brand:
            filters.append(Ingredient.brand.ilike(f'%{brand}%'))
        
        return Ingredient.query.filter(*filters).all()

