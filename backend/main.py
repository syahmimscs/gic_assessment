from flask import Flask
from flask_cors import CORS  # Import Flask-CORS
from app.utils.db import init_db
from app.routes.cafes import cafes_blueprint
from app.routes.employees import employees_blueprint
from app.config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Apply CORS to all routes
CORS(app)

# Initialize the database
init_db(app)

# Register blueprints after CORS is applied
app.register_blueprint(cafes_blueprint)
app.register_blueprint(employees_blueprint)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5001)