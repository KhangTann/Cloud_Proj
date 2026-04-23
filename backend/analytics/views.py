from rest_framework.decorators import api_view
from rest_framework.response import Response
from bookings.models import Booking
from tours.models import Tour
from django.db.models import Sum

# 1. Revenue API
from .utils import read_csv_file


@api_view(['GET'])
def revenue(request):
    data = read_csv_file("gold_revenue_by_day.csv")

    return Response({
        "status": "success",
        "data": data
    })

# 2. Top Tours API
@api_view(['GET'])
def top_tours(request):
    data = read_csv_file("gold_top_tours.csv")

    return Response({
        "status": "success",
        "data": data
    })


# 3. Summary API
@api_view(['GET'])
def summary(request):
    data = read_csv_file("gold_summary.csv")

    return Response({
        "status": "success",
        "data": data[0] if data else {}
    })