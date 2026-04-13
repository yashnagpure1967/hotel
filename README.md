# Team Alpha Hotel - Full-Stack Hotel Booking Website

A modern, responsive hotel booking website built with Flask (Python) for the backend and HTML, CSS, JavaScript for the frontend. This project is designed for hackathons and demonstrates real-world application structure.

## Features

### Frontend Features
- **Home Page**: Hero section with search form and featured rooms
- **Rooms Page**: Dynamic room listing with filtering and search
- **Room Details Page**: Image gallery, booking form, and detailed information
- **Responsive Design**: Mobile-friendly layout using modern CSS
- **Dynamic Price Calculation**: Real-time price updates based on dates
- **Interactive UI**: Smooth animations and user-friendly interface

### Backend Features
- **Flask REST API**: Clean API endpoints for rooms and bookings
- **SQLite Database**: Persistent storage with SQLAlchemy ORM
- **Data Validation**: Form validation and error handling
- **Sample Data**: Pre-populated with 5 sample rooms
- **Booking System**: Complete booking workflow with confirmation

## Project Structure

```
team_alpha_hotel/
|
|-- app.py                 # Main Flask application
|-- models.py              # Database models (Room, Booking)
|-- requirements.txt       # Python dependencies
|-- README.md             # This file
|
|-- templates/
|   |-- base.html         # Base template with navigation
|   |-- index.html        # Home page
|   |-- rooms.html        # Rooms listing page
|   |-- room_detail.html  # Room details and booking
|
|-- static/
|   |-- css/
|   |   |-- style.css     # Main stylesheet
|   |-- js/
|   |   |-- script.js     # JavaScript functionality
|   |-- images/           # Image assets (if needed)
|
|-- hotel_booking.db      # SQLite database (created automatically)
```

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Run the Application
```bash
python app.py
```

The application will start on `http://localhost:5000`

### Step 3: Access the Website
Open your web browser and navigate to `http://localhost:5000`

## API Endpoints

### Rooms API
- `GET /api/rooms` - Get all rooms
- `GET /api/room/<id>` - Get specific room details

### Bookings API
- `POST /book` - Create a new booking
- `GET /api/bookings` - Get all bookings (admin)

### Web Pages
- `GET /` - Home page
- `GET /rooms` - Rooms listing page
- `GET /room/<id>` - Room details page

## Database Schema

### Rooms Table
- `id` - Primary key
- `name` - Room name
- `room_type` - Single, Double, or Deluxe
- `price` - Price per night
- `description` - Room description
- `image_url` - Image URL
- `amenities` - Comma-separated amenities
- `max_guests` - Maximum number of guests

### Bookings Table
- `id` - Primary key
- `name` - Guest name
- `email` - Guest email
- `phone` - Guest phone
- `room_id` - Foreign key to rooms table
- `check_in` - Check-in date
- `check_out` - Check-out date
- `total_price` - Total booking price
- `status` - Booking status (confirmed/cancelled)

## Sample Data

The application automatically creates 5 sample rooms on first run:

1. **Cozy Single Room** - $89.99/night
2. **Comfortable Double Room** - $129.99/night
3. **Luxury Deluxe Suite** - $249.99/night
4. **Family Room** - $179.99/night
5. **Business Executive Room** - $149.99/night

## Usage Instructions

### Making a Booking
1. Visit the home page and use the search form
2. Browse available rooms on the Rooms page
3. Click "View Details" on any room
4. Select check-in and check-out dates
5. Fill in your personal information
6. Review the calculated total price
7. Click "Book Now" to confirm

### Search and Filter
- **Search**: Find rooms by name
- **Room Type**: Filter by Single, Double, or Deluxe
- **Price Range**: Filter by price categories
- **Guests**: Filter by maximum guest capacity

## Technologies Used

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - Python ORM
- **SQLite** - Database
- **Jinja2** - Template engine

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox/Grid
- **JavaScript (ES6+)** - Dynamic functionality
- **Font Awesome** - Icons
- **Google Fonts** - Typography

### Design Features
- **Responsive Design**: Mobile-first approach
- **Modern CSS**: Flexbox, Grid, CSS Variables
- **Smooth Animations**: CSS transitions and keyframes
- **Interactive Elements**: Hover effects, form validation
- **Accessibility**: Semantic HTML, ARIA labels

## Bonus Features Implemented

- **Dynamic Price Calculation**: Real-time price updates
- **Advanced Filtering**: Multiple filter options
- **Image Gallery**: Room photo gallery
- **Form Validation**: Client and server-side validation
- **Error Handling**: User-friendly error messages
- **Responsive Navigation**: Mobile hamburger menu
- **Flash Messages**: Success/error notifications
- **Loading States**: Loading spinners for async operations

## Potential Enhancements

- User authentication system
- Admin panel for room management
- Payment integration (Stripe/PayPal)
- Email notifications
- Review and rating system
- Advanced search with location
- Calendar availability view
- Multi-language support

## Troubleshooting

### Common Issues

1. **Port 5000 already in use**
   ```bash
   # Kill the process using port 5000
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

2. **Database errors**
   - Delete `hotel_booking.db` and restart the app
   - Ensure all dependencies are installed

3. **Static files not loading**
   - Check file paths in templates
   - Ensure Flask is running in debug mode

## Development Tips

- Use `python app.py` to run in development mode
- Database automatically initializes with sample data
- All forms include validation and error handling
- API endpoints return JSON for easy integration
- CSS is modular and easy to customize

## License

This project is open source and available under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Team Alpha Hotel** - Built with Flask, HTML, CSS, and JavaScript
Perfect for hackathons and learning full-stack development!
