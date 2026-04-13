from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Room(db.Model):
    """Room model for storing hotel room information"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    room_type = db.Column(db.String(50), nullable=False)  # Single, Double, Deluxe
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    amenities = db.Column(db.Text, nullable=True)  # JSON string of amenities
    max_guests = db.Column(db.Integer, default=2)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with bookings
    bookings = db.relationship('Booking', backref='room', lazy=True)
    
    def to_dict(self):
        """Convert room object to dictionary for JSON response"""
        return {
            'id': self.id,
            'name': self.name,
            'room_type': self.room_type,
            'price': self.price,
            'description': self.description,
            'image_url': self.image_url,
            'amenities': self.amenities.split(',') if self.amenities else [],
            'max_guests': self.max_guests
        }

class Booking(db.Model):
    """Booking model for storing reservation information"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=False)
    check_in = db.Column(db.Date, nullable=False)
    check_out = db.Column(db.Date, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='confirmed')  # confirmed, cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert booking object to dictionary for JSON response"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'room_id': self.room_id,
            'room_name': self.room.name if self.room else None,
            'check_in': self.check_in.strftime('%Y-%m-%d'),
            'check_out': self.check_out.strftime('%Y-%m-%d'),
            'total_price': self.total_price,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
