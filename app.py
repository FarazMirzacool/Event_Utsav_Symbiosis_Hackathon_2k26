from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_socketio import SocketIO, emit
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from bson import ObjectId
from datetime import datetime, timedelta
import os
import re

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configuration
app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/eventutsav')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'vendor-secret-key-2024')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'app-secret-key-2024')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

# Initialize extensions
CORS(app, origins=["http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:3000"])
mongo = PyMongo(app)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# ========== MODELS (defined after mongo initialization) ==========

class Vendor:
    collection = mongo.db.vendors
    
    @staticmethod
    def create_vendor(data):
        """Create a new vendor"""
        data['password'] = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        data['created_at'] = datetime.utcnow()
        data['updated_at'] = datetime.utcnow()
        data['is_active'] = True
        data['verified'] = False
        data['rating'] = 0.0
        data['total_reviews'] = 0
        data['total_earnings'] = 0
        data['business_hours'] = {
            'monday': {'open': '09:00', 'close': '18:00', 'closed': False},
            'tuesday': {'open': '09:00', 'close': '18:00', 'closed': False},
            'wednesday': {'open': '09:00', 'close': '18:00', 'closed': False},
            'thursday': {'open': '09:00', 'close': '18:00', 'closed': False},
            'friday': {'open': '09:00', 'close': '18:00', 'closed': False},
            'saturday': {'open': '10:00', 'close': '16:00', 'closed': False},
            'sunday': {'open': '00:00', 'close': '00:00', 'closed': True}
        }
        data['payment_settings'] = {
            'upi': True,
            'cards': True,
            'netbanking': True,
            'cash': False,
            'upi_id': '',
            'bank_account': ''
        }
        data['notification_preferences'] = {
            'email': True,
            'sms': True,
            'new_booking': True,
            'payment_received': True,
            'marketing': False
        }
        
        result = Vendor.collection.insert_one(data)
        return str(result.inserted_id)
    
    @staticmethod
    def find_by_email(email):
        """Find vendor by email"""
        return Vendor.collection.find_one({'email': email})
    
    @staticmethod
    def find_by_id(vendor_id):
        """Find vendor by ID"""
        try:
            return Vendor.collection.find_one({'_id': ObjectId(vendor_id)})
        except Exception as e:
            print(f"Error finding vendor by ID: {e}")
            return None
    
    @staticmethod
    def verify_password(vendor, password):
        """Verify password"""
        return bcrypt.check_password_hash(vendor['password'], password)
    
    @staticmethod
    def update_vendor(vendor_id, data):
        """Update vendor data"""
        data['updated_at'] = datetime.utcnow()
        return Vendor.collection.update_one(
            {'_id': ObjectId(vendor_id)},
            {'$set': data}
        )
    
    @staticmethod
    def update_earnings(vendor_id, amount):
        """Update vendor earnings"""
        return Vendor.collection.update_one(
            {'_id': ObjectId(vendor_id)},
            {
                '$inc': {'total_earnings': amount},
                '$set': {'updated_at': datetime.utcnow()}
            }
        )
    
    @staticmethod
    def update_rating(vendor_id, new_rating):
        """Update vendor rating"""
        vendor = Vendor.find_by_id(vendor_id)
        if vendor:
            total = vendor.get('total_reviews', 0)
            current = vendor.get('rating', 0.0)
            new_total = total + 1
            new_avg = ((current * total) + new_rating) / new_total
            
            return Vendor.collection.update_one(
                {'_id': ObjectId(vendor_id)},
                {
                    '$set': {
                        'rating': round(new_avg, 1),
                        'total_reviews': new_total
                    }
                }
            )
        return None

