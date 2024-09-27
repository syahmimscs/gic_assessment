from ..utils.db import db
import uuid
import random
import string
from sqlalchemy.orm import validates
from ..utils.validators import validate_email, validate_phone, validate_uuid
from datetime import datetime


class Cafe(db.Model):
    __tablename__ = 'cafes'

    # UUID for Cafe ID
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    logo = db.Column(db.LargeBinary, nullable=True)
    employees = db.relationship('Employee', backref='cafe', lazy=True)

    @validates('id')
    def validate_uuid(self, key, id):
        if not validate_uuid(id):
            raise ValueError('Invalid UUID format for cafe ID')
        return id

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'location': self.location,
            'employees_count': len(self.employees)  # Return employee count
        }


class Employee(db.Model):
    __tablename__ = 'employees'

    # Custom alphanumeric ID generation (UIXXXXXXX)
    id = db.Column(db.String(9), primary_key=True, default=lambda: 'UI' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=7)))
    name = db.Column(db.String(100), nullable=False)
    email_address = db.Column(db.String(100), nullable=False, unique=True)
    phone_number = db.Column(db.String(8), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    start_date = db.Column(db.Date, default=datetime.utcnow)
    cafe_id = db.Column(db.String(36), db.ForeignKey('cafes.id'), nullable=False)

    # Email validation
    @validates('email_address')
    def validate_email_address(self, key, email_address):
        if not validate_email(email_address):
            raise ValueError('Invalid email address format')
        return email_address

    # Phone number validation
    @validates('phone_number')
    def validate_phone_number(self, key, phone_number):
        if not validate_phone(phone_number):
            raise ValueError('Phone number must start with 8 or 9 and be 8 digits long')
        return phone_number

    @property
    def days_worked(self):
        return (datetime.utcnow().date() - self.start_date).days

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email_address': self.email_address,
            'phone_number': self.phone_number,
            'gender': self.gender,
            'start_date': str(self.start_date),
            'days_worked': self.days_worked,
            'cafe': self.cafe.name if self.cafe else None
        }