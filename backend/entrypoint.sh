#!/bin/bash

# Start the Flask app in the background
python main.py &

# Wait for the database to be available (adjust sleep time as needed)
sleep 5

# Check if the database is empty and run seeds.py if necessary
python -c "
from app import create_app
from app.models.models import Cafe
from app.utils.db import db

app = create_app()
with app.app_context():
    if not db.session.query(Cafe).first():  # Replace Cafe with the model you want to check
        from seeds import seed_data
        seed_data()
        print('Database seeded.')
    else:
        print('Data already exists, skipping seeding.')
"

# Keep the container running
wait