class VendorBooking:
    collection = mongo.db.vendor_bookings
    
    @staticmethod
    def create_booking(data):
        """Create a new booking for vendor"""
        data['created_at'] = datetime.utcnow()
        data['updated_at'] = datetime.utcnow()
        data['status'] = 'pending'  # pending, confirmed, completed, cancelled
        data['payment_status'] = 'pending'  # pending, partial, completed
        data['payment_type'] = data.get('payment_type', 'advance')  # advance, full
        data['paid_amount'] = data.get('paid_amount', 0)
        data['remaining_amount'] = data['total_amount'] - data['paid_amount']
        
        result = VendorBooking.collection.insert_one(data)
        return str(result.inserted_id)
    
    @staticmethod
    def get_vendor_bookings(vendor_id, status=None):
        """Get all bookings for a vendor"""
        query = {'vendor_id': vendor_id}
        if status and status != 'all':
            query['status'] = status
        
        bookings = VendorBooking.collection.find(query).sort('created_at', -1)
        return list(bookings)
    
    @staticmethod
    def get_booking_by_id(booking_id):
        """Get booking by ID"""
        try:
            return VendorBooking.collection.find_one({'_id': ObjectId(booking_id)})
        except Exception as e:
            print(f"Error finding booking by ID: {e}")
            return None
    
    @staticmethod
    def update_booking_status(booking_id, status):
        """Update booking status"""
        return VendorBooking.collection.update_one(
            {'_id': ObjectId(booking_id)},
            {
                '$set': {
                    'status': status,
                    'updated_at': datetime.utcnow()
                }
            }
        )
    
    @staticmethod
    def update_payment(booking_id, amount):
        """Update payment information"""
        booking = VendorBooking.get_booking_by_id(booking_id)
        if booking:
            new_paid = booking.get('paid_amount', 0) + amount
            status = 'completed' if new_paid >= booking['total_amount'] else 'partial'
            
            return VendorBooking.collection.update_one(
                {'_id': ObjectId(booking_id)},
                {
                    '$set': {
                        'paid_amount': new_paid,
                        'remaining_amount': booking['total_amount'] - new_paid,
                        'payment_status': status,
                        'updated_at': datetime.utcnow()
                    }
                }
            )
        return None
    
    @staticmethod
    def get_upcoming_bookings(vendor_id):
        """Get upcoming bookings"""
        today = datetime.utcnow().date().isoformat()
        query = {
            'vendor_id': vendor_id,
            'event_date': {'$gte': today},
            'status': {'$in': ['pending', 'confirmed']}
        }
        return list(VendorBooking.collection.find(query).sort('event_date', 1))

class VendorService:
    collection = mongo.db.vendor_services
    
    @staticmethod
    def create_service(data):
        """Create a new service"""
        data['created_at'] = datetime.utcnow()
        data['updated_at'] = datetime.utcnow()
        data['status'] = 'active'
        data['bookings_count'] = 0
        data['total_revenue'] = 0
        
        if data.get('discount'):
            data['discounted_price'] = data['price'] - (data['price'] * data['discount'] / 100)
        else:
            data['discounted_price'] = data['price']
            data['discount'] = 0
        
        result = VendorService.collection.insert_one(data)
        return str(result.inserted_id)
    
    @staticmethod
    def get_vendor_services(vendor_id):
        """Get all services for a vendor"""
        return list(VendorService.collection.find({'vendor_id': vendor_id}).sort('created_at', -1))
    
    @staticmethod
    def get_service_by_id(service_id):
        """Get service by ID"""
        try:
            return VendorService.collection.find_one({'_id': ObjectId(service_id)})
        except Exception as e:
            print(f"Error finding service by ID: {e}")
            return None
    
    @staticmethod
    def update_service(service_id, data):
        """Update service"""
        data['updated_at'] = datetime.utcnow()
        if data.get('discount') is not None:
            data['discounted_price'] = data['price'] - (data['price'] * data['discount'] / 100)
        
        return VendorService.collection.update_one(
            {'_id': ObjectId(service_id)},
            {'$set': data}
        )
    
    @staticmethod
    def delete_service(service_id):
        """Delete service"""
        return VendorService.collection.delete_one({'_id': ObjectId(service_id)})
    
    @staticmethod
    def increment_bookings(service_id, amount):
        """Increment booking count and revenue"""
        return VendorService.collection.update_one(
            {'_id': ObjectId(service_id)},
            {
                '$inc': {
                    'bookings_count': 1,
                    'total_revenue': amount
                }
            }
        )

