from rest_framework import serializers
from .models import Location, Tour, TourImage, Review

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Review
        fields = ['review_id', 'username', 'rating', 'comment', 'created_at']

class TourImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourImage
        fields = ['image_id', 'image_url']

class TourSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tour
        fields = '__all__'

class TourCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tour
        fields = ['name', 'destination', 'price', 'duration_days', 'category', 'available_slots']
