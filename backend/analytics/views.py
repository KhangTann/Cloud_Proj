from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .utils import read_csv_file


@api_view(['GET'])
def revenue(request):
    try:
        data = read_csv_file("gold_revenue_by_day.csv")

        return Response({
            "status": "success",
            "data": data
        })

    except Exception as e:
        return Response({
            "status": "error",
            "message": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def top_tours(request):
    try:
        data = read_csv_file("gold_top_tours.csv")

        return Response({
            "status": "success",
            "data": data
        })

    except Exception as e:
        return Response({
            "status": "error",
            "message": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def summary(request):
    try:
        data = read_csv_file("gold_summary.csv")

        return Response({
            "status": "success",
            "data": data[0] if data else {}
        })

    except Exception as e:
        return Response({
            "status": "error",
            "message": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)