class VendorNotification:
    collection = mongo.db.vendor_notifications
    
    @staticmethod
    def create_notification(data):
        """Create a new notification"""
        data['created_at'] = datetime.utcnow()
        data['read'] = False
        
        result = VendorNotification.collection.insert_one(data)
        return str(result.inserted_id)
    
    @staticmethod
    def get_vendor_notifications(vendor_id, limit=50):
        """Get notifications for a vendor"""
        return list(VendorNotification.collection.find(
            {'vendor_id': vendor_id}
        ).sort('created_at', -1).limit(limit))
    
    @staticmethod
    def mark_as_read(notification_id):
        """Mark notification as read"""
        try:
            return VendorNotification.collection.update_one(
                {'_id': ObjectId(notification_id)},
                {'$set': {'read': True}}
            )
        except Exception as e:
            print(f"Error marking notification as read: {e}")
            return None
    
    @staticmethod
    def mark_all_as_read(vendor_id):
        """Mark all notifications as read"""
        return VendorNotification.collection.update_many(
            {'vendor_id': vendor_id, 'read': False},
            {'$set': {'read': True}}
        )
    
    @staticmethod
    def get_unread_count(vendor_id):
        """Get unread notification count"""
        return VendorNotification.collection.count_documents({
            'vendor_id': vendor_id,
            'read': False
        })

class VendorReview:
    collection = mongo.db.vendor_reviews
    
    @staticmethod
    def create_review(data):
        """Create a new review"""
        data['created_at'] = datetime.utcnow()
        data['response'] = None
        data['response_date'] = None
        
        result = VendorReview.collection.insert_one(data)
        return str(result.inserted_id)
    
    @staticmethod
    def get_vendor_reviews(vendor_id):
        """Get all reviews for a vendor"""
        return list(VendorReview.collection.find(
            {'vendor_id': vendor_id}
        ).sort('created_at', -1))
    
    @staticmethod
    def add_response(review_id, response):
        """Add vendor response to review"""
        try:
            return VendorReview.collection.update_one(
                {'_id': ObjectId(review_id)},
                {
                    '$set': {
                        'response': response,
                        'response_date': datetime.utcnow()
                    }
                }
            )
        except Exception as e:
            print(f"Error adding response: {e}")
            return None
    
    @staticmethod
    def get_review_stats(vendor_id):
        """Get review statistics"""
        reviews = list(VendorReview.collection.find({'vendor_id': vendor_id}))
        if not reviews:
            return {'average': 0, 'total': 0, 'distribution': {1:0, 2:0, 3:0, 4:0, 5:0}}
        
        total = len(reviews)
        avg = sum(r['rating'] for r in reviews) / total
        distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        for r in reviews:
            distribution[r['rating']] += 1
        
        return {
            'average': round(avg, 1),
            'total': total,
            'distribution': distribution
        }

class VendorEarnings:
    collection = mongo.db.vendor_earnings
    
    @staticmethod
    def add_earning(data):
        """Add earning record"""
        data['created_at'] = datetime.utcnow()
        
        result = VendorEarnings.collection.insert_one(data)
        return str(result.inserted_id)
    
    @staticmethod
    def get_vendor_earnings(vendor_id, period='month'):
        """Get earnings for a vendor"""
        today = datetime.utcnow()
        
        if period == 'week':
            start_date = today - timedelta(days=7)
        elif period == 'month':
            start_date = today - timedelta(days=30)
        elif period == 'year':
            start_date = today - timedelta(days=365)
        else:
            start_date = today - timedelta(days=30)
        
        earnings = VendorEarnings.collection.find({
            'vendor_id': vendor_id,
            'created_at': {'$gte': start_date}
        }).sort('created_at', -1)
        
        return list(earnings)
    
    @staticmethod
    def get_earnings_summary(vendor_id):
        """Get earnings summary"""
        pipeline = [
            {'$match': {'vendor_id': vendor_id}},
            {'$group': {
                '_id': None,
                'total': {'$sum': '$amount'},
                'count': {'$sum': 1},
                'avg': {'$avg': '$amount'}
            }}
        ]
        
        result = list(VendorEarnings.collection.aggregate(pipeline))
        if result:
            return {
                'total': result[0].get('total', 0),
                'count': result[0].get('count', 0),
                'avg': round(result[0].get('avg', 0), 2)
            }
        return {'total': 0, 'count': 0, 'avg': 0}

