from flask import Flask
from app.config import Config
from app.utils.db import init_db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize the database
    init_db(app)

    # Import and register blueprints after app is created to avoid circular imports
    from app.routes.cafes import cafes_blueprint
    from app.routes.employees import employees_blueprint

    app.register_blueprint(cafes_blueprint)
    app.register_blueprint(employees_blueprint)

    return app