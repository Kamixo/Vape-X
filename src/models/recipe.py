from src.extensions import db
from datetime import datetime
import json

class Recipe(db.Model):
    __tablename__ = 'recipes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Grunddaten
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    is_public = db.Column(db.Boolean, default=True)  # Kostenlose User = automatisch öffentlich
    
    # Rezeptdaten
    target_volume = db.Column(db.Float, nullable=False)  # Zielvolumen in ml
    nicotine_base_strength = db.Column(db.Float, nullable=False)  # Nikotinstärke der Basis
    target_nicotine_strength = db.Column(db.Float, nullable=False)  # Gewünschte Nikotinstärke
    
    # Berechnete Werte (JSON)
    calculated_amounts = db.Column(db.Text, nullable=True)  # JSON mit berechneten Mengen
    
    # Statistiken
    views = db.Column(db.Integer, default=0)
    likes = db.Column(db.Integer, default=0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Beziehungen
    ingredients = db.relationship('RecipeIngredient', backref='recipe', lazy=True, cascade='all, delete-orphan')
    votes = db.relationship('Vote', backref='recipe', lazy=True, cascade='all, delete-orphan')
    
    def get_calculated_amounts(self):
        """Berechnete Mengen als Dictionary"""
        if self.calculated_amounts:
            return json.loads(self.calculated_amounts)
        return {}
    
    def set_calculated_amounts(self, amounts):
        """Berechnete Mengen als JSON speichern"""
        self.calculated_amounts = json.dumps(amounts)
    
    def get_average_rating(self):
        """Durchschnittliche Bewertung berechnen"""
        if not self.votes:
            return 0
        total = sum(vote.rating for vote in self.votes if vote.rating)
        return round(total / len([v for v in self.votes if v.rating]), 1)
    
    def get_ingredient_names(self):
        """Namen aller Aromen für Filterung"""
        return [ing.name for ing in self.ingredients if ing.category == 'aroma']
    
    def to_dict(self, include_user=False):
        """Recipe-Objekt als Dictionary"""
        data = {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'is_public': self.is_public,
            'target_volume': self.target_volume,
            'nicotine_base_strength': self.nicotine_base_strength,
            'target_nicotine_strength': self.target_nicotine_strength,
            'calculated_amounts': self.get_calculated_amounts(),
            'ingredients': [ing.to_dict() for ing in self.ingredients],
            'views': self.views,
            'likes': self.likes,
            'average_rating': self.get_average_rating(),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        if include_user and self.user:
            data['user'] = {
                'id': self.user.id,
                'email': self.user.email
            }
        
        return data
    
    @staticmethod
    def generate_name_from_ingredients(ingredients):
        """Automatischen Namen basierend auf Zutaten generieren"""
        aroma_names = [ing['name'] for ing in ingredients if ing.get('category') == 'aroma']
        if not aroma_names:
            return "Neues Rezept"
        
        if len(aroma_names) == 1:
            return f"{aroma_names[0]} Mix"
        elif len(aroma_names) == 2:
            return f"{aroma_names[0]} & {aroma_names[1]}"
        else:
            return f"{aroma_names[0]} & {len(aroma_names)-1} weitere"
    
    @staticmethod
    def search_public(query=None, ingredient_filter=None, sort_by='created_at'):
        """Öffentliche Rezepte suchen und filtern"""
        filters = [Recipe.is_public == True]
        
        if query:
            filters.append(Recipe.name.ilike(f'%{query}%'))
        
        if ingredient_filter:
            # Suche nach Rezepten mit bestimmten Zutaten
            recipe_ids = db.session.query(RecipeIngredient.recipe_id).filter(
                RecipeIngredient.name.ilike(f'%{ingredient_filter}%')
            ).subquery()
            filters.append(Recipe.id.in_(recipe_ids))
        
        query_obj = Recipe.query.filter(*filters)
        
        # Sortierung
        if sort_by == 'likes':
            query_obj = query_obj.order_by(Recipe.likes.desc())
        elif sort_by == 'views':
            query_obj = query_obj.order_by(Recipe.views.desc())
        elif sort_by == 'rating':
            # Komplexere Sortierung nach Bewertung würde SQL-Query benötigen
            query_obj = query_obj.order_by(Recipe.created_at.desc())
        else:
            query_obj = query_obj.order_by(Recipe.created_at.desc())
        
        return query_obj.all()


class RecipeIngredient(db.Model):
    __tablename__ = 'recipe_ingredients'
    
    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable=False)
    
    # Zutat-Daten
    category = db.Column(db.String(50), nullable=False)  # 'aroma', 'base', 'nikotin'
    name = db.Column(db.String(200), nullable=False)
    percentage = db.Column(db.Float, nullable=True)  # Prozentsatz für Aromen
    
    # Referenz zu gespeicherter Zutat (optional)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredients.id'), nullable=True)
    
    def to_dict(self):
        """RecipeIngredient-Objekt als Dictionary"""
        return {
            'id': self.id,
            'category': self.category,
            'name': self.name,
            'percentage': self.percentage,
            'ingredient_id': self.ingredient_id
        }

