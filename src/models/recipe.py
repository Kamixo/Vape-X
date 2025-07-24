from src.extensions import db
from datetime import datetime

class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    target_volume = db.Column(db.Float, nullable=False)
    base_nicotine_strength = db.Column(db.Float, nullable=False)
    target_nicotine_strength = db.Column(db.Float, nullable=False)
    is_public = db.Column(db.Boolean, default=False)  # True for free users, False for premium (unless shared)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    recipe_ingredients = db.relationship("RecipeIngredient", backref="recipe", lazy=True, cascade="all, delete-orphan")
    votes = db.relationship("Vote", backref="recipe", lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Recipe {self.name}>"

class RecipeIngredient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)
    ingredient_name = db.Column(db.String(100), nullable=False)
    percentage = db.Column(db.Float, nullable=False)
    ingredient_type = db.Column(db.String(50), nullable=False)  # 'aroma', 'base', 'nicotine'

    def __repr__(self):
        return f"<RecipeIngredient {self.ingredient_name} ({self.percentage}%)>"