# ========== HELPER FUNCTIONS ==========

def validate_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    pattern = r'^\+?1?\d{10,15}$'
    return re.match(pattern, phone) is not None

def send_notification(vendor_id, title, message, type='info'):
    """Send real-time notification"""
    try:
        notification = {
            'vendor_id': vendor_id,
            'title': title,
            'message': message,
            'type': type
        }
        
        notif_id = VendorNotification.create_notification(notification)
        
        # Emit socket event
        socketio.emit(f'notification_{vendor_id}', {
            'id': notif_id,
            'title': title,
            'message': message,
            'type': type,
            'time': 'Just now'
        })
        
        return notif_id
    except Exception as e:
        print(f"Error sending notification: {e}")
        return None

def time_ago(dt):
    """Convert datetime to time ago string"""
    if not dt:
        return "Unknown"
    
    now = datetime.utcnow()
    diff = now - dt
    
    if diff.days > 30:
        months = diff.days // 30
        return f"{months} month{'s' if months > 1 else ''} ago"
    elif diff.days > 0:
        return f"{diff.days} day{'s' if diff.days > 1 else ''} ago"
    elif diff.seconds > 3600:
        hours = diff.seconds // 3600
        return f"{hours} hour{'s' if hours > 1 else ''} ago"
    elif diff.seconds > 60:
        minutes = diff.seconds // 60
        return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
    else:
        return "Just now"

# ========== AUTHENTICATION ROUTES ==========

