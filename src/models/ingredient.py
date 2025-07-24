from src.extensions import db
from datetime import datetime

class Ingredient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # 'aroma', 'base', 'nicotine'
    brand = db.Column(db.String(100))
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float)
    quantity = db.Column(db.Float)
    optimal_percentage = db.Column(db.Float)
    pg_percentage = db.Column(db.Float, default=0)
    vg_percentage = db.Column(db.Float, default=0)
    other_percentage = db.Column(db.Float, default=0)
    nicotine_strength = db.Column(db.Float, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Ingredient {self.name} ({self.category})>"

