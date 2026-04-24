import os
import django
import csv

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tour_platform.settings')
django.setup()

from users.models import User
from users.models import Tour
from users.models import Booking


def export_users():
    with open('users.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['user_id', 'full_name', 'email', 'phone', 'created_at', 'city'])

        for u in User.objects.all():
            writer.writerow([
                u.user_id,
                u.full_name,
                u.email,
                u.phone,
                u.created_at,
                getattr(u, 'city', '')  # nếu có field city
            ])


def export_tours():
    with open('tours.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['tour_id', 'name', 'destination', 'price', 'duration_days', 'category', 'available_slots'])

        for t in Tour.objects.all():
            writer.writerow([
                t.tour_id,
                t.name,
                getattr(t, 'destination', ''),
                t.price,
                getattr(t, 'duration_days', 0),
                getattr(t, 'category', ''),
                getattr(t, 'available_slots', 0)
            ])


def export_bookings():
    with open('bookings.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([
            'booking_id', 'user_id', 'tour_id',
            'booking_date', 'travel_date',
            'num_people', 'total_price', 'status'
        ])

        for b in Booking.objects.all():
            writer.writerow([
                b.booking_id,
                b.user_id,
                b.tour_id,
                b.booking_date,
                getattr(b, 'travel_date', ''),
                b.num_people,
                b.total_price,
                b.status
            ])


if __name__ == "__main__":
    export_users()
    export_tours()
    export_bookings()
    print("Export done!")