@app.route('/api/vendor/auth/register', methods=['POST'])
def register_vendor():
    """Register a new vendor"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required = ['business_name', 'owner_name', 'email', 'password', 'phone', 'address']
        for field in required:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        # Validate email
        if not validate_email(data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate phone
        if not validate_phone(data['phone']):
            return jsonify({'error': 'Invalid phone number'}), 400
        
        # Check if vendor exists
        if Vendor.find_by_email(data['email']):
            return jsonify({'error': 'Email already registered'}), 400
        
        # Prepare vendor data
        vendor_data = {
            'business_name': data['business_name'],
            'owner_name': data['owner_name'],
            'email': data['email'],
            'password': data['password'],
            'phone': data['phone'],
            'address': data['address'],
            'description': data.get('description', ''),
            'services_offered': data.get('services', []),
            'gst_number': data.get('gst_number', ''),
            'experience': data.get('experience', 0),
            'profile_image': data.get('profile_image', '')
        }
        
        # Create vendor
        vendor_id = Vendor.create_vendor(vendor_data)
        
        # Create token
        access_token = create_access_token(identity=vendor_id)
        
        # Send welcome notification
        send_notification(
            vendor_id,
            'Welcome to EventUtsav!',
            'Your vendor account has been created successfully.',
            'success'
        )
        
        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'vendor_id': vendor_id,
            'access_token': access_token
        }), 201
        
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/vendor/auth/login', methods=['POST'])
def login_vendor():
    """Login vendor"""
    try:
        data = request.get_json()
        
        if 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Email and password required'}), 400
        
        # Find vendor
        vendor = Vendor.find_by_email(data['email'])
        if not vendor or not Vendor.verify_password(vendor, data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Create token
        access_token = create_access_token(identity=str(vendor['_id']))
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'access_token': access_token,
            'vendor_id': str(vendor['_id']),
            'business_name': vendor['business_name'],
            'owner_name': vendor['owner_name'],
            'verified': vendor.get('verified', False)
        }), 200
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/vendor/auth/profile', methods=['GET'])
@jwt_required()
def get_vendor_profile():
    """Get vendor profile"""
    try:
        vendor_id = get_jwt_identity()
        vendor = Vendor.find_by_id(vendor_id)
        
        if not vendor:
            return jsonify({'error': 'Vendor not found'}), 404
        
        # Remove sensitive data
        vendor.pop('password', None)
        vendor['_id'] = str(vendor['_id'])
        
        # Get stats
        bookings = VendorBooking.get_vendor_bookings(vendor_id)
        services = VendorService.get_vendor_services(vendor_id)
        reviews = VendorReview.get_vendor_reviews(vendor_id)
        
        vendor['stats'] = {
            'total_bookings': len(bookings),
            'pending_bookings': len([b for b in bookings if b['status'] == 'pending']),
            'completed_bookings': len([b for b in bookings if b['status'] == 'completed']),
            'total_services': len(services),
            'total_reviews': len(reviews),
            'unread_notifications': VendorNotification.get_unread_count(vendor_id)
        }
        
        return jsonify(vendor), 200
        
    except Exception as e:
        print(f"Profile error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/vendor/auth/profile', methods=['PUT'])
@jwt_required()
def update_vendor_profile():
    """Update vendor profile"""
    try:
        vendor_id = get_jwt_identity()
        data = request.get_json()
        
        # Remove fields that shouldn't be updated
        data.pop('_id', None)
        data.pop('password', None)
        data.pop('email', None)
        data.pop('created_at', None)
        
        result = Vendor.update_vendor(vendor_id, data)
        
        if result.modified_count > 0:
            return jsonify({'success': True, 'message': 'Profile updated successfully'}), 200
        else:
            return jsonify({'message': 'No changes made'}), 200
            
    except Exception as e:
        print(f"Profile update error: {e}")
        return jsonify({'error': str(e)}), 500

# ========== DASHBOARD ROUTES ==========

@app.route('/api/vendor/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    """Get dashboard data"""
    try:
        vendor_id = get_jwt_identity()
        
        # Get all bookings
        bookings = VendorBooking.get_vendor_bookings(vendor_id)
        
        # Calculate stats
        total_bookings = len(bookings)
        pending_bookings = len([b for b in bookings if b['status'] == 'pending'])
        confirmed_bookings = len([b for b in bookings if b['status'] == 'confirmed'])
        completed_bookings = len([b for b in bookings if b['status'] == 'completed'])
        
        # Calculate earnings
        total_earnings = sum(b['total_amount'] for b in bookings if b['status'] == 'completed')
        pending_earnings = sum(b.get('remaining_amount', 0) for b in bookings if b.get('payment_status') != 'completed')
        
        # Get recent activity
        recent_activity = []
        for b in sorted(bookings, key=lambda x: x['created_at'], reverse=True)[:5]:
            recent_activity.append({
                'type': 'booking',
                'text': f"New booking from {b['customer_name']}",
                'time': time_ago(b['created_at'])
            })
        
        # Get upcoming bookings
        upcoming = VendorBooking.get_upcoming_bookings(vendor_id)
        
        dashboard_data = {
            'stats': {
                'total_bookings': total_bookings,
                'pending_bookings': pending_bookings,
                'confirmed_bookings': confirmed_bookings,
                'completed_bookings': completed_bookings,
                'total_earnings': total_earnings,
                'pending_earnings': pending_earnings
            },
            'recent_activity': recent_activity,
            'upcoming_bookings': [
                {
                    'id': str(b['_id']),
                    'customer': b['customer_name'],
                    'service': b['service_type'],
                    'date': b['event_date'],
                    'guests': b['guests'],
                    'status': b['status']
                }
                for b in upcoming[:5]
            ]
        }
        
        return jsonify(dashboard_data), 200
        
    except Exception as e:
        print(f"Dashboard error: {e}")
        return jsonify({'error': str(e)}), 500

# ========== BOOKING ROUTES ==========

@app.route('/api/vendor/bookings', methods=['GET'])
@jwt_required()
def get_bookings():
    """Get all bookings for vendor"""
    try:
        vendor_id = get_jwt_identity()
        status = request.args.get('status', 'all')
        date = request.args.get('date')
        
        bookings = VendorBooking.get_vendor_bookings(vendor_id, status)
        
        # Filter by date if provided
        if date:
            bookings = [b for b in bookings if b['event_date'] == date]
        
        # Format for response
        formatted_bookings = []
        for b in bookings:
            formatted_bookings.append({
                'id': str(b['_id']),
                'customer': b['customer_name'],
                'service': b['service_type'],
                'date': b['event_date'],
                'amount': b['total_amount'],
                'status': b['status'],
                'payment': b.get('payment_type', 'advance'),
                'paidAmount': b.get('paid_amount', 0),
                'remainingAmount': b.get('remaining_amount', 0),
                'eventType': b['service_type'],
                'guests': b['guests'],
                'venue': b.get('venue_address', ''),
                'specialRequests': b.get('special_requests', '')
            })
        
        return jsonify(formatted_bookings), 200
        
    except Exception as e:
        print(f"Get bookings error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/vendor/bookings/<booking_id>', methods=['GET'])
@jwt_required()
def get_booking(booking_id):
    """Get single booking details"""
    try:
        vendor_id = get_jwt_identity()
        booking = VendorBooking.get_booking_by_id(booking_id)
        
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        if booking['vendor_id'] != vendor_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        booking['_id'] = str(booking['_id'])
        return jsonify(booking), 200
        
    except Exception as e:
        print(f"Get booking error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/vendor/bookings/<booking_id>/status', methods=['PUT'])
@jwt_required()
def update_booking_status_route(booking_id):
    """Update booking status"""
    try:
        vendor_id = get_jwt_identity()
        data = request.get_json()
        new_status = data.get('status')
        
        if not new_status:
            return jsonify({'error': 'Status required'}), 400
        
        booking = VendorBooking.get_booking_by_id(booking_id)
        
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        if booking['vendor_id'] != vendor_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Update status
        VendorBooking.update_booking_status(booking_id, new_status)
        
        # Send notification
        send_notification(
            vendor_id,
            'Booking Status Updated',
            f'Booking {booking_id} marked as {new_status}',
            'info'
        )
        
        # If completed, update earnings
        if new_status == 'completed':
            Vendor.update_earnings(vendor_id, booking['total_amount'])
            
            # Add earning record
            VendorEarnings.add_earning({
                'vendor_id': vendor_id,
                'booking_id': booking_id,
                'amount': booking['total_amount'],
                'type': 'booking_completion'
            })
        
        return jsonify({'success': True, 'message': f'Booking marked as {new_status}'}), 200
        
    except Exception as e:
        print(f"Update booking status error: {e}")
        return jsonify({'error': str(e)}), 500

# ========== SERVICE ROUTES ==========

@app.route('/api/vendor/services', methods=['GET'])
@jwt_required()
def get_services():
    """Get all services for vendor"""
    try:
        vendor_id = get_jwt_identity()
        services = VendorService.get_vendor_services(vendor_id)
        
        formatted_services = []
        for s in services:
            s['_id'] = str(s['_id'])
            s.pop('vendor_id', None)
            formatted_services.append(s)
        
        return jsonify(formatted_services), 200
        
    except Exception as e:
        print(f"Get services error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/vendor/services', methods=['POST'])
@jwt_required()
def create_service():
    """Create new service"""
    try:
        vendor_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required = ['name', 'category', 'price', 'description']
        for field in required:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        # Add vendor_id to data
        data['vendor_id'] = vendor_id
        
        # Create service
        service_id = VendorService.create_service(data)
        
        # Send notification
        send_notification(
            vendor_id,
            'New Service Added',
            f'Service "{data["name"]}" has been added successfully',
            'success'
        )
        
        return jsonify({
            'success': True,
            'message': 'Service created successfully',
            'service_id': service_id
        }), 201
        
    except Exception as e:
        print(f"Create service error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/vendor/services/<service_id>', methods=['PUT'])
@jwt_required()
def update_service(service_id):
    """Update service"""
    try:
        vendor_id = get_jwt_identity()
        data = request.get_json()
        
        service = VendorService.get_service_by_id(service_id)
        
        if not service:
            return jsonify({'error': 'Service not found'}), 404
        
        if service['vendor_id'] != vendor_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Update service
        VendorService.update_service(service_id, data)
        
        return jsonify({'success': True, 'message': 'Service updated successfully'}), 200
        
    except Exception as e:
        print(f"Update service error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/vendor/services/<service_id>', methods=['DELETE'])
@jwt_required()
def delete_service(service_id):
    """Delete service"""
    try:
        vendor_id = get_jwt_identity()
        
        service = VendorService.get_service_by_id(service_id)
        
        if not service:
            return jsonify({'error': 'Service not found'}), 404
        
        if service['vendor_id'] != vendor_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Delete service
        VendorService.delete_service(service_id)
        
        return jsonify({'success': True, 'message': 'Service deleted successfully'}), 200
        
    except Exception as e:
        print(f"Delete service error: {e}")
        return jsonify({'error': str(e)}), 500

# ========== NOTIFICATION ROUTES ==========

@app.route('/api/vendor/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    """Get notifications for vendor"""
    try:
        vendor_id = get_jwt_identity()
        notifications = VendorNotification.get_vendor_notifications(vendor_id)
        
        formatted = []
        for n in notifications:
            formatted.append({
                'id': str(n['_id']),
                'title': n['title'],
                'message': n['message'],
                'time': time_ago(n['created_at']),
                'read': n['read'],
                'type': n.get('type', 'info')
            })
        
        return jsonify(formatted), 200
        
    except Exception as e:
        print(f"Get notifications error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/vendor/notifications/<notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_notification_read(notification_id):
    """Mark notification as read"""
    try:
        vendor_id = get_jwt_identity()
        VendorNotification.mark_as_read(notification_id)
        
        return jsonify({'success': True}), 200
        
    except Exception as e:
        print(f"Mark notification read error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/vendor/notifications/read-all', methods=['PUT'])
@jwt_required()
def mark_all_notifications_read():
    """Mark all notifications as read"""
    try:
        vendor_id = get_jwt_identity()
        VendorNotification.mark_all_as_read(vendor_id)
        
        return jsonify({'success': True}), 200
        
    except Exception as e:
        print(f"Mark all read error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/vendor/notifications/unread-count', methods=['GET'])
@jwt_required()
def get_unread_count():
    """Get unread notification count"""
    try:
        vendor_id = get_jwt_identity()
        count = VendorNotification.get_unread_count(vendor_id)
        
        return jsonify({'count': count}), 200
        
    except Exception as e:
        print(f"Get unread count error: {e}")
        return jsonify({'error': str(e)}), 500

# ========== REVIEW ROUTES ==========

@app.route('/api/vendor/reviews', methods=['GET'])
@jwt_required()
def get_reviews():
    """Get all reviews for vendor"""
    try:
        vendor_id = get_jwt_identity()
        reviews = VendorReview.get_vendor_reviews(vendor_id)
        
        formatted = []
        for r in reviews:
            formatted.append({
                'id': str(r['_id']),
                'customer': r['customer_name'],
                'avatar': r['customer_name'][0],
                'rating': r['rating'],
                'comment': r['comment'],
                'service': r.get('service_type', ''),
                'date': r['created_at'].strftime('%Y-%m-%d'),
                'response': r.get('response')
            })
        
        return jsonify(formatted), 200
        
    except Exception as e:
        print(f"Get reviews error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/vendor/reviews/<review_id>/respond', methods=['POST'])
@jwt_required()
def respond_to_review(review_id):
    """Respond to a review"""
    try:
        vendor_id = get_jwt_identity()
        data = request.get_json()
        response = data.get('response')
        
        if not response:
            return jsonify({'error': 'Response required'}), 400
        
        VendorReview.add_response(review_id, response)
        
        return jsonify({'success': True, 'message': 'Response added successfully'}), 200
        
    except Exception as e:
        print(f"Respond to review error: {e}")
        return jsonify({'error': str(e)}), 500

# ========== EARNINGS ROUTES ==========

@app.route('/api/vendor/earnings', methods=['GET'])
@jwt_required()
def get_earnings():
    """Get earnings data"""
    try:
        vendor_id = get_jwt_identity()
        period = request.args.get('period', 'month')
        
        # Get earnings records
        earnings = VendorEarnings.get_vendor_earnings(vendor_id, period)
        
        # Get summary
        summary = VendorEarnings.get_earnings_summary(vendor_id)
        
        # Group by date for chart
        chart_data = {}
        for e in earnings:
            date = e['created_at'].strftime('%Y-%m-%d')
            if date not in chart_data:
                chart_data[date] = 0
            chart_data[date] += e['amount']
        
        # Get recent payments
        recent_payments = []
        for e in sorted(earnings, key=lambda x: x['created_at'], reverse=True)[:10]:
            recent_payments.append({
                'date': e['created_at'].strftime('%Y-%m-%d'),
                'booking_id': e.get('booking_id', ''),
                'amount': e['amount'],
                'type': e['type']
            })
        
        return jsonify({
            'summary': {
                'total': summary.get('total', 0),
                'count': summary.get('count', 0),
                'average': round(summary.get('avg', 0), 2)
            },
            'chart_data': chart_data,
            'recent_payments': recent_payments
        }), 200
        
    except Exception as e:
        print(f"Get earnings error: {e}")
        return jsonify({'error': str(e)}), 500

# ========== HEALTH CHECK ==========

@app.route('/api/vendor/health', methods=['GET'])
def health():
    """Health check endpoint"""
    try:
        # Test database connection
        mongo.db.command('ping')
        db_status = 'connected'
    except Exception as e:
        db_status = f'error: {str(e)}'
    
    return jsonify({
        'status': 'healthy',
        'message': 'Vendor API is running',
        'database': db_status,
        'timestamp': datetime.utcnow().isoformat()
    }), 200

# ========== SETUP ROUTE ==========

@app.route('/api/vendor/setup', methods=['POST'])
def setup_database():
    """Create database indexes"""
    try:
        # Create indexes
        mongo.db.vendors.create_index("email", unique=True)
        mongo.db.vendors.create_index("phone")
        
        mongo.db.vendor_bookings.create_index("vendor_id")
        mongo.db.vendor_bookings.create_index("status")
        mongo.db.vendor_bookings.create_index("event_date")
        
        mongo.db.vendor_services.create_index("vendor_id")
        mongo.db.vendor_services.create_index("category")
        
        mongo.db.vendor_notifications.create_index("vendor_id")
        mongo.db.vendor_notifications.create_index("read")
        mongo.db.vendor_notifications.create_index("created_at")
        
        mongo.db.vendor_reviews.create_index("vendor_id")
        mongo.db.vendor_reviews.create_index("rating")
        
        mongo.db.vendor_earnings.create_index("vendor_id")
        mongo.db.vendor_earnings.create_index("created_at")
        
        return jsonify({'success': True, 'message': 'Database indexes created'}), 200
    except Exception as e:
        print(f"Setup error: {e}")
        return jsonify({'error': str(e)}), 500

# ========== ERROR HANDLERS ==========

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# ========== SOCKETIO EVENTS ==========

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

# ========== MAIN ==========

if __name__ == '__main__':
    print("=" * 50)
    print("EventUtsav Vendor API Server")
    print("=" * 50)
    print(f"MongoDB URI: {app.config['MONGO_URI']}")
    print(f"Server will run on: http://localhost:5001")
    print("=" * 50)
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    socketio.run(app, debug=True, host='0.0.0.0', port=5001)