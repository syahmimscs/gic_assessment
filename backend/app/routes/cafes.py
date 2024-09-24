from flask import Blueprint, jsonify, request
from flask_cors import cross_origin  # Import cross_origin decorator
from app.models.models import Cafe, Employee
from app.utils.db import db

cafes_blueprint = Blueprint('cafes', __name__)

# Get cafes by location or all cafes, sorted by the highest number of employees
@cafes_blueprint.route('/cafes', methods=['GET', 'OPTIONS'])
@cross_origin()  # Enable CORS for this route
def get_cafes():
    location = request.args.get('location')

    # Base query
    query = db.session.query(Cafe, db.func.count(Employee.id).label('employee_count')).join(Employee, Cafe.id == Employee.cafe_id, isouter=True).group_by(Cafe.id)

    # Filter by location if provided
    if location:
        query = query.filter(Cafe.location == location)

    # Sort by employee count in descending order
    cafes = query.order_by(db.desc('employee_count')).all()

    # Build the response with employee count
    response = []
    for cafe, employee_count in cafes:
        cafe_data = cafe.to_dict()
        cafe_data['employees'] = employee_count
        response.append(cafe_data)

    return jsonify(response), 200

# Create a new cafe
@cafes_blueprint.route('/cafe', methods=['POST', 'OPTIONS'])
@cross_origin()  # Enable CORS for this route
def create_cafe():
    data = request.get_json()

    # Validate required fields
    if not all(field in data for field in ['name', 'description', 'location']):
        return jsonify({"message": "Missing required fields"}), 400

    new_cafe = Cafe(
        name=data['name'],
        description=data['description'],
        location=data['location'],
        logo=data.get('logo', None)  # Optional field
    )
    db.session.add(new_cafe)
    db.session.commit()
    return jsonify(new_cafe.to_dict()), 201

# Update cafe details
@cafes_blueprint.route('/cafe', methods=['PUT', 'OPTIONS'])
@cross_origin()  # Enable CORS for this route
def update_cafe():
    data = request.get_json()

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
    if 'logo' in data:
        cafe.logo = data['logo']

    db.session.commit()
    return jsonify(cafe.to_dict()), 200

# Get a specific cafe by ID
@cafes_blueprint.route('/cafe/<id>', methods=['GET', 'OPTIONS'])
@cross_origin()  # Enable CORS for this route
def get_cafe(id):
    cafe = db.session.query(Cafe, db.func.count(Employee.id).label('employee_count')).join(Employee, Cafe.id == Employee.cafe_id, isouter=True).filter(Cafe.id == id).group_by(Cafe.id).first()

    if cafe:
        cafe_data = cafe[0].to_dict()  # Cafe is a tuple
        cafe_data['employees'] = cafe[1]  # employee_count
        return jsonify(cafe_data), 200

    return jsonify({'message': 'Cafe not found'}), 404

# Delete a cafe and all employees under the cafe
@cafes_blueprint.route('/cafe/<id>', methods=['DELETE', 'OPTIONS'])
@cross_origin()  # Enable CORS for this route
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