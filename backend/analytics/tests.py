from django.test import TestCase

# Create your tests here.
from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from users.models import User
from .tours.models import Tour
from .bookings.models import Booking
from datetime import date

class AnalyticsAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create(
            full_name="Test User",
            email="test@example.com"
        )

        self.tour = Tour.objects.create(
            name="Test Tour",
            destination="Hanoi",
            price=100,
            duration_days=3,
            category="Adventure",
            available_slots=10
        )

        Booking.objects.create(
            user=self.user,
            tour=self.tour,
            booking_date=date.today(),
            travel_date=date.today(),
            num_people=2,
            total_price=200,
            status="confirmed"
        )

    def test_revenue_api(self):
        response = self.client.get("/api/analytics/revenue/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("data", response.data)

    def test_top_tours_api(self):
        response = self.client.get("/api/analytics/top-tours/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data["data"]) > 0)

    def test_summary_api(self):
        response = self.client.get("/api/analytics/summary/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("total_users", response.data["data"])