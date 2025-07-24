from src.extensions import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_premium = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    recipes = db.relationship("Recipe", backref="user", lazy=True)
    ingredients = db.relationship("Ingredient", backref="user", lazy=True)
    votes = db.relationship("Vote", backref="user", lazy=True)

    def __repr__(self):
        return f"<User {self.username}>"

