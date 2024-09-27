import base64
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from app.models.models import Cafe, Employee
from app.utils.db import db

cafes_blueprint = Blueprint('cafes', __name__)

# Helper function to convert image file to binary data
def image_to_binary(image_file):
    return image_file.read()

# Helper function to convert binary data to base64 string
def binary_to_base64(binary_data):
    if binary_data:
        return base64.b64encode(binary_data).decode('utf-8')
    return None

# Create a new cafe
@cafes_blueprint.route('/cafe', methods=['POST', 'OPTIONS'])
@cross_origin()
def create_cafe():
    data = request.form
    file = request.files.get('logo')  # Get the uploaded image file

    # Validate required fields
    if not all(field in data for field in ['name', 'description', 'location']):
        return jsonify({"message": "Missing required fields"}), 400

    # Convert the uploaded image to binary if a file is provided
    logo_binary = image_to_binary(file) if file else None

    new_cafe = Cafe(
        name=data['name'],
        description=data['description'],
        location=data['location'],
        logo=logo_binary  # Store binary image data
    )

    db.session.add(new_cafe)
    db.session.commit()

    return jsonify(new_cafe.to_dict()), 201


# Update cafe details
@cafes_blueprint.route('/cafe', methods=['PUT', 'OPTIONS'])
@cross_origin()
def update_cafe():
    data = request.form  # Get form data since file uploads are involved
    file = request.files.get('logo')  # Get the file if updated

    # Validate that the ID is provided
    if 'id' not in data:
        return jsonify({"message": "Cafe ID is required"}), 400

    cafe = db.session.query(Cafe).filter_by(id=data['id']).first()

    if not cafe:
        return jsonify({'message': 'Cafe not found'}), 404

    # Update only allowed fields
    if 'name' in data:
        cafe.name = data['name']
    if 'description' in data:
        cafe.description = data['description']
    if 'location' in data:
        cafe.location = data['location']

    # Handle file update if a new one is provided
    if file:
        logo_binary = image_to_binary(file)  # Store the image as binary data
        cafe.logo = logo_binary  # Update the logo binary data

    db.session.commit()

    return jsonify(cafe.to_dict()), 200


# Get cafes (with binary logo converted to base64 for frontend display)
@cafes_blueprint.route('/cafes', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_cafes():
    location = request.args.get('location')

    query = db.session.query(Cafe, db.func.count(Employee.id).label('employee_count')).join(Employee, Cafe.id == Employee.cafe_id, isouter=True).group_by(Cafe.id)

    if location:
        query = query.filter(Cafe.location == location)

    cafes = query.order_by(db.desc('employee_count')).all()
    response = []

    for cafe, employee_count in cafes:
        cafe_data = cafe.to_dict()
        cafe_data['employees'] = employee_count
        cafe_data['logo'] = binary_to_base64(cafe.logo)  # Convert binary data to base64
        response.append(cafe_data)

    return jsonify(response), 200


# Get a specific cafe by ID
@cafes_blueprint.route('/cafe/<id>', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_cafe(id):
    cafe = db.session.query(Cafe, db.func.count(Employee.id).label('employee_count')).join(Employee, Cafe.id == Employee.cafe_id, isouter=True).filter(Cafe.id == id).group_by(Cafe.id).first()

    if cafe:
        cafe_data = cafe[0].to_dict()
        cafe_data['employees'] = cafe[1]  # employee_count
        cafe_data['logo'] = binary_to_base64(cafe[0].logo)  # Convert binary data to base64
        return jsonify(cafe_data), 200

    return jsonify({'message': 'Cafe not found'}), 404


@cafes_blueprint.route('/cafe/<id>', methods=['DELETE', 'OPTIONS'])
@cross_origin()
def delete_cafe(id):
    cafe = db.session.query(Cafe).filter_by(id=id).first()
    if cafe:
        # Delete all employees under this cafe
        db.session.query(Employee).filter_by(cafe_id=cafe.id).delete()

        # Delete the cafe itself
        db.session.delete(cafe)
        db.session.commit()
        return jsonify({'message': 'Cafe and all associated employees deleted'}), 200
    return jsonify({'message': 'Cafe not found'}), 404