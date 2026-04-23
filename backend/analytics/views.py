from django.shortcuts import render

from django.http import JsonResponse

def revenue(request):
    data = {
        "data": [
            {"date": "2026-04-01", "revenue": 0},
            {"date": "2026-04-02", "revenue": 0},
        ]
    }
    return JsonResponse(data)


def top_tours(request):
    data = {
        "data": [
            {"tour_name": "Tour Đà Lạt", "bookings": 0},
            {"tour_name": "Tour Phú Quốc", "bookings": 0},
        ]
    }
    return JsonResponse(data)


def summary(request):
    data = {
        "total_bookings": 0,
        "total_revenue": 0,
        "total_users": 0
    }
    return JsonResponse(data)
