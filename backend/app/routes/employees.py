import random
import string
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin  # Import cross_origin decorator
from app.utils.validators import validate_email, validate_phone
from app.models.models import Employee, Cafe
from app.utils.db import db  # Use db.session instead of session
from datetime import datetime

employees_blueprint = Blueprint('employees', __name__)

# Function to generate a unique employee ID
def generate_employee_id():
    prefix = "UI"
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=7))
    return prefix + suffix

# Get all employees or employees by cafe
@employees_blueprint.route('/employees', methods=['GET', 'OPTIONS'])
@cross_origin()  # Enable CORS for this route
def get_employees():
    cafe_name = request.args.get('cafe')
    
    if cafe_name:
        # Fetch the cafe by name
        cafe = db.session.query(Cafe).filter_by(name=cafe_name).first()
        if not cafe:
            return jsonify([]), 404
        
        # Fetch employees who work in the specific cafe, ordered by days worked (start_date ascending)
        employees = db.session.query(Employee).filter_by(cafe_id=cafe.id).order_by(Employee.start_date.asc()).all()
    else:
        # Fetch all employees, ordered by days worked (start_date ascending)
        employees = db.session.query(Employee).order_by(Employee.start_date.asc()).all()
    
    response = [emp.to_dict() for emp in employees]
    return jsonify(response)

# Get individual employee by ID
@employees_blueprint.route('/employee/<id>', methods=['GET', 'OPTIONS'])
@cross_origin()  # Enable CORS for this route
def get_employee(id):
    employee = db.session.query(Employee).filter_by(id=id).first()
    
    if not employee:
        return jsonify({"message": "Employee not found"}), 404
    
    return jsonify(employee.to_dict()), 200

# Create a new employee
@employees_blueprint.route('/employee', methods=['POST', 'OPTIONS'])
@cross_origin()  # Enable CORS for this route
def create_employee():
    data = request.get_json()

    # Validate email and phone
    if not validate_email(data['email_address']):
        return jsonify({"message": "Invalid email format"}), 400

    if not validate_phone(data['phone_number']):
        return jsonify({"message": "Invalid phone number format"}), 400
    
    # Find the cafe by ID
    cafe = db.session.query(Cafe).filter_by(id=data.get('cafe_id')).first()
    if not cafe:
        return jsonify({"message": "Cafe not found"}), 404

    # Generate a unique employee ID in the format UIXXXXXXX
    employee_id = generate_employee_id()
    
    new_employee = Employee(
        id=employee_id,
        name=data['name'],
        email_address=data['email_address'],
        phone_number=data['phone_number'],
        gender=data['gender'],
        start_date=datetime.utcnow(),
        cafe_id=cafe.id
    )
    
    db.session.add(new_employee)
    db.session.commit()
    
    return jsonify(new_employee.to_dict()), 201

@employees_blueprint.route('/employee/<employee_id>', methods=['PUT', 'OPTIONS'])
@cross_origin()  # Enable CORS for this route
def update_employee(employee_id):
    data = request.get_json()
    
    # Find the employee by ID
    employee = db.session.query(Employee).filter_by(id=employee_id).first()
    if not employee:
        return jsonify({"message": "Employee not found"}), 404
    
    # Update employee details with valid fields
    if 'name' in data:
        employee.name = data['name']
    
    if 'email_address' in data and validate_email(data['email_address']):
        employee.email_address = data['email_address']
    
    if 'phone_number' in data and validate_phone(data['phone_number']):
        employee.phone_number = data['phone_number']
    
    if 'gender' in data:
        employee.gender = data['gender']
    
    if 'cafe_id' in data:
        # Find the cafe by ID
        cafe = db.session.query(Cafe).filter_by(id=data['cafe_id']).first()
        if cafe:
            employee.cafe_id = cafe.id
    
    try:
        db.session.commit()
        return jsonify(employee.to_dict()), 200
    except Exception as e:
        db.session.rollback()  # Rollback in case of an error
        return jsonify({"message": f"Error updating employee: {str(e)}"}), 500

# Delete an employee
@employees_blueprint.route('/employee/<id>', methods=['DELETE', 'OPTIONS'])
@cross_origin()  # Enable CORS for this route
def delete_employee(id):
    employee = db.session.query(Employee).filter_by(id=id).first()
    
    if not employee:
        return jsonify({"message": "Employee not found"}), 404
    
    db.session.delete(employee)
    db.session.commit()
    
    return jsonify({"message": "Employee deleted"}), 200