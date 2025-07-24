from flask import Flask, send_from_directory
from flask_cors import CORS
from src.extensions import db
import os

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app) # Enable CORS for all routes

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://XDampfer2Go:fjx0feox4w25jb97qWj56@r12.hallo.cloud:3306/vapex'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)

# Import models after db initialization
from src.models.user import User
from src.models.ingredient import Ingredient
from src.models.recipe import Recipe, RecipeIngredient
from src.models.vote import Vote

# Serve static files (your frontend)
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

# Define a simple test route
@app.route('/api/test')
def test_api():
    return {'message': 'API is working!'}

# Register blueprints
from src.routes.user import user_bp
app.register_blueprint(user_bp, url_prefix='/api/user')

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Create database tables based on models
    app.run(debug=True, host='0.0.0.0', port=5000)

