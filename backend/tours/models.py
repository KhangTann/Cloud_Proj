from django.db import models
from users.models import User

class Location(models.Model):
    location_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = 'Locations'
        managed = True

    def __str__(self):
        return self.name

class Tour(models.Model):
    tour_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    duration_days = models.IntegerField()
    category = models.CharField(max_length=100)
    available_slots = models.IntegerField()

    class Meta:
        db_table = 'Tours'
        managed = True

    def __str__(self):
        return self.name

class TourImage(models.Model):
    image_id = models.AutoField(primary_key=True)
    tour = models.ForeignKey(Tour, related_name='images', on_delete=models.CASCADE, db_column='tour_id')
    image_url = models.CharField(max_length=500)

    class Meta:
        db_table = 'TourImages'
        managed = True

class Review(models.Model):
    review_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
    tour = models.ForeignKey(Tour, related_name='reviews', on_delete=models.CASCADE, db_column='tour_id')
    rating = models.IntegerField()
    comment = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Reviews'
        managed = True

    def __str__(self):
        return f"Review by {self.user.username} for {self.tour.title}"
