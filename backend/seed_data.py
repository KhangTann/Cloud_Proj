import os
import django
import csv
# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tour_platform.settings')
django.setup()

from users.models import User
from .tours.models import Tour
from .bookings.models import Booking


User.objects.all().delete()
Tour.objects.all().delete()
Booking.objects.all().delete()

# -------- USERS --------
def seed_users():
    with open('raw_data/users.csv', newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            User.objects.create(
                user_id=row['user_id'],
                full_name=row['full_name'],
                email=row['email'],
                phone=row['phone'],
                city=row['city'],
                created_at=row['created_at']
            )


# -------- TOURS --------
def seed_tours():
    with open('raw_data/tours.csv', newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            Tour.objects.create(
                tour_id=row['tour_id'],
                name=row['name'],
                destination=row['destination'],
                price=row['price'],
                duration_days=row['duration_days'],
                category=row['category'],
                available_slots=row['available_slots']
            )


# -------- BOOKINGS --------
def seed_bookings():
    with open('raw_data/bookings.csv', newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            Booking.objects.create(
                booking_id=row['booking_id'],
                user_id=row['user_id'],   # FK
                tour_id=row['tour_id'],   # FK
                booking_date=row['booking_date'],
                travel_date=row['travel_date'],
                num_people=row['num_people'],
                total_price=row['total_price'],
                status=row['status']
            )


if __name__ == '__main__':
    seed_users()
    seed_tours()
    seed_bookings()
    print("✅ Seeding done!")