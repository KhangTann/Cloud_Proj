from rest_framework.decorators import api_view
from rest_framework.response import Response
from bookings.models import Booking
from tours.models import Tour
from django.db.models import Sum

# 1. Revenue API
@api_view(['GET'])
def revenue(request):
    total_revenue = Booking.objects.aggregate(
        total=Sum('total_price')
    )['total'] or 0

    return Response({
        "status": "success",
        "data": {
            "total_revenue": total_revenue
        }
    })


# 2. Top Tours API
@api_view(['GET'])
def top_tours(request):
    tours = (
        Booking.objects
        .values('tour__name')
        .annotate(total_bookings=Sum('num_people'))
        .order_by('-total_bookings')[:5]
    )

    return Response({
        "status": "success",
        "data": list(tours)
    })


# 3. Summary API
@api_view(['GET'])
def summary(request):
    total_users = Booking.objects.values('user').distinct().count()
    total_bookings = Booking.objects.count()

    return Response({
        "status": "success",
        "data": {
            "total_users": total_users,
            "total_bookings": total_bookings
        }
    })