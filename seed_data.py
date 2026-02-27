from app import app
from models import mongo, Vendor, VendorBooking, VendorService, VendorReview
from datetime import datetime, timedelta
import random

def seed_database():
    """Seed database with sample data for testing"""
    
    with app.app_context():
        # Clear existing data
        mongo.db.vendors.delete_many({})
        mongo.db.vendor_bookings.delete_many({})
        mongo.db.vendor_services.delete_many({})
        mongo.db.vendor_reviews.delete_many({})
        mongo.db.vendor_notifications.delete_many({})
        mongo.db.vendor_earnings.delete_many({})
        
        print("Creating sample vendor...")
        
        # Create sample vendor
        vendor_data = {
            'business_name': 'Elegant Events',
            'owner_name': 'Priya Sharma',
            'email': 'priya@elegantevents.com',
            'password': 'password123',  # Will be hashed
            'phone': '+91 98765 43210',
            'address': 'Mumbai, Maharashtra',
            'description': 'Specializing in elegant and luxurious event decorations',
            'services_offered': ['Wedding', 'Birthday', 'Anniversary'],
            'gst_number': '27ABCDE1234F1Z5',
            'experience': 8,
            'verified': True,
            'rating': 4.8,
            'total_reviews': 45
        }
        
        vendor_id = Vendor.create_vendor(vendor_data)
        print(f"Vendor created with ID: {vendor_id}")
        
        # Create sample services
        services = [
            {
                'vendor_id': vendor_id,
                'name': 'Premium Birthday Decoration',
                'category': 'Birthday',
                'price': 5000,
                'discount': 20,
                'description': 'Complete birthday decoration package with balloons and themed setup',
                'image': 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500',
                'bookings_count': 45,
                'total_revenue': 180000
            },
            {
                'vendor_id': vendor_id,
                'name': 'Luxury Wedding Package',
                'category': 'Wedding',
                'price': 50000,
                'discount': 15,
                'description': 'Full wedding decoration including mandap and lighting',
                'image': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500',
                'bookings_count': 12,
                'total_revenue': 510000
            },
            {
                'vendor_id': vendor_id,
                'name': 'Traditional Haldi Setup',
                'category': 'Haldi',
                'price': 8000,
                'discount': 10,
                'description': 'Colorful Haldi ceremony decoration with traditional elements',
                'image': 'https://images.unsplash.com/photo-1558030135-5c0b5e7c3b7f?w=500',
                'bookings_count': 28,
                'total_revenue': 201600
            }
        ]
        
        for service in services:
            service_id = VendorService.create_service(service)
            print(f"Service created: {service['name']}")
        
        # Create sample bookings
        customers = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Neha Singh', 'Vikram Mehta']
        statuses = ['pending', 'confirmed', 'completed', 'cancelled']
        payment_types = ['advance', 'full']
        
        for i in range(20):
            status = random.choice(statuses)
            payment_type = random.choice(payment_types)
            amount = random.choice([5000, 8000, 15000, 25000, 35000, 50000])
            
            if payment_type == 'advance':
                paid = amount * 0.4
                remaining = amount - paid
            else:
                paid = amount
                remaining = 0
            
            booking_data = {
                'vendor_id': vendor_id,
                'customer_name': random.choice(customers),
                'service_type': random.choice(['Birthday', 'Wedding', 'Anniversary', 'Haldi']),
                'event_date': (datetime.now() + timedelta(days=random.randint(1, 30))).strftime('%Y-%m-%d'),
                'guests': random.randint(20, 200),
                'venue_address': f'{random.choice(["Mumbai", "Delhi", "Bangalore"])}, India',
                'total_amount': amount,
                'status': status,
                'payment_type': payment_type,
                'paid_amount': paid,
                'remaining_amount': remaining,
                'payment_status': 'completed' if paid >= amount else 'partial',
                'special_requests': 'Need blue theme' if random.random() > 0.7 else ''
            }
            
            booking_id = VendorBooking.create_booking(booking_data)
            print(f"Booking created: {booking_id}")
        
        # Create sample reviews
        for i in range(10):
            rating = random.randint(3, 5)
            review_data = {
                'vendor_id': vendor_id,
                'customer_name': random.choice(customers),
                'rating': rating,
                'comment': random.choice([
                    'Amazing service! Highly recommended.',
                    'Beautiful decoration, very professional team.',
                    'Good work, but could improve timing.',
                    'Perfect execution, loved it!',
                    'Great experience overall.'
                ]),
                'service_type': random.choice(['Birthday', 'Wedding', 'Anniversary']),
                'created_at': datetime.now() - timedelta(days=random.randint(1, 60))
            }
            
            review_id = VendorReview.create_review(review_data)
            
            # Add response to some reviews
            if random.random() > 0.5:
                VendorReview.add_response(
                    review_id,
                    'Thank you for your valuable feedback! We appreciate it.'
                )
            
            print(f"Review created")
        
        print("\n✅ Database seeded successfully!")
        print(f"Vendor Email: priya@elegantevents.com")
        print(f"Vendor Password: password123")

if __name__ == '__main__':
    seed_database()