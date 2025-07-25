from src.extensions import db
from datetime import datetime

class Vote(db.Model):
    __tablename__ = 'votes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable=False)
    
    # Vote-Daten
    is_like = db.Column(db.Boolean, nullable=True)  # True = Like, False = Dislike, None = nur Rating
    rating = db.Column(db.Integer, nullable=True)  # 1-5 Sterne
    comment = db.Column(db.Text, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Unique constraint: Ein User kann nur einmal pro Rezept voten
    __table_args__ = (db.UniqueConstraint('user_id', 'recipe_id', name='unique_user_recipe_vote'),)
    
    def to_dict(self):
        """Vote-Objekt als Dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'recipe_id': self.recipe_id,
            'is_like': self.is_like,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    @staticmethod
    def get_user_vote(user_id, recipe_id):
        """Vote eines Users für ein bestimmtes Rezept abrufen"""
        return Vote.query.filter_by(user_id=user_id, recipe_id=recipe_id).first()
    
    @staticmethod
    def toggle_like(user_id, recipe_id):
        """Like/Unlike für ein Rezept"""
        vote = Vote.get_user_vote(user_id, recipe_id)
        
        if vote:
            if vote.is_like:
                # Bereits geliked -> Unlike
                vote.is_like = None
            else:
                # Nicht geliked oder disliked -> Like
                vote.is_like = True
        else:
            # Neuer Vote
            vote = Vote(user_id=user_id, recipe_id=recipe_id, is_like=True)
            db.session.add(vote)
        
        db.session.commit()
        
        # Likes im Recipe-Model aktualisieren
        from src.models.recipe import Recipe
        recipe = Recipe.query.get(recipe_id)
        if recipe:
            recipe.likes = Vote.query.filter_by(recipe_id=recipe_id, is_like=True).count()
            db.session.commit()
        
        return vote
    
    @staticmethod
    def set_rating(user_id, recipe_id, rating, comment=None):
        """Bewertung für ein Rezept setzen"""
        if rating < 1 or rating > 5:
            raise ValueError("Rating muss zwischen 1 und 5 liegen")
        
        vote = Vote.get_user_vote(user_id, recipe_id)
        
        if vote:
            vote.rating = rating
            vote.comment = comment
        else:
            vote = Vote(user_id=user_id, recipe_id=recipe_id, rating=rating, comment=comment)
            db.session.add(vote)
        
        db.session.commit()
        return vote

