from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from models import db, Room, Booking
from datetime import datetime, timedelta
import os

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-here-change-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hotel_booking.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

@app.route('/')
def home():
    """Home page with hero section and featured rooms"""
    featured_rooms = Room.query.limit(3).all()
    return render_template('index.html', featured_rooms=featured_rooms)

@app.route('/rooms')
def rooms():
    """Rooms page displaying all available rooms"""
    return render_template('rooms.html')

@app.route('/api/rooms')
def api_rooms():
    """API endpoint to get all rooms as JSON"""
    try:
        rooms = Room.query.all()
        return jsonify([room.to_dict() for room in rooms])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/room/<int:room_id>')
def room_detail(room_id):
    """Room details page"""
    room = Room.query.get_or_404(room_id)
    return render_template('room_detail.html', room=room)

@app.route('/api/room/<int:room_id>')
def api_room_detail(room_id):
    """API endpoint to get specific room details as JSON"""
    try:
        room = Room.query.get_or_404(room_id)
        return jsonify(room.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/book', methods=['POST'])
def create_booking():
    """Handle booking form submission"""
    try:
        # Get form data
        name = request.form.get('name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        room_id = request.form.get('room_id')
        check_in_str = request.form.get('check_in')
        check_out_str = request.form.get('check_out')
        
        # Validation
        if not all([name, email, phone, room_id, check_in_str, check_out_str]):
            flash('Please fill in all required fields', 'error')
            return redirect(url_for('room_detail', room_id=room_id))
        
        # Convert dates
        check_in = datetime.strptime(check_in_str, '%Y-%m-%d').date()
        check_out = datetime.strptime(check_out_str, '%Y-%m-%d').date()
        
        # Validate dates
        if check_in >= check_out:
            flash('Check-out date must be after check-in date', 'error')
            return redirect(url_for('room_detail', room_id=room_id))
        
        if check_in < datetime.now().date():
            flash('Check-in date cannot be in the past', 'error')
            return redirect(url_for('room_detail', room_id=room_id))
        
        # Get room and calculate total price
        room = Room.query.get_or_404(room_id)
        nights = (check_out - check_in).days
        total_price = room.price * nights
        
        # Create booking
        booking = Booking(
            name=name,
            email=email,
            phone=phone,
            room_id=room_id,
            check_in=check_in,
            check_out=check_out,
            total_price=total_price
        )
        
        db.session.add(booking)
        db.session.commit()
        
        flash(f'Booking confirmed! Total: ${total_price:.2f} for {nights} night(s)', 'success')
        return redirect(url_for('home'))
        
    except Exception as e:
        db.session.rollback()
        flash(f'An error occurred: {str(e)}', 'error')
        return redirect(url_for('room_detail', room_id=room_id))

@app.route('/api/bookings')
def api_bookings():
    """API endpoint to get all bookings (for admin purposes)"""
    try:
        bookings = Booking.query.order_by(Booking.created_at.desc()).all()
        return jsonify([booking.to_dict() for booking in bookings])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def init_sample_data():
    """Initialize the database with sample rooms"""
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Check if rooms already exist
        if Room.query.first():
            return
        
        # Sample rooms data
        sample_rooms = [
            {
                'name': 'Cozy Single Room',
                'room_type': 'Single',
                'price': 89.99,
                'description': 'Perfect for solo travelers, this cozy room offers comfort and convenience with a comfortable bed, workspace, and modern amenities.',
                'image_url': 'https://images.unsplash.com/photo-1590490330182-1c6bfaecb0c5?w=800',
                'amenities': 'WiFi,TV,Air Conditioning,Workspace',
                'max_guests': 1
            },
            {
                'name': 'Comfortable Double Room',
                'room_type': 'Double',
                'price': 129.99,
                'description': 'Ideal for couples or friends, this spacious room features a comfortable queen bed, sitting area, and all modern amenities for a pleasant stay.',
                'image_url': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
                'amenities': 'WiFi,TV,Air Conditioning,Mini Bar,Room Service',
                'max_guests': 2
            },
            {
                'name': 'Luxury Deluxe Suite',
                'room_type': 'Deluxe',
                'price': 249.99,
                'description': 'Experience ultimate luxury in our deluxe suite featuring separate living area, king-sized bed, premium amenities, and stunning city views.',
                'image_url': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
                'amenities': 'WiFi,TV,Air Conditioning,Mini Bar,Room Service,Balcony,Jacuzzi',
                'max_guests': 4
            },
            {
                'name': 'Family Room',
                'room_type': 'Double',
                'price': 179.99,
                'description': 'Spacious family room with two queen beds, perfect for families. Includes a small sitting area and child-friendly amenities.',
                'image_url': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
                'amenities': 'WiFi,TV,Air Conditioning,Mini Bar,Room Service,Extra Beds',
                'max_guests': 4
            },
            {
                'name': 'Business Executive Room',
                'room_type': 'Single',
                'price': 149.99,
                'description': 'Designed for business travelers, this room includes a large workspace, high-speed internet, and premium business amenities.',
                'image_url': 'https://images.unsplash.com/photo-1551882547-ff40c63e527b?w=800',
                'amenities': 'WiFi,TV,Air Conditioning,Workspace,High-Speed Internet,Printer Access',
                'max_guests': 2
            }
        ]
        
        # Add sample rooms
        for room_data in sample_rooms:
            room = Room(**room_data)
            db.session.add(room)
        
        db.session.commit()
        print("Sample data initialized successfully!")

if __name__ == '__main__':
    # Initialize sample data before starting the app
    init_sample_data()
    app.run(debug=True, port=5000)
