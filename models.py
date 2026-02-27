from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from bson import ObjectId  # This is correct - comes with pymongo
from datetime import datetime, timedelta

# Initialize extensions
mongo = PyMongo()
bcrypt = Bcrypt()

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