from app.utils.db import db
from app.models.models import Cafe, Employee
from datetime import datetime
import random
import string
import uuid

# Function to generate Employee ID in the format UIXXXXXXX
def generate_employee_id():
    return 'UI' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=7))

# Function to generate random phone numbers starting with 8 or 9
def generate_phone_number():
    return random.choice(['8', '9']) + ''.join(random.choices(string.digits, k=7))

def seed_data():
    # Seed 10 cafes
    cafes = []
    for i in range(10):
        cafes.append(
            Cafe(
                id=str(uuid.uuid4()), 
                name=f"Cafe {i+1}", 
                description=f"A cozy place to have coffee {i+1}", 
                location=random.choice(["New York", "San Francisco", "Los Angeles", "Chicago", "Miami"]),
                logo=f"https://example.com/logo{i+1}.png"
            )
        )

    # Seed 10 employees
    employees = []
    for i in range(10):
        employees.append(
            Employee(
                id=generate_employee_id(),
                name=f"Employee {i+1}",
                email_address=f"employee{i+1}@example.com",
                phone_number=generate_phone_number(),
                gender=random.choice(["Male", "Female"]),
                start_date=datetime.utcnow(),
                cafe_id=random.choice(cafes).id  # Assign employees to random cafes
            )
        )

    # Bulk save cafes and employees
    db.session.bulk_save_objects(cafes)
    db.session.bulk_save_objects(employees)
    db.session.commit()

if __name__ == "__main__":
    from app import create_app
    app = create_app()
    with app.app_context():
        seed_data()